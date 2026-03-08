import BaseError from "../../base_classes/base-error.js";
import { PrismaService } from "../../common/service/prisma.service.js";
import S3Service from "../../common/service/s3.service.js";
import { buildQueryOptions } from "../../utils/buildQueryOptions.js";
import attendanceQueryConfig from "./attendance-query-config.js";

function toRad(value) {
  return (value * Math.PI) / 180;
}

function getDistanceInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // meter
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getAttendanceStatusAndPoint(checkInTime) {
  const totalMinutes = checkInTime.getHours() * 60 + checkInTime.getMinutes();

  const eightAM = 8 * 60;
  const eightThirty = 8 * 60 + 30;

  if (totalMinutes <= eightAM) return { status: "HADIR", points: 1 };
  if (totalMinutes <= eightThirty) return { status: "TERLAMBAT", points: 0.5 };
  return { status: "TERLAMBAT", points: 0 };
}

function getAttendanceDate(now) {
  const hours = now.getUTCHours();
  const minutes = now.getUTCMinutes();

  const totalMinutes = hours * 60 + minutes;

  const start = 23 * 60; // 23:00
  const end = 10 * 60; // 10:00

  let attendanceDate = new Date(now);

  // kalau check-in >= 23:00
  if (totalMinutes >= start) {
    attendanceDate.setUTCDate(attendanceDate.getUTCDate() + 1);
  }

  return new Date(
    Date.UTC(
      attendanceDate.getUTCFullYear(),
      attendanceDate.getUTCMonth(),
      attendanceDate.getUTCDate(),
      0,
      0,
      0,
      0,
    ),
  );
}

function ensureCheckInBeforeCutoff(checkInTime) {
  const totalMinutes = checkInTime.getHours() * 60 + checkInTime.getMinutes();

  const start = 6 * 60; // 06:00
  const end = 17 * 60; // 23:59

  // karena melewati tengah malam
  if (!(totalMinutes >= start && totalMinutes <= end)) {
    throw BaseError.badRequest(
      "Check-in is only allowed between 06:00 and 17:00",
    );
  }
}

class AttendanceService {
  constructor() {
    // Initialize any necessary properties or dependencies here
    this.prisma = new PrismaService();
    this.s3Service = new S3Service();
  }

  async getAll({ query } = {}) {
    // Implement logic to retrieve all attendance records based on query parameters
    const options = buildQueryOptions(attendanceQueryConfig, query);
    const [data, count] = await Promise.all([
      this.prisma.attendance.findMany(options),
      this.prisma.attendance.count({ where: options.where }),
    ]);

    console.log(options);

    const page = query?.pagination?.page ?? 1;
    const limit = query?.pagination?.limit ?? 10;
    const hasPagination = !!(query?.pagination && !query?.get_all);
    const totalPages = hasPagination ? Math.ceil(count / limit) : 1;

    return {
      data,
      meta: hasPagination
        ? {
            totalItems: count,
            totalPages,
            currentPage: Number(page),
            itemsPerPage: Number(limit),
          }
        : null,
    };
  }

