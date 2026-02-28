import BaseError from "../../base_classes/base-error.js";
import { PrismaService } from "../../common/service/prisma.service.js";
import { buildQueryOptions } from "../../utils/buildQueryOptions.js";
import { hashPassword } from "../../utils/passwordConfig.js";
import adminQueryConfig from "./admin-query-config.js";

class AdminService {
  constructor() {
    this.prisma = new PrismaService();
  }
  async getAll({ query } = {}) {
    const options = buildQueryOptions(adminQueryConfig, query);
    const [data, count] = await Promise.all([
      this.prisma.admin.findMany(options),
      this.prisma.admin.count({ where: options.where }),
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
    };
  }

  async getById(id) {
    const admin = await this.prisma.admin.findUnique({
      where: { id },
    });

    if (!admin) {
      throw BaseError.notFound("Admin not found");
    }

    return admin;
  }

  async update(id, data) {
    return this.prisma.$transaction(async (tx) => {
      const admin = await tx.admin.findUnique({
        where: { id },
      });

      if (!admin) {
        throw BaseError.notFound("Admin not found");
      }

      // Allowed fields only
      const allowedFields = ["name", "email", "password", "role", "status"];

      const updateData = {};

      for (const key of allowedFields) {
        if (data[key] !== undefined) {
          updateData[key] = data[key];
        }
      }

      // 🔥 Email unique validation
      if (updateData.email && updateData.email !== admin.email) {
        const existingEmail = await tx.admin.findUnique({
          where: { email: updateData.email },
        });

        if (existingEmail) {
          throw BaseError.badRequest("Email already in use");
        }
      }

      // 🔐 Hash password kalau diupdate
      if (updateData.password) {
        updateData.password = await hashPassword(updateData.password);
      }

      const updatedAdmin = await tx.admin.update({
        where: { id },
        data: updateData,
      });

      return updatedAdmin;
    });
  }
}

export default new AdminService();
