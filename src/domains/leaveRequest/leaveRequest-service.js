import Joi from "joi";
import BaseError from "../../base_classes/base-error.js";
import { PrismaService } from "../../common/service/prisma.service.js";
import { buildQueryOptions } from "../../utils/buildQueryOptions.js";
import leaveRequestQueryConfig from "./leaveRequest-query-config.js";
import S3Service from "../../common/service/s3.service.js";

class LeaveRequestService {
  constructor() {
    this.prisma = new PrismaService();
    this.s3Service = new S3Service();
  }

  async getAll({ query } = {}) {
    const options = buildQueryOptions(leaveRequestQueryConfig, query);

    // Filter by month (format: "YYYY-MM")
    if (query?.filter?.month) {
      const [year, month] = query.filter.month.split("-").map(Number);

      const startDate = new Date(Date.UTC(year, month - 1, 1));
      const endDate = new Date(Date.UTC(year, month, 1));

      options.where.startDate = {
        gte: startDate,
        lt: endDate,
      };
    }

    // Always include employee relation
    if (!options.include?.employee) {
      options.include = {
        ...options.include,
        employee: {
          select: {
            id: true,
            name: true,
            nik: true,
            phone: true,
            role: true,
            avatar: true,
          },
        },
      };
    }
    const [data, count, pendingCount, approvedCount, rejectedCount] =
      await Promise.all([
        this.prisma.leaveRequest.findMany(options),
        this.prisma.leaveRequest.count({ where: options.where }),
        this.prisma.leaveRequest.count({ where: { status: "PENDING" } }),
        this.prisma.leaveRequest.count({ where: { status: "APPROVED" } }),
        this.prisma.leaveRequest.count({ where: { status: "REJECTED" } }),
      ]);

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
      counts: {
        PENDING: pendingCount,
        APPROVED: approvedCount,
        REJECTED: rejectedCount,
      },
    };
  }

  async getById(id) {
    const leaveRequest = await this.prisma.leaveRequest.findUnique({
      where: { id },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            nik: true,
            phone: true,
            role: true,
            avatar: true,
          },
        },
        approvedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
    if (!leaveRequest) throw BaseError.notFound("Leave request not found");
    return { data: leaveRequest };
  }

  async create(currentUser, file = [], data) {
    let validation = "";
    let stack = [];
    const fail = (message, path) => {
      validation += (validation ? " " : "") + message;
      stack.push({ message, path: [path] });
    };

    if (!file || file.length === 0) {
      throw BaseError.badRequest("File wajib diupload");
    }

    const uploaded = file.length
      ? await Promise.all(
          file.map((f) => this.s3Service.uploadFile(f, "attachments")),
        )
      : [];

    if (currentUser.userType !== "EMPLOYEE") {
      throw BaseError.forbidden("Only employee can create leave request");
    }

    return this.prisma.$transaction(async (tx) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      const dayCount =
        Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

      // VALIDASI KHUSUS UNTUK IZIN_CUTI
      if (data.type === "IZIN_CUTI") {
        const currentYear = startDate.getFullYear();

        // Hitung total cuti IZIN_CUTI yang sudah diambil tahun ini
        const leaveRecords = await tx.leaveRequest.findMany({
          where: {
            employeeId: currentUser.id,
            type: "IZIN_CUTI",
            status: "APPROVED",
            startDate: { gte: new Date(`${currentYear}-01-01`) },
            endDate: { lte: new Date(`${currentYear}-12-31`) },
          },
          select: { startDate: true, endDate: true },
        });

        const usedDays = leaveRecords.reduce((sum, lr) => {
          return (
            sum +
            Math.floor(
              (new Date(lr.endDate) - new Date(lr.startDate)) /
                (1000 * 60 * 60 * 24),
            ) +
            1
          );
        }, 0);

        if (usedDays >= 12) {
          fail(
            "You have already used your 12 days of annual leave",
            "leaveRequest",
          );
          throw new Joi.ValidationError(validation, stack);
        }

        if (dayCount > 3) {
          fail(
            "IZIN_CUTI can only be requested for a maximum of 3 days at a time",
            "leaveRequest",
          );
          throw new Joi.ValidationError(validation, stack);
        }

        if (usedDays + dayCount > 12) {
          fail(
            `You can only take ${12 - usedDays} more days of IZIN_CUTI this year`,
            "leaveRequest",
          );
          throw new Joi.ValidationError(validation, stack);
        }
      }

      // VALIDASI OVERLAP UNTUK SEMUA TYPE LEAVE
      const existingLeaveRequest = await tx.leaveRequest.findFirst({
        where: {
          employeeId: currentUser.id,
          AND: [
            { startDate: { lte: endDate } },
            { endDate: { gte: startDate } },
          ],
        },
      });

      if (existingLeaveRequest) {
        fail(
          "You already have a pending leave request that overlaps with the requested dates",
          "leaveRequest",
        );
        throw new Joi.ValidationError(validation, stack);
      }

      // CREATE LEAVE REQUEST
      const created = await tx.leaveRequest.create({
        data: {
          type: data.type,
          startDate: data.startDate,
          endDate: data.endDate,
          reason: data.reason,
          attachment: uploaded[0] || null,
          employeeId: currentUser.id,
        },
      });

      if (!created) {
        fail("Failed to create leave request", "leaveRequest");
        throw new Joi.ValidationError(validation, stack);
      }

      return created;
    });
  }

  async update(id, currentUser, data) {
    let validation = "";
    let stack = [];

    const fail = (message, path) => {
      validation += (validation ? " " : "") + message;
      stack.push({ message, path: [path] });
    };

    // 1️⃣ Cek Role
    if (!["ADMIN", "SUPER_ADMIN"].includes(currentUser.userType)) {
      throw BaseError.forbidden(
        "Only admin can approve or reject leave request",
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // 3️⃣ Ambil data
      const leave = await tx.leaveRequest.findUnique({
        where: { id },
      });

      if (!leave) {
        fail("Leave request not found", "id");
        throw new Joi.ValidationError(validation, stack);
      }

      // 4️⃣ Cek status masih PENDING
      if (leave.status !== "PENDING") {
        fail("Only pending leave request can be updated", "status");
        throw new Joi.ValidationError(validation, stack);
      }

      // 5️⃣ Jika reject wajib isi alasan
      if (data.status === "REJECTED" && !data.rejectReason) {
        fail(
          "Reject reason is required when rejecting request",
          "rejectReason",
        );
        throw new Joi.ValidationError(validation, stack);
      }
      // 6️⃣ Update
      const updated = await tx.leaveRequest.update({
        where: { id },
        data: {
          status: data.status,
          approvedById: currentUser.id,
          approvedAt: new Date(),

          ...(data.status === "REJECTED" && {
            rejectReason: data.rejectReason,
          }),
        },
      });

      if (!updated) {
        fail("Failed to update leave request", "leaveRequest");
        throw new Joi.ValidationError(validation, stack);
      }

      return updated;
    });
  }

  async delete(id) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.leaveRequest.findUnique({ where: { id } });
      if (!existing) throw BaseError.notFound("Leave Request not found");

      const deleted = await tx.leaveRequest.delete({ where: { id } });
      if (!deleted) throw Error("Failed to delete Leave Request");

      return deleted;
    });
  }
}

export default new LeaveRequestService();
