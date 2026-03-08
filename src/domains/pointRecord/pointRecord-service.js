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
  async getSummary({ startDate, endDate, branchId, search, page = 1, limit = 20 } = {}) {
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const offset = (pageNum - 1) * limitNum;

    // Build WHERE conditions
    const conditions = [];
    const params = [];
    let idx = 1;

    if (startDate) {
      conditions.push(`pr."date" >= $${idx++}`);
      params.push(new Date(startDate));
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setUTCDate(end.getUTCDate() + 1);
      conditions.push(`pr."date" < $${idx++}`);
      params.push(end);
    }
    if (branchId) {
      conditions.push(`e."branchId" = $${idx++}`);
      params.push(branchId);
    }
    if (search) {
      conditions.push(`(LOWER(e."name") LIKE $${idx} OR e."nik" LIKE $${idx})`);
      params.push(`%${search.toLowerCase()}%`);
      idx++;
    }

    const where = conditions.length > 0 ? conditions.join(" AND ") : "TRUE";

    const dataQuery = `
      SELECT
        pr."employeeId",
        e."name",
        e."nik",
        COALESCE(b."name", '-') as branch,
        COALESCE(SUM(pr."points"), 0) as "totalPoin",
        COUNT(*) FILTER (WHERE pr."type" = 'HADIR') as hadir,
        COUNT(*) FILTER (WHERE pr."type" = 'TERLAMBAT' AND pr."points" = 0.5) as terlambat05,
        COUNT(*) FILTER (WHERE pr."type" = 'TERLAMBAT' AND pr."points" = 0) as terlambat0,
        COUNT(*) FILTER (WHERE pr."type" = 'ALPHA') as alpha
      FROM point_records pr
      JOIN employees e ON e."id" = pr."employeeId"
      LEFT JOIN branches b ON b."id" = e."branchId"
      WHERE ${where}
      GROUP BY pr."employeeId", e."name", e."nik", b."name"
      ORDER BY "totalPoin" DESC
      LIMIT $${idx++} OFFSET $${idx++}
    `;

    const metricsQuery = `
      WITH agg AS (
        SELECT
          pr."employeeId",
          COALESCE(SUM(pr."points"), 0) as poin,
          COUNT(*) FILTER (WHERE pr."type" = 'HADIR') as hadir,
          COUNT(*) FILTER (WHERE pr."type" = 'TERLAMBAT') as terlambat
        FROM point_records pr
        JOIN employees e ON e."id" = pr."employeeId"
        WHERE ${where}
        GROUP BY pr."employeeId"
      )
      SELECT
        COUNT(*) as "totalEmployees",
        COALESCE(SUM(poin), 0) as "totalPoin",
        CASE WHEN COUNT(*) > 0 THEN ROUND(SUM(poin)::numeric / COUNT(*), 1) ELSE 0 END as "avgPoin",
        COALESCE(SUM(hadir), 0) as "totalHadir",
        COALESCE(SUM(terlambat), 0) as "totalTerlambat"
      FROM agg
    `;

    const [data, metricsResult, branches] = await Promise.all([
      this.prisma.$queryRawUnsafe(dataQuery, ...params, limitNum, offset),
      this.prisma.$queryRawUnsafe(metricsQuery, ...params),
      this.prisma.branch.findMany({ select: { id: true, name: true } }),
    ]);

    const met = metricsResult[0] ?? {};
    const totalItems = Number(met.totalEmployees ?? 0);
    const totalPages = Math.ceil(totalItems / limitNum) || 1;

    // Convert BigInt from raw query to Number
    const formattedData = data.map((row) => ({
      employeeId: row.employeeId,
      name: row.name,
      nik: row.nik,
      branch: row.branch,
      hadir: Number(row.hadir),
      terlambat05: Number(row.terlambat05),
      terlambat0: Number(row.terlambat0),
      alpha: Number(row.alpha),
      totalPoin: Number(row.totalPoin),
    }));

    return {
      data: formattedData,
      meta: {
        totalItems,
        totalPages,
        currentPage: pageNum,
        itemsPerPage: limitNum,
      },
      metrics: {
        totalPoin: Number(met.totalPoin ?? 0),
        avgPoin: Number(met.avgPoin ?? 0),
        totalHadir: Number(met.totalHadir ?? 0),
        totalTerlambat: Number(met.totalTerlambat ?? 0),
      },
      branches,
    };
  }
}

export default new PointRecordService();
