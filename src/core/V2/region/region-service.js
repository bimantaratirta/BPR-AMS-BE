import joi from 'joi';
import BaseError from '../../../base_classes/base-error.js';
import { PrismaService } from '../../../common/service/prisma.service.js';

class RegionService {
  constructor() {
    this.prisma = new PrismaService();
  }

  async create(data) {
    let validation = '';
    let stack = [];
    const fail = (message, path) => {
      validation += (validation ? ' ' : '') + message;
      stack.push({ message, path: [path] });
    };

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
        fail('Region name already exists', 'region');
        throw new joi.ValidationError(validation, stack);
      }

      const created = await tx.region.create({
        data: { region: data.region },
      });

      if (!created) throw Error('Failed to create region');

      return { message: 'Region created successfully', data: created };
    });
  }

  async list({
    q,
    page = 1,
    per_page = 10,
    order_by = 'created_at',
    order = 'desc',
  } = {}) {
    const where = q ? { region: { contains: q, mode: 'insensitive' } } : {};

    const skip = (Number(page) - 1) * Number(per_page);
    const take = Number(per_page);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.region.findMany({
        where,
        orderBy: { [order_by]: order },
        skip,
        take,
      }),
      this.prisma.region.count({ where }),
    ]);

    return {
      data: items,
      meta: {
        page: Number(page),
        per_page: Number(per_page),
        total,
        total_pages: Math.ceil(total / Number(per_page) || 1),
      },
    };
  }

  async detail(id) {
    const region = await this.prisma.region.findUnique({ where: { id } });
    if (!region) throw BaseError.notFound('Region not found');
    return { data: region };
  }

  async update(id, data) {
    let validation = '';
    let stack = [];
    const fail = (message, path) => {
      validation += (validation ? ' ' : '') + message;
      stack.push({ message, path: [path] });
    };

    return this.prisma.$transaction(async (tx) => {
      const current = await tx.region.findUnique({ where: { id } });
      if (!current) throw BaseError.notFound('Region not found');

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
          fail('Region name already exists', 'region');
          throw new joi.ValidationError(validation, stack);
        }
      }

      const updated = await tx.region.update({
        where: { id },
        data: { region: data.region },
      });

      return { message: 'Region updated successfully', data: updated };
    });
  }

  async remove(id) {
    // Dengan prisma-soft-delete-middleware, .delete() akan set deleted_at
    const deleted = await this.prisma.region.delete({ where: { id } });
    // Jika tanpa middleware, ganti ke update:
    // const deleted = await this.prisma.region.update({ where: { id }, data: { deleted_at: new Date() } });

    return { message: 'Region deleted successfully', data: deleted };
  }
}

export default new RegionService();
