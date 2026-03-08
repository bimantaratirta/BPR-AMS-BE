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
    // Always include employee relation
    if (!options.include?.employee) {
      options.include = {
        ...options.include,
        employee: { select: { id: true, name: true, nik: true, phone: true, role: true, avatar: true } },
      };
    }
    const [data, count, pendingCount, approvedCount, rejectedCount] = await Promise.all([
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

    if (!file) {
      throw BaseError.badRequest("File wajib diupload");
    }

    let uploaded = [];
    if (file.length) {
      uploaded = await Promise.all(
        file.map((f) => this.s3Service.uploadFile(f, "attachments")),
      );
    }

    if (currentUser.userType !== "EMPLOYEE") {
      throw BaseError.forbidden("Only employee can create leave request");
    }

    return this.prisma.$transaction(async (tx) => {
      // 1) Cek: sudah pernah membuat leave request hari ini?
      // Pakai WIB: Asia/Jakarta (paling aman pakai luxon/date-fns-tz)
      // Kalau kamu belum pakai library timezone, minimal bikin boundary "today" dari server timezone.
      const now = new Date();

      // Boundary start/end hari ini (berdasarkan timezone server).
      // Jika server kamu UTC, ini akan salah untuk WIB.
      const startOfToday = new Date(now);
      startOfToday.setHours(0, 0, 0, 0);

      const endOfToday = new Date(now);
      endOfToday.setHours(23, 59, 59, 999);

      const alreadyCreatedToday = await tx.leaveRequest.findFirst({
        where: {
          employeeId: data.employeeId,
          createdAt: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
        select: { id: true },
      });

      if (alreadyCreatedToday) {
        fail(
          "You already created a leave request today. Please try again tomorrow.",
          "leaveRequest",
        );
        throw new Joi.ValidationError(validation, stack);
      }

      // 2) Cek: overlap tanggal (yang kamu sudah punya)
      const existingLeaveRequest = await tx.leaveRequest.findFirst({
        where: {
          employeeId: data.employeeId,
          OR: [
            {
              startDate: { lte: data.endDate },
              endDate: { gte: data.startDate },
            },
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

      const created = await tx.leaveRequest.create({
        data: {
          type: data.type,
          startDate: data.startDate,
          endDate: data.endDate,
          reason: data.reason,
          attachment: uploaded[0], // atau pakai uploaded?.key/url kalau itu yang kamu mau
          employeeId: data.employeeId,
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
