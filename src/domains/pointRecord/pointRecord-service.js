import BaseError from "../../base_classes/base-error.js";
import { PrismaService } from "../../common/service/prisma.service.js";
import { buildQueryOptions } from "../../utils/buildQueryOptions.js";
import pointRecordQueryConfig from "./pointRecord-query-config.js";

class PointRecordService {
  constructor() {
    this.prisma = new PrismaService();
  }

  async getAll({ query } = {}) {
    const options = buildQueryOptions(pointRecordQueryConfig, query);
    const [data, count] = await Promise.all([
      this.prisma.pointRecord.findMany(options),
      this.prisma.pointRecord.count({ where: options.where }),
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
    const pointRecord = await this.prisma.pointRecord.findUnique({
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
      },
    });

    if (!pointRecord) {
      throw BaseError.notFound("Point record not found");
    }

    return pointRecord;
  }

  async delete(id) {
    const pointRecord = await this.prisma.pointRecord.findUnique({
      where: { id },
    });

    if (!pointRecord) {
      throw BaseError.notFound("Point record not found");
    }

    await this.prisma.pointRecord.delete({
      where: { id },
    });

    return { id };
  }
}

export default new PointRecordService();
