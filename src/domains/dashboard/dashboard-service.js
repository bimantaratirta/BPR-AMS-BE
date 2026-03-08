import { PrismaService } from "../../common/service/prisma.service.js";

class DashboardService {
  constructor() {
    this.prisma = new PrismaService();
  }

  async getSummary() {
    const now = new Date();
    const todayStart = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0),
    );

    // Total employees
    const totalEmployees = await this.prisma.employee.count({
      where: { isActive: true },
    });

    // Today's attendance stats
    const todayAttendances = await this.prisma.attendance.findMany({
      where: { date: todayStart },
      select: { status: true },
    });

    const todayHadir = todayAttendances.filter((a) => a.status === "HADIR").length;
    const todayTerlambat = todayAttendances.filter((a) => a.status === "TERLAMBAT").length;
    const todayAlpha = todayAttendances.filter((a) => a.status === "ALPHA").length;

    // Weekly attendance (Mon-Sat of current week)
    const dayOfWeek = now.getUTCDay(); // 0=Sun
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(todayStart);
    monday.setUTCDate(monday.getUTCDate() + mondayOffset);

    const sunday = new Date(monday);
    sunday.setUTCDate(sunday.getUTCDate() + 6);

    const weekAttendances = await this.prisma.attendance.findMany({
      where: {
        date: { gte: monday, lt: sunday },
      },
      select: { date: true, status: true },
    });

    const dayNames = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const weeklyAttendance = dayNames.map((name, i) => {
      const dayDate = new Date(monday);
      dayDate.setUTCDate(dayDate.getUTCDate() + i);
      const dayStr = dayDate.toISOString().split("T")[0];

      const dayRecords = weekAttendances.filter(
        (a) => a.date.toISOString().split("T")[0] === dayStr,
      );

      return {
        day: name,
        hadir: dayRecords.filter((a) => a.status === "HADIR" || a.status === "TERLAMBAT").length,
        alpha: dayRecords.filter((a) => a.status === "ALPHA").length,
      };
    });

    // Recent check-ins (today, last 6)
    const recentCheckins = await this.prisma.attendance.findMany({
      where: {
        date: todayStart,
        checkInTime: { not: null },
      },
      orderBy: { checkInTime: "desc" },
      take: 6,
      include: {
        employee: {
          select: { id: true, name: true, nik: true, avatar: true },
        },
      },
    });

    // Pending leave requests count
    const pendingLeaveRequests = await this.prisma.leaveRequest.count({
      where: { status: "PENDING" },
    });

    return {
      totalEmployees,
      todayHadir,
      todayTerlambat,
      todayAlpha,
      weeklyAttendance,
      recentCheckins,
      pendingLeaveRequests,
    };
  }
}

export default new DashboardService();
