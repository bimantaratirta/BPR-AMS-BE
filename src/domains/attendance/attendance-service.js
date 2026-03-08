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
  const end = 20 * 60; // 17:00

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
    const options = buildQueryOptions(attendanceQueryConfig, query);

    // Convert date string filter to DateTime range (Prisma DateTime requires ISO-8601)
    if (options.where.date && typeof options.where.date === "string") {
      const dateStart = new Date(options.where.date + "T00:00:00.000Z");
      const dateEnd = new Date(options.where.date + "T00:00:00.000Z");
      dateEnd.setUTCDate(dateEnd.getUTCDate() + 1);
      options.where.date = { gte: dateStart, lt: dateEnd };
    }

    // Always include employee and branch relations
    options.include = {
      employee: {
        select: { id: true, name: true, nik: true, phone: true, role: true, avatar: true, branch: { select: { id: true, name: true } } },
      },
      branch: { select: { id: true, name: true } },
    };

    // Build status count where clause (same filters minus pagination)
    const statusWhere = { ...options.where };

    const [data, count, statusCounts, branches] = await Promise.all([
      this.prisma.attendance.findMany(options),
      this.prisma.attendance.count({ where: options.where }),
      this.prisma.attendance.groupBy({
        by: ["status"],
        where: statusWhere,
        _count: true,
      }),
      this.prisma.branch.findMany({ select: { id: true, name: true } }),
    ]);

    const page = query?.pagination?.page ?? 1;
    const limit = query?.pagination?.limit ?? 10;
    const hasPagination = !!(query?.pagination && !query?.get_all);
    const totalPages = hasPagination ? Math.ceil(count / limit) : 1;

    // Build stats from groupBy
    const statsMap = {};
    for (const row of statusCounts) {
      statsMap[row.status] = row._count;
    }
    const stats = {
      hadir: statsMap["HADIR"] ?? 0,
      terlambat: statsMap["TERLAMBAT"] ?? 0,
      izin: (statsMap["IZIN_CUTI"] ?? 0) + (statsMap["IZIN_SAKIT"] ?? 0) + (statsMap["IZIN_SETENGAH_HARI"] ?? 0) + (statsMap["CUTI"] ?? 0) + (statsMap["SAKIT"] ?? 0) + (statsMap["SETENGAH_HARI"] ?? 0),
      alpha: statsMap["ALPHA"] ?? 0,
    };

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
      stats,
      branches,
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
    // (2) Check-in terakhir jam 17:00
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

    const employees = await this.prisma.employee.findMany({
      where: { isActive: true },
    });

    for (const emp of employees) {
      const existing = await this.prisma.attendance.findUnique({
        where: {
          employeeId_date: {
            employeeId: emp.id,
            date,
          },
        },
      });

      if (!existing) {
        await this.prisma.attendance.create({
          data: {
            date,
            status: "ALPHA",
            points: 0,
            isAutoGenerated: true,
            employeeId: emp.id,
            branchId: emp.branchId,
          },
        });
      }
    }
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

  async getReportSummary({ startDate, endDate, branchId } = {}) {
    const where = {};
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setUTCDate(end.getUTCDate() + 1);
        where.date.lt = end;
      }
    }
    if (branchId) where.branchId = branchId;

    const [attendances, branches] = await Promise.all([
      this.prisma.attendance.findMany({
        where,
        include: {
          employee: {
            select: { name: true, nik: true, branch: { select: { name: true } } },
          },
        },
        orderBy: [{ employee: { name: "asc" } }, { date: "asc" }],
      }),
      this.prisma.branch.findMany({ select: { id: true, name: true } }),
    ]);

    const empMap = {};
    for (const att of attendances) {
      const empId = att.employeeId;
      if (!empMap[empId]) {
        empMap[empId] = {
          name: att.employee?.name ?? "-",
          nik: att.employee?.nik ?? "-",
          branch: att.employee?.branch?.name ?? "-",
          hadir: 0, terlambat: 0, izin: 0, alpha: 0, poin: 0,
        };
      }
      const row = empMap[empId];
      row.poin += att.points ?? 0;
      if (att.status === "HADIR") row.hadir++;
      else if (att.status === "TERLAMBAT") row.terlambat++;
      else if (att.status === "ALPHA") row.alpha++;
      else row.izin++;
    }

    return { data: Object.values(empMap), branches };
  }

  async exportXlsx({ startDate, endDate, branchId } = {}) {
    const ExcelJS = (await import("exceljs")).default;

    const where = {};
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setUTCDate(end.getUTCDate() + 1);
        where.date.lt = end;
      }
    }
    if (branchId) where.branchId = branchId;

    const attendances = await this.prisma.attendance.findMany({
      where,
      include: {
        employee: {
          select: { name: true, nik: true, branch: { select: { name: true } } },
        },
      },
      orderBy: [{ employee: { name: "asc" } }, { date: "asc" }],
    });

    // Aggregate per employee
    const empMap = {};
    for (const att of attendances) {
      const empId = att.employeeId;
      if (!empMap[empId]) {
        empMap[empId] = {
          name: att.employee?.name ?? "-",
          nik: att.employee?.nik ?? "-",
          branch: att.employee?.branch?.name ?? "-",
          hadir: 0, terlambat: 0, izin: 0, alpha: 0, poin: 0,
        };
      }
      const row = empMap[empId];
      row.poin += att.points ?? 0;
      if (att.status === "HADIR") row.hadir++;
      else if (att.status === "TERLAMBAT") row.terlambat++;
      else if (att.status === "ALPHA") row.alpha++;
      else row.izin++;
    }

    const rows = Object.values(empMap);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Laporan Absensi");

    sheet.columns = [
      { header: "Nama Karyawan", key: "name", width: 25 },
      { header: "NIK", key: "nik", width: 15 },
      { header: "Cabang", key: "branch", width: 20 },
      { header: "Hadir", key: "hadir", width: 10 },
      { header: "Terlambat", key: "terlambat", width: 12 },
      { header: "Izin", key: "izin", width: 10 },
      { header: "Alpha", key: "alpha", width: 10 },
      { header: "Total Poin", key: "poin", width: 12 },
    ];

    // Style header
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE2E8F0" } };

    for (const row of rows) {
      sheet.addRow(row);
    }

    // Totals
    const totals = rows.reduce(
      (acc, r) => ({ hadir: acc.hadir + r.hadir, terlambat: acc.terlambat + r.terlambat, izin: acc.izin + r.izin, alpha: acc.alpha + r.alpha, poin: acc.poin + r.poin }),
      { hadir: 0, terlambat: 0, izin: 0, alpha: 0, poin: 0 },
    );
    const totalRow = sheet.addRow({ name: "TOTAL", nik: "", branch: "", ...totals });
    totalRow.font = { bold: true };

    return workbook.xlsx.writeBuffer();
  }

  async update(id, data) {
    const allowedFields = ["status", "points", "checkInTime", "checkOutTime"];
    const updateData = {};

    for (const key of allowedFields) {
      if (data[key] !== undefined) {
        updateData[key] = data[key];
      }
    }

    if (updateData.checkInTime) {
      updateData.checkInTime = new Date(updateData.checkInTime);
    }
    if (updateData.checkOutTime) {
      updateData.checkOutTime = new Date(updateData.checkOutTime);
    }
    if (updateData.points !== undefined) {
      updateData.points = parseFloat(updateData.points);
    }

    return this.prisma.$transaction(async (tx) => {
      const attendance = await tx.attendance.findUnique({ where: { id } });
      if (!attendance) {
        throw BaseError.notFound("Attendance record not found");
      }

      return tx.attendance.update({
        where: { id },
        data: updateData,
      });
    });
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
