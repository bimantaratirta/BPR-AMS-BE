import joi from 'joi';
import BaseError from '../../../base_classes/base-error.js';
import { PrismaService } from '../../../common/service/prisma.service.js';

class BranchService {
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
      // Cegah duplikasi nama branch (yang aktif)
      const exists = await tx.branch.findFirst({
        where: {
          branch: data.branch,
          // jika tidak pakai soft-delete middleware, tambahkan:
          // deleted_at: null,
        },
      });
      if (exists) {
        fail('Branch name already exists', 'branch');
        throw new joi.ValidationError(validation, stack);
      }

      const regionExists = await tx.region.findFirst({
        where: {
          id: data.region_id,
          // jika tidak pakai soft-delete middleware, tambahkan:
          // deleted_at: null,
        },
      });
      if (regionExists) {
        fail('Region does not exist', 'region_id');
        throw new joi.ValidationError(validation, stack);
      }

      const created = await tx.branch.create({
        data: data,
      });

      if (!created) throw Error('Failed to create branch');

      return { message: 'Branch created successfully', data: created };
    });
  }

  async list({
    q,
    page = 1,
    per_page = 10,
    order_by = 'created_at',
    order = 'desc',
  } = {}) {
    const where = q ? { branch: { contains: q, mode: 'insensitive' } } : {};

    const skip = (Number(page) - 1) * Number(per_page);
    const take = Number(per_page);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.branch.findMany({
        where,
        orderBy: { [order_by]: order },
        skip,
        take,
      }),
      this.prisma.branch.count({ where }),
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
    const branch = await this.prisma.branch.findUnique({ where: { id } });
    if (!branch) throw BaseError.notFound('Branch not found');
    return { data: branch };
  }

  async update(id, data) {
    let validation = '';
    let stack = [];
    const fail = (message, path) => {
      validation += (validation ? ' ' : '') + message;
      stack.push({ message, path: [path] });
    };

    return this.prisma.$transaction(async (tx) => {
      const current = await tx.branch.findUnique({ where: { id } });
      if (!current) throw BaseError.notFound('Branch not found');

      // Cegah duplikasi nama (kecuali dirinya sendiri)
      if (data.branch && data.branch !== current.branch) {
        const dup = await tx.branch.findFirst({
          where: {
            branch: data.branch,
            // deleted_at: null,
            NOT: { id },
          },
        });
        if (dup) {
          fail('Branch name already exists', 'branch');
          throw new joi.ValidationError(validation, stack);
        }
      }

      const regionExists = await tx.region.findFirst({
        where: {
          id: data.region_id,
          // jika tidak pakai soft-delete middleware, tambahkan:
          // deleted_at: null,
        },
      });
      if (regionExists) {
        fail('Region does not exist', 'region_id');
        throw new joi.ValidationError(validation, stack);
      }

      const updated = await tx.branch.update({
        where: { id },
        data: data,
      });

      return { message: 'Branch updated successfully', data: updated };
    });
  }

  async remove(id) {
    // Dengan prisma-soft-delete-middleware, .delete() akan set deleted_at
    const deleted = await this.prisma.branch.delete({ where: { id } });
    // Jika tanpa middleware, ganti ke update:
    // const deleted = await this.prisma.branch.update({ where: { id }, data: { deleted_at: new Date() } });

    return { message: 'Branch deleted successfully', data: deleted };
  }
}

export default new BranchService();