  async getById(id) {
    // Implement logic to retrieve a specific attendance record by its ID
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
    });

    if (!attendance) {
      throw BaseError.notFound("Attendance record not found");
    }

    return attendance;
  }

  async checkIn(currentUser, file = [], data) {
    if (currentUser.userType !== "EMPLOYEE") {
      throw BaseError.forbidden("Only employee can check in");
    }

    if (!file || !file.length) {
      throw BaseError.badRequest("checkInPhoto is required");
    }

    if (data?.checkInLat == null || data?.checkInLng == null) {
      throw BaseError.badRequest("checkInLat and checkInLng are required");
    }

    const now = new Date();
    ensureCheckInBeforeCutoff(now);

    const uploadedPhoto = await this.s3Service.uploadFile(
      file[0],
      "checkInPhotos",
    );

    return this.prisma.$transaction(async (tx) => {
      const employee = await tx.employee.findUnique({
        where: { id: currentUser.id },
      });
      if (!employee) throw BaseError.notFound("Employee not found");

      const branch = await tx.branch.findUnique({
        where: { id: employee.branchId },
      });
      if (!branch) throw BaseError.notFound("Branch not found");

      // date = start of day (konsisten sama @db.Date)
      const date = getAttendanceDate(now);

      // 1 user 1 attendance per day (pakai unique composite)
      const existing = await tx.attendance.findUnique({
        where: {
          employeeId_date: {
            employeeId: employee.id,
            date,
          },
        },
        select: { id: true },
      });

      if (existing) {
        throw BaseError.badRequest("You have already checked in today");
      }

      // (1) geofence: kalau di luar radius -> TOLAK
      const distance = getDistanceInMeters(
        data.checkInLat,
        data.checkInLng,
        branch.latitude,
        branch.longitude,
      );

      const insideRadius = distance <= branch.radius;

      if (!insideRadius) {
        throw BaseError.badRequest("You are outside the branch radius");
      }

      const { status, points } = getAttendanceStatusAndPoint(now);
      const attendance = await tx.attendance.create({
        data: {
          date,
          checkInTime: now,
          checkInLat: parseFloat(data.checkInLat),
          checkInLng: parseFloat(data.checkInLng),
          checkInPhoto: uploadedPhoto,
          checkInInsideRadius: true, // sudah pasti true karena kalau false ditolak

          status,
          points,
          isAutoGenerated: false,

          employeeId: employee.id,
          branchId: branch.id,
        },
      });

      if (!attendance) {
        throw BaseError.internalServerError(
          "Failed to create attendance record",
        );
      }

      const pointRecord = await tx.pointRecord.create({
        data: {
          date,
          points,
          checkInTime: now,
          type: status,
          employeeId: employee.id,
        },
      });

      if (!pointRecord) {
        throw BaseError.internalServerError("Failed to create point record");
      }

      return attendance;
    });
  }

  async checkOut(currentUser, data) {
    // 1️⃣ Hanya EMPLOYEE yang boleh checkout
    if (currentUser.userType !== "EMPLOYEE") {
      throw BaseError.forbidden("Only employee can check out");
    }

    if (data?.checkOutLat == null || data?.checkOutLng == null) {
      throw BaseError.badRequest("checkOutLat and checkOutLng are required");
    }

    console.log(data);

    const now = new Date();

    return this.prisma.$transaction(async (tx) => {
      // Pastikan employee ada & aktif
      const employee = await tx.employee.findUnique({
        where: { id: currentUser.id },
      });

      if (!employee) {
        throw BaseError.notFound("Employee not found");
      }

      if (!employee.isActive) {
        throw BaseError.forbidden("Inactive employee cannot check out");
      }

      // Ambil tanggal hari ini (start of day WIB)
      const date = getAttendanceDate(now);

      // 2️⃣ Attendance hari ini HARUS ada
      const attendance = await tx.attendance.findUnique({
        where: {
          employeeId_date: {
            employeeId: employee.id,
            date,
          },
        },
      });

      if (!attendance) {
        throw BaseError.badRequest(
          "You have not checked in today, cannot check out",
        );
      }

      // 5️⃣ Validasi employee ownership
      if (attendance.employeeId !== currentUser.id) {
        throw BaseError.forbidden(
          "You are not allowed to check out this attendance",
        );
      }

      // Tidak boleh checkout 2x
      if (attendance.checkOutTime) {
        throw BaseError.badRequest("You have already checked out today");
      }

      if (!attendance.checkInTime) {
        throw BaseError.badRequest(
          "Invalid attendance data (no check-in time)",
        );
      }

      // 3️⃣ Hitung durationMinutes
      const durationMinutes = Math.floor(
        (now.getTime() - attendance.checkInTime.getTime()) / (1000 * 60),
      );

      if (durationMinutes <= 0) {
        throw BaseError.badRequest("Invalid checkout time");
      }

      // 2️⃣ Update hanya field checkout
      return tx.attendance.update({
        where: { id: attendance.id },
        data: {
          checkOutTime: now,
          checkOutLat: parseFloat(data.checkOutLat),
          checkOutLng: parseFloat(data.checkOutLng),
          durationMinutes,
        },
      });
    });
  }

  async generateAutoAbsent() {
    const now = new Date();
    const date = getAttendanceDate(now);

    return this.prisma.$transaction(async (tx) => {
      const employees = await tx.employee.findMany({
        where: { isActive: true },
      });

      for (const emp of employees) {
        const existingAttendance = await tx.attendance.findUnique({
          where: {
            employeeId_date: {
              employeeId: emp.id,
              date,
            },
          },
        });

        // cek izin setengah hari
        const halfDayLeave = await tx.leaveRequest.findFirst({
          where: {
            employeeId: emp.id,
            status: "APPROVED",
            type: "IZIN_SETENGAH_HARI",
            startDate: { lte: date },
            endDate: { gte: date },
          },
        });

        // cek izin cuti / sakit
        const leave = await tx.leaveRequest.findFirst({
          where: {
            employeeId: emp.id,
            status: "APPROVED",
            type: {
              in: ["IZIN_CUTI", "IZIN_SAKIT"],
            },
            startDate: { lte: date },
            endDate: { gte: date },
          },
        });

        /**
         * ================================
         * CASE 1: IZIN SETENGAH HARI
         * ================================
         */
        if (halfDayLeave) {
          if (existingAttendance) {
            // jika sudah ada attendance (HADIR / ALPHA)
            await tx.attendance.update({
              where: { id: existingAttendance.id },
              data: {
                status: "IZIN_SETENGAH_HARI",
              },
            });
          } else {
            // jika belum ada attendance
            await tx.attendance.create({
              data: {
                date,
                status: "IZIN_SETENGAH_HARI",
                points: 0,
                isAutoGenerated: true,
                employeeId: emp.id,
                branchId: emp.branchId,
              },
            });
          }

          await tx.pointRecord.upsert({
            where: {
              employeeId_date: {
                employeeId: emp.id,
                date,
              },
            },
            update: {
              type: "IZIN_SETENGAH_HARI",
              points: 0,
            },
            create: {
              date,
              type: "IZIN_SETENGAH_HARI",
              points: 0,
              employeeId: emp.id,
            },
          });

          continue;
        }

        /**
         * ================================
         * CASE 2: SUDAH ADA ATTENDANCE
         * ================================
         */
        if (existingAttendance) continue;

        /**
         * ================================
         * CASE 3: IZIN CUTI / SAKIT
         * ================================
         */
        if (leave) {
          await tx.attendance.create({
            data: {
              date,
              status: leave.type,
              points: 0,
              isAutoGenerated: true,
              employeeId: emp.id,
              branchId: emp.branchId,
            },
          });

          await tx.pointRecord.create({
            data: {
              date,
              type: leave.type,
              points: 0,
              employeeId: emp.id,
            },
          });

          continue;
        }

        /**
         * ================================
         * CASE 4: ALPHA
         * ================================
         */
        await tx.attendance.create({
          data: {
            date,
            status: "ALPHA",
            points: 0,
            isAutoGenerated: true,
            employeeId: emp.id,
            branchId: emp.branchId,
          },
        });

        await tx.pointRecord.create({
          data: {
            date,
            type: "ALPHA",
            points: 0,
            employeeId: emp.id,
          },
        });
      }
    });
  }

  async generateAutoCheckout() {
    const now = new Date();

    const date = getAttendanceDate(now);

    // cari attendance yang sudah checkin tapi belum checkout
    const attendances = await this.prisma.attendance.findMany({
      where: {
        date,
        checkInTime: { not: null },
        checkOutTime: null,
        isAutoGenerated: false, // optional, supaya tidak sentuh ALPHA
      },
    });

    for (const att of attendances) {
      const durationMinutes = Math.floor(
        (now.getTime() - att.checkInTime.getTime()) / (1000 * 60),
      );

      await this.prisma.attendance.update({
        where: { id: att.id },
        data: {
          checkOutTime: now,
          checkOutLat: null,
          checkOutLng: null,
          durationMinutes,
        },
      });
    }
  }

  async delete(id) {
    // Implement logic to delete an attendance record by its ID
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
    });

    if (!attendance) {
      throw BaseError.notFound("Attendance record not found");
    }

    await this.prisma.attendance.delete({
      where: { id },
    });

    return { message: "Attendance record deleted successfully" };
  }
}

export default new AttendanceService();
