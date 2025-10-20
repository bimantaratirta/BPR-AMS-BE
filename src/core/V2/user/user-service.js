import joi from "joi";
import BaseError from "../../../base_classes/base-error.js";
import { PrismaService } from "../../../common/service/prisma.service.js";
import { buildQueryOptions } from "../../../utils/buildQueryOptions.js";
import userQueryConfig from "./user-query-config.js";

class UserService {
  constructor() {
    this.prisma = new PrismaService();
  }

  async List() {
    const user = await this.prisma.user.findMany();
    if (user.length === 0) throw BaseError.notFound("user not found");
    return user;
  }

  async ListLoBySlo(id, { query } = {}) {
    const options = buildQueryOptions(userQueryConfig, query, {
      role: "LO",
      supervisor_id: id,
    });

    const [data, count] = await Promise.all([
      this.prisma.user.findMany(options),
      this.prisma.user.count({ where: options.where }),
    ]);

    if (data.length === 0) throw BaseError.notFound("LO not found");

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

  // List SLO by AM with filters, search, and pagination
  async ListSloByAm(id, { query } = {}) {
    const options = buildQueryOptions(userQueryConfig, query, {
      role: "SLO",
      supervisor_id: id,
    });

    console.log(options);

    const [data, count] = await Promise.all([
      this.prisma.user.findMany(options),
      this.prisma.user.count({ where: options.where }),
    ]);

    if (data.length === 0) throw BaseError.notFound("SLO not found");

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
}

export default new UserService();
