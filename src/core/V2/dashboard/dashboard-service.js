import BaseError from "../../../base_classes/base-error.js";
import { PrismaService } from "../../../common/service/prisma.service.js";
import {
  startOfISOWeek,
  endOfISOWeek,
  subWeeks,
  startOfMonth,
  endOfMonth,
  subMonths,
} from "date-fns";

class DashboardService {
  constructor() {
    this.prisma = new PrismaService();
  }

  async dashboardLo(currentUser, { format }) {
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findFirst({
        where: { id: currentUser.id, role: "LO" },
      });
      if (!user) throw BaseError.forbidden("Only LO can access");

      const currentDate = new Date();
      let startOfWeek, endOfWeek, startOfPrevWeek, endOfPrevWeek;
      let startOfMonthPeriod,
        endOfMonthPeriod,
        startOfPrevMonth,
        endOfPrevMonth;

      // Mengambil minggu ini
      startOfWeek = startOfISOWeek(currentDate);
      endOfWeek = endOfISOWeek(currentDate);

      // Mengambil minggu kemarin
      startOfPrevWeek = subWeeks(startOfWeek, 1);
      endOfPrevWeek = subWeeks(endOfWeek, 1);

      // Mengambil bulan ini
      startOfMonthPeriod = startOfMonth(currentDate);
      endOfMonthPeriod = endOfMonth(currentDate);

      // Mengambil bulan kemarin
      startOfPrevMonth = subMonths(startOfMonthPeriod, 1);
      endOfPrevMonth = subMonths(endOfMonthPeriod, 1);

      // Mengambil jumlah pelanggan minggu ini
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

      // Mengambil jumlah pelanggan minggu kemarin
      const customersPrevWeek = await tx.customer.groupBy({
        by: ["created_at"],
        where: {
          created_by: currentUser.id,
          created_at: {
            gte: startOfPrevWeek,
            lte: endOfPrevWeek,
          },
        },
        _count: {
          created_at: true,
        },
      });

      // Mengambil jumlah pelanggan bulan ini
      const customersThisMonth = await tx.customer.groupBy({
        by: ["created_at"],
        where: {
          created_by: currentUser.id,
          created_at: {
            gte: startOfMonthPeriod,
            lte: endOfMonthPeriod,
          },
        },
        _count: {
          created_at: true,
        },
      });

      // Mengambil jumlah pelanggan bulan kemarin
      const customersPrevMonth = await tx.customer.groupBy({
        by: ["created_at"],
        where: {
          created_by: currentUser.id,
          created_at: {
            gte: startOfPrevMonth,
            lte: endOfPrevMonth,
          },
        },
        _count: {
          created_at: true,
        },
      });

      // Data untuk minggu ini dan minggu kemarin
      const weeklyData = new Array(7).fill(0); // 7 hari dalam seminggu (Senin-Minggu)
      customersThisWeek.forEach((customer) => {
        const dayOfWeek = new Date(customer.created_at).getDay(); // 0 (Minggu) - 6 (Sabtu)
        weeklyData[dayOfWeek] += customer._count.created_at;
      });

      const previousWeekData = new Array(7).fill(0); // Minggu kemarin
      customersPrevWeek.forEach((customer) => {
        const dayOfWeek = new Date(customer.created_at).getDay(); // 0 (Minggu) - 6 (Sabtu)
        previousWeekData[dayOfWeek] += customer._count.created_at;
      });

      // Data untuk bulan ini dan bulan kemarin
      const monthlyData = new Array(4).fill(0); // 4 minggu dalam sebulan (default 0)
      customersThisMonth.forEach((customer) => {
        const weekOfMonth = Math.floor(
          (new Date(customer.created_at).getDate() - 1) / 7
        ); // Minggu ke-1, ke-2, dst

        if (weekOfMonth < 4) {
          // Pastikan bahwa minggu ke-4 tidak melebihi batas array
          monthlyData[weekOfMonth] += customer._count.created_at;
        }
      });

      // Pastikan tidak ada nilai null dalam monthlyData
      monthlyData.forEach((value, index) => {
        if (value === null || value === undefined) {
          monthlyData[index] = 0; // Mengganti null atau undefined dengan 0
        }
      });

      // Data untuk bulan kemarin
      const previousMonthData = new Array(4).fill(0); // Bulan kemarin
      customersPrevMonth.forEach((customer) => {
        const weekOfMonth = Math.floor(
          (new Date(customer.created_at).getDate() - 1) / 7
        ); // Minggu ke-1, ke-2, dst

        if (weekOfMonth < 4) {
          // Pastikan minggu ke-4 tidak melebihi batas array
          previousMonthData[weekOfMonth] += customer._count.created_at;
        }
      });

      // Pastikan tidak ada nilai null dalam previousMonthData
      previousMonthData.forEach((value, index) => {
        if (value === null || value === undefined) {
          previousMonthData[index] = 0; // Mengganti null atau undefined dengan 0
        }
      });

      // Menghitung total minggu ini dan minggu kemarin
      const currentWeekTotal = weeklyData.reduce((a, b) => a + b, 0);
      const previousWeekTotal = previousWeekData.reduce((a, b) => a + b, 0);

      // Menghitung total bulan ini dan bulan kemarin
      const currentMonthTotal = monthlyData.reduce((a, b) => a + b, 0);
      const previousMonthTotal = previousMonthData.reduce((a, b) => a + b, 0);

      // Menghitung persentase perubahan minggu ini vs minggu kemarin
      const percentageChangeWeek =
        previousWeekTotal === 0
          ? 0
          : ((currentWeekTotal - previousWeekTotal) / previousWeekTotal) * 100;

      // Menghitung persentase perubahan bulan ini vs bulan kemarin
      const percentageChangeMonth =
        previousMonthTotal === 0
          ? 0
          : ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) *
            100;

