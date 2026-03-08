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
    // Always include branch relation
    if (!options.include?.branch) {
      options.include = {
        ...options.include,
        branch: { select: { id: true, name: true, address: true, latitude: true, longitude: true, radius: true, isActive: true } },
      };
    }
    const [data, count, registeredCount, totalAll, branches] = await Promise.all([
      this.prisma.employee.findMany(options),
      this.prisma.employee.count({ where: options.where }),
      this.prisma.employee.count({ where: { deviceId: { not: null } } }),
      this.prisma.employee.count(),
      this.prisma.branch.findMany({ select: { id: true, name: true } }),
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

    return employee;
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
