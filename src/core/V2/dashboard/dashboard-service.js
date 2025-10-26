import BaseError from "../../../base_classes/base-error.js";
import { PrismaService } from "../../../common/service/prisma.service.js";
import { startOfISOWeek, endOfISOWeek, subWeeks } from "date-fns";

class DashboardService {
  constructor() {
    this.prisma = new PrismaService();
  }

  async dashboardLo(currentUser) {
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findFirst({
        where: { id: currentUser.id, role: "LO" },
      });
      if (!user) throw BaseError.forbidden("Only LO can access");

      const startOfWeek = startOfISOWeek(new Date());
      const endOfWeek = endOfISOWeek(new Date());

      // Mengambil tanggal awal dan akhir minggu lalu
      const startOfPreviousWeek = subWeeks(startOfWeek, 1);
      const endOfPreviousWeek = subWeeks(endOfWeek, 1);

      const customersThisWeek = await tx.customer.groupBy({
        by: ["created_at"],
        where: {
          created_by: currentUser.id,
          created_at: {
            gte: startOfWeek,
            lte: endOfWeek,
          },
        },
        _count: {
          created_at: true,
        },
      });

      // Menyiapkan array untuk data mingguan
      const weeklyData = new Array(7).fill(0); // 7 hari dalam seminggu (Senin-Minggu)

      customersThisWeek.forEach((customer) => {
        const dayOfWeek = new Date(customer.created_at).getDay(); // 0 (Minggu) - 6 (Sabtu)
        weeklyData[dayOfWeek] += customer._count.created_at;
      });

      const previousWeekCustomers = await tx.customer.groupBy({
        by: ["created_at"],
        where: {
          created_by: currentUser.id,
          created_at: {
            gte: startOfPreviousWeek,
            lte: endOfPreviousWeek,
          },
        },
        _count: {
          created_at: true,
        },
      });

      // Menghitung jumlah pelanggan minggu lalu
      const previousWeekTotal = previousWeekCustomers.reduce(
        (a, b) => a + b._count.created_at,
        0
      );
      const currentWeekTotal = weeklyData.reduce((a, b) => a + b, 0);

      // Menghitung perubahan persentase dibandingkan minggu lalu
      const percentageChangeThisWeek =
        previousWeekTotal === 0
          ? 0
          : ((currentWeekTotal - previousWeekTotal) / previousWeekTotal) * 100;

      return {
        progresive: weeklyData, // data jumlah pelanggan per hari dalam minggu ini
        currentWeekTotal,
        previousWeekTotal,
        percentageChangeThisWeek,
      };
    });
    return result;
  }

  async dashboardSlo(currentUser) {
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findFirst({
        where: { id: currentUser.id, role: "SLO" },
      });
      if (!user) throw BaseError.forbidden("Only SLO can access");
    });
    return result;
  }

  async dashboardAm(currentUser) {
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findFirst({
        where: { id: currentUser.id, role: "AM" },
      });
      if (!user) throw BaseError.forbidden("Only AM can access");
    });
    return result;
  }
}

export default new DashboardService();
