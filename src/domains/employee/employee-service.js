import BaseError from "../../base_classes/base-error.js";
import { PrismaService } from "../../common/service/prisma.service.js";
import S3Service from "../../common/service/s3.service.js";
import { buildQueryOptions } from "../../utils/buildQueryOptions.js";
import employeeQueryConfig from "./employee-query-config.js";
import { hashPassword } from "../../utils/passwordConfig.js";

class EmployeeService {
  constructor() {
    this.prisma = new PrismaService();
    this.s3Service = new S3Service();
  }

  async getAll({ query } = {}) {
    const options = buildQueryOptions(employeeQueryConfig, query);

    // Include branch
    if (!options.include?.branch) {
      options.include = {
        ...options.include,
        branch: {
          select: {
            id: true,
            name: true,
            address: true,
            latitude: true,
            longitude: true,
            radius: true,
            isActive: true,
          },
        },
      };
    }

    const [data, count, registeredCount, totalAll, branches] =
      await Promise.all([
        this.prisma.employee.findMany(options),
        this.prisma.employee.count({ where: options.where }),
        this.prisma.employee.count({ where: { deviceId: { not: null } } }),
        this.prisma.employee.count(),
        this.prisma.branch.findMany({ select: { id: true, name: true } }),
      ]);

    // Hitung cuti IZIN_CUTI yang approved
    const employeeIds = data.map((e) => e.id);
    const currentYear = new Date().getFullYear();

    const leaveRecords = await this.prisma.leaveRequest.findMany({
      where: {
        employeeId: { in: employeeIds },
        type: "IZIN_CUTI",
        status: "APPROVED",
        startDate: { gte: new Date(`${currentYear}-01-01`) },
        endDate: { lte: new Date(`${currentYear}-12-31`) },
      },
      select: { employeeId: true, startDate: true, endDate: true },
    });

    // Hitung jumlah hari cuti per employee
    const leaveStats = leaveRecords.reduce((acc, lr) => {
      const days =
        (new Date(lr.endDate).getTime() - new Date(lr.startDate).getTime()) /
          (1000 * 60 * 60 * 24) +
        1;
      acc[lr.employeeId] = (acc[lr.employeeId] || 0) + days;
      return acc;
    }, {});

    // Tambahkan usedAnnualLeave ke data employee
    const enrichedData = data.map((emp) => ({
      ...emp,
      usedAnnualLeave: Math.min(leaveStats[emp.id] || 0, 12), // maksimal 12 hari
    }));

    const page = query?.pagination?.page ?? 1;
    const limit = query?.pagination?.limit ?? 10;
    const hasPagination = !!(query?.pagination && !query?.get_all);
    const totalPages = hasPagination ? Math.ceil(count / limit) : 1;

    return {
      data: enrichedData,
      meta: hasPagination
        ? {
            totalItems: count,
            totalPages,
            currentPage: Number(page),
            itemsPerPage: Number(limit),
          }
        : null,
      stats: {
        total: totalAll,
        registered: registeredCount,
        unregistered: totalAll - registeredCount,
      },
      branches,
    };
  }

  async getById(id) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        branch: {
          select: {
            id: true,
            name: true,
            address: true,
            latitude: true,
            longitude: true,
            radius: true,
            isActive: true,
          },
        },
      },
    });

    if (!employee) {
      throw BaseError.notFound("Employee not found");
    }

    const currentYear = new Date().getFullYear();
    const leaveRecords = await this.prisma.leaveRequest.findMany({
      where: {
        employeeId: id,
        type: "IZIN_CUTI",
        status: "APPROVED",
        startDate: { gte: new Date(`${currentYear}-01-01`) },
        endDate: { lte: new Date(`${currentYear}-12-31`) },
      },
      select: { startDate: true, endDate: true },
    });

    const usedAnnualLeave = leaveRecords.reduce((sum, lr) => {
      const days =
        (new Date(lr.endDate).getTime() - new Date(lr.startDate).getTime()) /
          (1000 * 60 * 60 * 24) +
        1;
      return sum + days;
    }, 0);

    return {
      ...employee,
      usedAnnualLeave: Math.min(usedAnnualLeave, 12), // maksimal 12 hari
    };
  }
  async create(data) {
    const hashedPassword = await hashPassword(data.password);
    try {
      const employee = await this.prisma.employee.create({
        data: {
          nik: data.nik,
          name: data.name,
          email: data.email,
          password: hashedPassword,
          phone: data.phone,
          role: data.role,
          branchId: data.branchId,
          isActive: data.isActive ?? true,
        },
      });
      const { password, ...result } = employee;
      return result;
    } catch (error) {
      if (error.code === "P2002") {
        const field = error.meta?.target?.[0] ?? "field";
        const labels = { nik: "NIK", email: "Email" };
        throw BaseError.duplicate(`${labels[field] ?? field} sudah terdaftar.`);
      }
      throw error;
    }
  }

  async update(id, file = [], data) {
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
        file.map((f) => this.s3Service.uploadFile(f, "avatars")),
      );
    }
    try {
      return this.prisma.$transaction(async (tx) => {
        const employee = await tx.employee.findUnique({ where: { id } });
        if (!employee) {
          throw BaseError.notFound("Employee not found");
        }

        if (uploaded.length) {
          data.avatar = uploaded[0];
        }

        if (typeof data.isActive === "string") {
          data.isActive = data.isActive === "true";
        }

        const updatedEmployee = await tx.employee.update({
          where: { id },
          data,
        });

        if (!updatedEmployee) {
          throw BaseError.internalServer("Failed to update employee");
        }

        return updatedEmployee;
      });
    } catch (error) {
      if (error.code === "P2002") {
        const field = error.meta?.target?.[0] ?? "field";
        const labels = { nik: "NIK", email: "Email" };
        throw BaseError.duplicate(`${labels[field] ?? field} sudah terdaftar.`);
      }
      throw error;
    }
  }

  async delete(id) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.employee.findUnique({ where: { id } });
      if (!existing) throw BaseError.notFound("Employee not found");

      const deleted = await tx.employee.delete({ where: { id } });
      if (!deleted) throw BaseError.internalServer("Failed to delete employee");

      return deleted;
    });
  }
}
export default new EmployeeService();
