import Joi from "joi";
import BaseError from "../../base_classes/base-error.js";
import { PrismaService } from "../../common/service/prisma.service.js";
import { buildQueryOptions } from "../../utils/buildQueryOptions.js";
import branchQueryConfig from "./branch-query-config.js";

class BranchService {
  constructor() {
    this.prisma = new PrismaService();
  }

  async getAll({ query } = {}) {
    const options = buildQueryOptions(branchQueryConfig, query);

    const [data, count] = await Promise.all([
      this.prisma.branch.findMany(options),
      this.prisma.branch.count({ where: options.where }),
    ]);

    const page = query?.pagination?.page ?? 1;
    const limit = query?.pagination?.limit ?? 10;
    const hasPagination = !!(query?.pagination && !query?.get_all);
    const totalPages = hasPagination ? Math.ceil(count / limit) : 1;

    return {
      data: data,
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
    const branch = await this.prisma.branch.findUnique({
      where: { id },
    });
    if (!branch) throw BaseError.notFound("Branch not found");
    return { data: branch };
  }

  async create(currentUser, data) {
    let validation = "";
    let stack = [];
    const fail = (message, path) => {
      validation += (validation ? " " : "") + message;
      stack.push({ message, path: [path] });
    };

    return this.prisma.$transaction(async (tx) => {
      const exists = await tx.branch.findFirst({
        where: {
          name: data.name,
        },
      });

      if (exists) {
        fail("Branch name already exists", "name");
        throw new Joi.ValidationError(validation, stack);
      }

      const created = await tx.branch.create({
        data: {
          name: data.name,
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
          radius: data.radius,
          isActive: data.isActive,
        },
      });

      if (!created) throw Error("Failed to create branch");

      return created;
    });
  }

  async update(id, data) {
    let validation = "";
    let stack = [];
    const fail = (message, path) => {
      validation += (validation ? " " : "") + message;
      stack.push({ message, path: [path] });
    };

    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.branch.findUnique({ where: { id } });
      if (!existing) throw BaseError.notFound("Branch not found");

      // kalau name di-update, cek duplikat (kecuali dirinya sendiri)
      if (data?.name && data.name !== existing.name) {
        const duplicate = await tx.branch.findFirst({
          where: {
            name: data.name,
            NOT: { id },
          },
        });

        if (duplicate) {
          fail("Branch name already exists", "name");
          throw new Joi.ValidationError(validation, stack);
        }
      }

      // update hanya field yang dikirim (partial update)
      const updated = await tx.branch.update({
        where: { id },
        data: {
          ...(data?.name !== undefined && { name: data.name }),
          ...(data?.address !== undefined && { address: data.address }),
          ...(data?.latitude !== undefined && { latitude: data.latitude }),
          ...(data?.longitude !== undefined && { longitude: data.longitude }),
          ...(data?.radius !== undefined && { radius: data.radius }),
          ...(data?.isActive !== undefined && { isActive: data.isActive }),
        },
      });

      if (!updated) throw Error("Failed to update branch");
      return updated;
    });
  }

  async delete(id) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.branch.findUnique({ where: { id } });
      if (!existing) throw BaseError.notFound("Branch not found");

      const deleted = await tx.branch.delete({ where: { id } });
      if (!deleted) throw Error("Failed to delete branch");

      return deleted;
    });
  }
}

export default new BranchService();