      return {
        customers: format === "minggu" ? weeklyData : monthlyData,
        totalByWeek: {
          totalCurrentPeriod: currentWeekTotal,
          totalPreviousPeriod: previousWeekTotal,
          totalPercentageChange: percentageChangeWeek,
        },
        totalByMonth: {
          totalCurrentPeriod: currentMonthTotal,
          totalPreviousPeriod: previousMonthTotal,
          totalPercentageChange: percentageChangeMonth,
        },
      };
    });

    return result;
  }

  async dashboardSlo(currentUser, { format }) {
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findFirst({
        where: { id: currentUser.id, role: "SLO" },
      });
      if (!user) throw BaseError.forbidden("Only SLO can access");

      // Mendapatkan daftar LO yang berada di bawah SLO ini
      const los = await tx.user.findMany({
        where: { supervisor_id: currentUser.id, role: "LO" },
        select: {
          id: true,
          name: true,
        },
      });

      const currentDate = new Date();

      // Mengambil periode waktu minggu dan bulan
      const startOfWeek = startOfISOWeek(currentDate);
      const endOfWeek = endOfISOWeek(currentDate);
      const startOfMonthPeriod = startOfMonth(currentDate);
      const endOfMonthPeriod = endOfMonth(currentDate);

      // Mengambil periode sebelumnya
      const startOfPrevWeek = subWeeks(startOfWeek, 1);
      const endOfPrevWeek = subWeeks(endOfWeek, 1);
      const startOfPrevMonth = subMonths(startOfMonthPeriod, 1);
      const endOfPrevMonth = subMonths(endOfMonthPeriod, 1);

      // Fungsi untuk mendapatkan jumlah laporan berdasarkan minggu atau bulan
      const getReportCount = async (loId, startDate, endDate) => {
        const reports = await tx.report.count({
          where: {
            lo_id: loId,
            created_at: {
              gte: startDate,
              lte: endDate,
            },
          },
        });
        return reports;
      };

      // Mengambil laporan untuk setiap LO berdasarkan minggu atau bulan
      const loReportsByWeek = await Promise.all(
        los.map(async (lo) => {
          const currentPeriodReportsWeek = await getReportCount(
            lo.id,
            startOfWeek,
            endOfWeek
          );
          const previousPeriodReportsWeek = await getReportCount(
            lo.id,
            startOfPrevWeek,
            endOfPrevWeek
          );

          const percentageChangeWeek =
            previousPeriodReportsWeek === 0
              ? 0
              : ((currentPeriodReportsWeek - previousPeriodReportsWeek) /
                  previousPeriodReportsWeek) *
                100;

          return {
            loName: lo.name,
            currentPeriodReportsWeek,
            previousPeriodReportsWeek,
            percentageChangeWeek,
          };
        })
      );

      const loReportsByMonth = await Promise.all(
        los.map(async (lo) => {
          const currentPeriodReportsMonth = await getReportCount(
            lo.id,
            startOfMonthPeriod,
            endOfMonthPeriod
          );
          const previousPeriodReportsMonth = await getReportCount(
            lo.id,
            startOfPrevMonth,
            endOfPrevMonth
          );

          const percentageChangeMonth =
            previousPeriodReportsMonth === 0
              ? 0
              : ((currentPeriodReportsMonth - previousPeriodReportsMonth) /
                  previousPeriodReportsMonth) *
                100;

          return {
            loName: lo.name,
            currentPeriodReportsMonth,
            previousPeriodReportsMonth,
            percentageChangeMonth,
          };
        })
      );

      // Akumulasi total laporan untuk minggu ini
      const totalCurrentPeriodReportsWeek = loReportsByWeek.reduce(
        (acc, loReport) => acc + loReport.currentPeriodReportsWeek,
        0
      );
      const totalPreviousPeriodReportsWeek = loReportsByWeek.reduce(
        (acc, loReport) => acc + loReport.previousPeriodReportsWeek,
        0
      );

      // Akumulasi total laporan untuk bulan ini
      const totalCurrentPeriodReportsMonth = loReportsByMonth.reduce(
        (acc, loReport) => acc + loReport.currentPeriodReportsMonth,
        0
      );
      const totalPreviousPeriodReportsMonth = loReportsByMonth.reduce(
        (acc, loReport) => acc + loReport.previousPeriodReportsMonth,
        0
      );

      // Menghitung persentase perubahan total laporan untuk minggu dan bulan
      const totalPercentageChangeWeek =
        totalPreviousPeriodReportsWeek === 0
          ? 0
          : ((totalCurrentPeriodReportsWeek - totalPreviousPeriodReportsWeek) /
              totalPreviousPeriodReportsWeek) *
            100;

      const totalPercentageChangeMonth =
        totalPreviousPeriodReportsMonth === 0
          ? 0
          : ((totalCurrentPeriodReportsMonth -
              totalPreviousPeriodReportsMonth) /
              totalPreviousPeriodReportsMonth) *
            100;

      return {
        loReports: format === "minggu" ? loReportsByWeek : loReportsByMonth,
        totalByWeek: {
          totalCurrentPeriod: totalCurrentPeriodReportsWeek,
          totalPreviousPeriod: totalPreviousPeriodReportsWeek,
          totalPercentageChange: totalPercentageChangeWeek,
        },
        totalByMonth: {
          totalCurrentPeriod: totalCurrentPeriodReportsMonth,
          totalPreviousPeriod: totalPreviousPeriodReportsMonth,
          totalPercentageChange: totalPercentageChangeMonth,
        },
      };
    });

    return result;
  }

  async dashboardAm(currentUser, { format }) {
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findFirst({
        where: { id: currentUser.id, role: "AM" },
      });
      if (!user) throw BaseError.forbidden("Only AM can access");

      // Mendapatkan daftar LO yang berada di bawah SLO ini
      const slos = await tx.user.findMany({
        where: { supervisor_id: currentUser.id, role: "SLO" },
        select: {
          id: true,
          name: true,
        },
      });

      const currentDate = new Date();

      // Mengambil periode waktu minggu dan bulan
      const startOfWeek = startOfISOWeek(currentDate);
      const endOfWeek = endOfISOWeek(currentDate);
      const startOfMonthPeriod = startOfMonth(currentDate);
      const endOfMonthPeriod = endOfMonth(currentDate);

      // Mengambil periode sebelumnya
      const startOfPrevWeek = subWeeks(startOfWeek, 1);
      const endOfPrevWeek = subWeeks(endOfWeek, 1);
      const startOfPrevMonth = subMonths(startOfMonthPeriod, 1);
      const endOfPrevMonth = subMonths(endOfMonthPeriod, 1);

      // Fungsi untuk mendapatkan jumlah laporan berdasarkan minggu atau bulan
      const getReportCount = async (sloId, startDate, endDate) => {
        const reports = await tx.report.count({
          where: {
            slo_id: sloId,
            created_at: {
              gte: startDate,
              lte: endDate,
            },
          },
        });
        return reports;
      };

      // Mengambil laporan untuk setiap LO berdasarkan minggu atau bulan
      const sloReportsByWeek = await Promise.all(
        slos.map(async (slo) => {
          const currentPeriodReportsWeek = await getReportCount(
            slo.id,
            startOfWeek,
            endOfWeek
          );
          const previousPeriodReportsWeek = await getReportCount(
            slo.id,
            startOfPrevWeek,
            endOfPrevWeek
          );

          const percentageChangeWeek =
            previousPeriodReportsWeek === 0
              ? 0
              : ((currentPeriodReportsWeek - previousPeriodReportsWeek) /
                  previousPeriodReportsWeek) *
                100;

          return {
            sloName: slo.name,
            currentPeriodReportsWeek,
            previousPeriodReportsWeek,
            percentageChangeWeek,
          };
        })
      );

      const sloReportsByMonth = await Promise.all(
        slos.map(async (slo) => {
          const currentPeriodReportsMonth = await getReportCount(
            slo.id,
            startOfMonthPeriod,
            endOfMonthPeriod
          );
          const previousPeriodReportsMonth = await getReportCount(
            slo.id,
            startOfPrevMonth,
            endOfPrevMonth
          );

          const percentageChangeMonth =
            previousPeriodReportsMonth === 0
              ? 0
              : ((currentPeriodReportsMonth - previousPeriodReportsMonth) /
                  previousPeriodReportsMonth) *
                100;

          return {
            sloName: slo.name,
            currentPeriodReportsMonth,
            previousPeriodReportsMonth,
            percentageChangeMonth,
          };
        })
      );

      // Akumulasi total laporan untuk minggu ini
      const totalCurrentPeriodReportsWeek = sloReportsByWeek.reduce(
        (acc, sloReport) => acc + sloReport.currentPeriodReportsWeek,
        0
      );
      const totalPreviousPeriodReportsWeek = sloReportsByWeek.reduce(
        (acc, sloReport) => acc + sloReport.previousPeriodReportsWeek,
        0
      );

      // Akumulasi total laporan untuk bulan ini
      const totalCurrentPeriodReportsMonth = sloReportsByMonth.reduce(
        (acc, sloReport) => acc + sloReport.currentPeriodReportsMonth,
        0
      );
      const totalPreviousPeriodReportsMonth = sloReportsByMonth.reduce(
        (acc, sloReport) => acc + sloReport.previousPeriodReportsMonth,
        0
      );

      // Menghitung persentase perubahan total laporan untuk minggu dan bulan
      const totalPercentageChangeWeek =
        totalPreviousPeriodReportsWeek === 0
          ? 0
          : ((totalCurrentPeriodReportsWeek - totalPreviousPeriodReportsWeek) /
              totalPreviousPeriodReportsWeek) *
            100;

      const totalPercentageChangeMonth =
        totalPreviousPeriodReportsMonth === 0
          ? 0
          : ((totalCurrentPeriodReportsMonth -
              totalPreviousPeriodReportsMonth) /
              totalPreviousPeriodReportsMonth) *
            100;

      return {
        sloReports: format === "minggu" ? sloReportsByWeek : sloReportsByMonth,
        totalByWeek: {
          totalCurrentPeriod: totalCurrentPeriodReportsWeek,
          totalPreviousPeriod: totalPreviousPeriodReportsWeek,
          totalPercentageChange: totalPercentageChangeWeek,
        },
        totalByMonth: {
          totalCurrentPeriod: totalCurrentPeriodReportsMonth,
          totalPreviousPeriod: totalPreviousPeriodReportsMonth,
          totalPercentageChange: totalPercentageChangeMonth,
        },
      };
    });

    return result;
  }

  async dashboardDireksi(currentUser, { format }) {
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findFirst({
        where: { id: currentUser.id, role: "Direksi" },
      });
      if (!user) throw BaseError.forbidden("Only Direksi can access");

      // Mendapatkan daftar LO yang berada di bawah SLO ini
      const ams = await tx.user.findMany({
        where: { role: "AM" },
        include: {
          region: true,
        },
        // select: {
        //   id: true,
        //   name: true,
        // },
      });

      const currentDate = new Date();

      // Mengambil periode waktu minggu dan bulan
      const startOfWeek = startOfISOWeek(currentDate);
      const endOfWeek = endOfISOWeek(currentDate);
      const startOfMonthPeriod = startOfMonth(currentDate);
      const endOfMonthPeriod = endOfMonth(currentDate);

      // Mengambil periode sebelumnya
      const startOfPrevWeek = subWeeks(startOfWeek, 1);
      const endOfPrevWeek = subWeeks(endOfWeek, 1);
      const startOfPrevMonth = subMonths(startOfMonthPeriod, 1);
      const endOfPrevMonth = subMonths(endOfMonthPeriod, 1);

      // Fungsi untuk mendapatkan jumlah laporan berdasarkan minggu atau bulan
      const getReportCount = async (amId, startDate, endDate) => {
        const reports = await tx.report.count({
          where: {
            am_id: amId,
            created_at: {
              gte: startDate,
              lte: endDate,
            },
          },
        });
        return reports;
      };

      // Mengambil laporan untuk setiap LO berdasarkan minggu atau bulan
      const amReportsByWeek = await Promise.all(
        ams.map(async (am) => {
          const currentPeriodReportsWeek = await getReportCount(
            am.id,
            startOfWeek,
            endOfWeek
          );
          const previousPeriodReportsWeek = await getReportCount(
            am.id,
            startOfPrevWeek,
            endOfPrevWeek
          );

          const percentageChangeWeek =
            previousPeriodReportsWeek === 0
              ? 0
              : ((currentPeriodReportsWeek - previousPeriodReportsWeek) /
                  previousPeriodReportsWeek) *
                100;

          return {
            region: am.region.region,
            currentPeriodReportsWeek,
            previousPeriodReportsWeek,
            percentageChangeWeek,
          };
        })
      );

      const amReportsByMonth = await Promise.all(
        ams.map(async (am) => {
          const currentPeriodReportsMonth = await getReportCount(
            am.id,
            startOfMonthPeriod,
            endOfMonthPeriod
          );
          const previousPeriodReportsMonth = await getReportCount(
            am.id,
            startOfPrevMonth,
            endOfPrevMonth
          );

          const percentageChangeMonth =
            previousPeriodReportsMonth === 0
              ? 0
              : ((currentPeriodReportsMonth - previousPeriodReportsMonth) /
                  previousPeriodReportsMonth) *
                100;

          console.log(am);

          return {
            region: am.region.region,
            currentPeriodReportsMonth,
            previousPeriodReportsMonth,
            percentageChangeMonth,
          };
        })
      );

      // Akumulasi total laporan untuk minggu ini
      const totalCurrentPeriodReportsWeek = amReportsByWeek.reduce(
        (acc, amReport) => acc + amReport.currentPeriodReportsWeek,
        0
      );
      const totalPreviousPeriodReportsWeek = amReportsByWeek.reduce(
        (acc, amReport) => acc + amReport.previousPeriodReportsWeek,
        0
      );

      // Akumulasi total laporan untuk bulan ini
      const totalCurrentPeriodReportsMonth = amReportsByMonth.reduce(
        (acc, amReport) => acc + amReport.currentPeriodReportsMonth,
        0
      );
      const totalPreviousPeriodReportsMonth = amReportsByMonth.reduce(
        (acc, amReport) => acc + amReport.previousPeriodReportsMonth,
        0
      );

      // Menghitung persentase perubahan total laporan untuk minggu dan bulan
      const totalPercentageChangeWeek =
        totalPreviousPeriodReportsWeek === 0
          ? 0
          : ((totalCurrentPeriodReportsWeek - totalPreviousPeriodReportsWeek) /
              totalPreviousPeriodReportsWeek) *
            100;

      const totalPercentageChangeMonth =
        totalPreviousPeriodReportsMonth === 0
          ? 0
          : ((totalCurrentPeriodReportsMonth -
              totalPreviousPeriodReportsMonth) /
              totalPreviousPeriodReportsMonth) *
            100;

      return {
        amReports: format === "minggu" ? amReportsByWeek : amReportsByMonth,
        totalByWeek: {
          totalCurrentPeriod: totalCurrentPeriodReportsWeek,
          totalPreviousPeriod: totalPreviousPeriodReportsWeek,
          totalPercentageChange: totalPercentageChangeWeek,
        },
        totalByMonth: {
          totalCurrentPeriod: totalCurrentPeriodReportsMonth,
          totalPreviousPeriod: totalPreviousPeriodReportsMonth,
          totalPercentageChange: totalPercentageChangeMonth,
        },
      };
    });

    return result;
  }
}

export default new DashboardService();
