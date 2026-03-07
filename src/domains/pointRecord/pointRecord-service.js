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
  async getSummary({ startDate, endDate, branchId } = {}) {
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

    if (branchId) {
      where.employee = { branchId };
    }

    const records = await this.prisma.pointRecord.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            nik: true,
            branchId: true,
            branch: { select: { id: true, name: true } },
          },
        },
      },
    });

    // Aggregate per employee
    const employeeMap = {};
    for (const rec of records) {
      const empId = rec.employeeId;
      if (!employeeMap[empId]) {
        employeeMap[empId] = {
          employeeId: empId,
          name: rec.employee?.name ?? "-",
          nik: rec.employee?.nik ?? "-",
          branch: rec.employee?.branch?.name ?? "-",
          hadir: 0,
          terlambat05: 0,
          terlambat0: 0,
          alpha: 0,
          totalPoin: 0,
        };
      }

      const emp = employeeMap[empId];
      emp.totalPoin += rec.points;

      if (rec.type === "HADIR") emp.hadir++;
      else if (rec.type === "TERLAMBAT" && rec.points === 0.5) emp.terlambat05++;
      else if (rec.type === "TERLAMBAT" && rec.points === 0) emp.terlambat0++;
      else if (rec.type === "ALPHA") emp.alpha++;
    }

    return Object.values(employeeMap);
  }
}

export default new PointRecordService();
