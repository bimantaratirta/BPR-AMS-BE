import joi from "joi";
import BaseError from "../../../base_classes/base-error.js";
import { PrismaService } from "../../../common/service/prisma.service.js";
import { buildQueryOptions } from "../../../utils/buildQueryOptions.js";
import ragionQueryConfig from "./region-query-config.js";

class RegionService {
  constructor() {
    this.prisma = new PrismaService();
  }

  async create(currentUser, data) {
    let validation = "";
    let stack = [];
    const fail = (message, path) => {
      validation += (validation ? " " : "") + message;
      stack.push({ message, path: [path] });
    };
    if (currentUser.role !== "Direksi") {
      throw BaseError.forbidden(
        "You do not have permission to create a branch"
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // Cegah duplikasi nama region (yang aktif)
      const exists = await tx.region.findFirst({
        where: {
          region: data.region,
          // jika tidak pakai soft-delete middleware, tambahkan:
          // deleted_at: null,
        },
      });
      if (exists) {
        fail("Region name already exists", "region");
        throw new joi.ValidationError(validation, stack);
      }

      const created = await tx.region.create({
        data: { region: data.region },
      });

      if (!created) throw Error("Failed to create region");

      return created;
    });
  }

  async list({ query } = {}) {
    const options = buildQueryOptions(ragionQueryConfig, query);

    const [data, count] = await Promise.all([
      this.prisma.region.findMany({
        ...options,
        include: {
          branches: true, // Menyertakan relasi branches
        },
      }),
      this.prisma.region.count({ where: options.where }),
    ]);

    // Menambahkan jumlah cabang untuk setiap region
    const regionsWithBranchCount = data.map((region) => ({
      ...region,
      branchCount: region.branches.length, // Menambahkan jumlah cabang
    }));

    const page = query?.pagination?.page ?? 1;
    const limit = query?.pagination?.limit ?? 10;
    const hasPagination = !!(query?.pagination && !query?.get_all);
    const totalPages = hasPagination ? Math.ceil(count / limit) : 1;

    return {
      data: regionsWithBranchCount,
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

  async detail(id) {
    const region = await this.prisma.region.findUnique({
      where: { id },
      include: {
        branches: true, // Menyertakan relasi branches
      },
    });
    if (!region) throw BaseError.notFound("Region not found");

    // Menambahkan jumlah cabang ke dalam respons
    region.branchCount = region.branches.length; // Menambahkan jumlah cabang

    return region;
  }

  async update(currentUser, id, data) {
    let validation = "";
    let stack = [];
    const fail = (message, path) => {
      validation += (validation ? " " : "") + message;
      stack.push({ message, path: [path] });
    };
    if (currentUser.role !== "Direksi") {
      throw BaseError.forbidden(
        "You do not have permission to create a branch"
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const current = await tx.region.findUnique({ where: { id } });
      if (!current) throw BaseError.notFound("Region not found");

      // Cegah duplikasi nama (kecuali dirinya sendiri)
      if (data.region && data.region !== current.region) {
        const dup = await tx.region.findFirst({
          where: {
            region: data.region,
            // deleted_at: null,
            NOT: { id },
          },
        });
        if (dup) {
          fail("Region name already exists", "region");
          throw new joi.ValidationError(validation, stack);
        }
      }

      const updated = await tx.region.update({
        where: { id },
        data: { region: data.region },
      });

      return { message: "Region updated successfully", data: updated };
    });
  }

  async remove(id) {
    // Dengan prisma-soft-delete-middleware, .delete() akan set deleted_at
    const deleted = await this.prisma.region.delete({ where: { id } });
    // Jika tanpa middleware, ganti ke update:
    // const deleted = await this.prisma.region.update({ where: { id }, data: { deleted_at: new Date() } });

    return { message: "Region deleted successfully", data: deleted };
  }
}

export default new RegionService();
