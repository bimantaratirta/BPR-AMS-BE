import BaseError from "../../base_classes/base-error.js";
import { PrismaService } from "../../common/service/prisma.service.js";
import { buildQueryOptions } from "../../utils/buildQueryOptions.js";
import notificationQueryConfig from "./notification-query-config.js";

class NotificationService {
  constructor() {
    this.prisma = new PrismaService();
  }

  async getAll({ query, currentUser } = {}) {
    const options = buildQueryOptions(notificationQueryConfig, query);

    // If employee, only show their notifications + broadcast (employeeId = null)
    if (currentUser?.userType === "EMPLOYEE") {
      options.where = {
        ...options.where,
        OR: [
          { employeeId: currentUser.id },
          { employeeId: null },
        ],
      };
    }

    const [data, count] = await Promise.all([
      this.prisma.notification.findMany(options),
      this.prisma.notification.count({ where: options.where }),
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

  async markAsRead(id) {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    if (!notification) {
      throw BaseError.notFound("Notification not found");
    }

    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(currentUser) {
    const where = {};
    if (currentUser?.userType === "EMPLOYEE") {
      where.OR = [
        { employeeId: currentUser.id },
        { employeeId: null },
      ];
    }
    where.isRead = false;

    const result = await this.prisma.notification.updateMany({
      where,
      data: { isRead: true },
    });

    return { count: result.count };
  }

  async getUnreadCount(currentUser) {
    const where = { isRead: false };
    if (currentUser?.userType === "EMPLOYEE") {
      where.OR = [
        { employeeId: currentUser.id },
        { employeeId: null },
      ];
    }

    const count = await this.prisma.notification.count({ where });
    return { count };
  }
}

export default new NotificationService();
