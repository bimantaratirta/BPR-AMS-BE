import { PrismaService } from "../../../common/service/prisma.service.js";
import ExcelJS from "exceljs";
import { getExcelColumn } from "../../../utils/getExcelColumn.js";

class TestService {
  constructor() {
    this.prisma = new PrismaService();
  }

  // Fungsi untuk mendapatkan minggu ke-berapa dalam bulan
  getWeekOfMonth(date) {
    const d = new Date(date);
    const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
    const dayOfMonth = d.getDate();
    const firstDayOfWeek = firstDay.getDay();

    return Math.ceil((dayOfMonth + firstDayOfWeek) / 7);
  }

  // Fungsi untuk mendapatkan jumlah minggu dalam bulan
  getWeeksInMonth(year, month) {
    const lastDay = new Date(year, month + 1, 0);
    return this.getWeekOfMonth(lastDay);
  }

  // Fungsi untuk mendapatkan nama bulan dalam Bahasa Indonesia
  getMonthName(month) {
    const months = [
      "JANUARI",
      "FEBRUARI",
      "MARET",
      "APRIL",
      "MEI",
      "JUNI",
      "JULI",
      "AGUSTUS",
      "SEPTEMBER",
      "OKTOBER",
      "NOVEMBER",
      "DESEMBER",
    ];
    return months[month];
  }

  // Fungsi untuk mengelompokkan report berdasarkan minggu dan proses
  groupReportsByWeek(reports, year, month) {
    const weeksInMonth = this.getWeeksInMonth(year, month);
    const grouped = {};

    // Inisialisasi struktur untuk setiap minggu
    for (let week = 1; week <= weeksInMonth; week++) {
      grouped[`MINGGU ${week}`] = {
        lo: { good: 0, bad: 0 },
        slo: { good: 0, bad: 0 },
        am: { good: 0, bad: 0 },
      };
    }

    reports.forEach((report) => {
      // Tentukan tanggal yang akan digunakan dan level
      let dateToUse = null;
      let level = null;

      // Proses LO level (created_at - selalu ada)
      if (report.process.includes("_LO") || report.process === "REVIEW_SLO") {
        dateToUse = report.created_at;
        level = "lo";
      }
      // Proses SLO level (review_by_slo - bisa null)
      else if (
        report.process.includes("_SLO") ||
        report.process === "REVIEW_AM"
      ) {
        // Gunakan review_by_slo jika ada, fallback ke created_at
        dateToUse = report.review_by_slo || report.created_at;
        level = "slo";
      }
      // Proses AM level (review_by_am - bisa null)
      else if (report.process.includes("_AM")) {
        // Gunakan review_by_am jika ada, fallback ke created_at
        dateToUse = report.review_by_am || report.created_at;
        level = "am";
      }

      // Skip jika tidak ada tanggal atau level tidak terdeteksi
      if (!dateToUse || !level) {
        console.warn("Skipping report - no date or level:", {
          process: report.process,
          created_at: report.created_at,
          review_by_slo: report.review_by_slo,
          review_by_am: report.review_by_am,
        });
        return;
      }

      const reportDate = new Date(dateToUse);

      // Validasi date object
      if (isNaN(reportDate.getTime())) {
        console.warn("Invalid date for report:", {
          process: report.process,
          dateToUse,
          level,
        });
        return;
      }

      const reportMonth = reportDate.getMonth();
      const reportYear = reportDate.getFullYear();

      // Filter hanya report di bulan dan tahun yang diminta
      if (reportYear === year && reportMonth === month) {
        const weekNum = this.getWeekOfMonth(reportDate);
        const weekKey = `MINGGU ${weekNum}`;

        if (grouped[weekKey] && level) {
          // Tentukan apakah GOOD atau BAD
          const isGood =
            report.process.includes("APPROVE") ||
            report.process === "REVIEW_SLO" ||
            report.process === "REVIEW_AM" ||
            report.process === "EVALUATION_SLO";

          if (isGood) {
            grouped[weekKey][level].good++;
          } else {
            grouped[weekKey][level].bad++;
          }
        }
      }
    });

    return grouped;
  }

  // Fungsi untuk memproses data API menjadi format untuk Excel
  processApiDataForExcel(apiData, year, month) {
    const processedData = [];
    const monthName = this.getMonthName(month);
    const weeksInMonth = this.getWeeksInMonth(year, month);

    // Generate header row dengan minggu dinamis
    const headerRow = [];
    for (let week = 1; week <= weeksInMonth; week++) {
      headerRow.push({
        year: year,
        month: monthName,
        week: `MINGGU ${week}`,
      });
    }

    // Process setiap region
    apiData.data.forEach((region) => {
      const regionData = {
        region: region.region,
        am: {
          name: region.user[0]?.name || "",
          branch: [],
        },
      };

      // Process setiap branch
      region.branches.forEach((branch) => {
        const branchData = {
          branch: branch.branch,
          slo: branch.user[0]?.name || "",
          LO: [],
        };

        // Process setiap LO (subordinates)
        branch.user[0]?.subordinates?.forEach((lo) => {
          const weeklyData = this.groupReportsByWeek(lo.report_lo, year, month);

          // Convert grouped data ke format report
          const reports = [];
          for (let week = 1; week <= weeksInMonth; week++) {
            const weekKey = `MINGGU ${week}`;
            reports.push({
              month: monthName,
              week: weekKey,
              lo: weeklyData[weekKey].lo,
              slo: weeklyData[weekKey].slo,
              am: weeklyData[weekKey].am,
            });
          }

          branchData.LO.push({
            name: lo.name,
            target: 50, // Default target, bisa disesuaikan
            report: reports,
          });
        });

        regionData.am.branch.push(branchData);
      });

      processedData.push(regionData);
    });

    return { headerRow, data: processedData };
  }

  async generateXlsxAM(year, month) {
    // Ambil data dari database
    const apiData = await this.listAllReports(year, month);

    // Proses data menjadi format Excel
    const excelData = this.processApiDataForExcel(apiData, year, month);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data Kunjungan PMS");

    // Header utama
    worksheet.mergeCells("A1:E1");
    const headerCell = worksheet.getCell("A1");
    headerCell.value = "DATA KUNJUNGAN PMS";
    headerCell.font = { bold: true, size: 16 };
    headerCell.alignment = { horizontal: "center", vertical: "middle" };
    headerCell.style.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF9CC2E5" },
    };
    headerCell.style.border = {
      top: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } },
    };

    // Header kolom dasar (KANTOR, WIL, SLO, LO, TARGET)
    const baseHeaders = ["KANTOR", "WIL", "SLO", "LO", "TARGET"];
    baseHeaders.forEach((header, index) => {
      const col = String.fromCharCode(65 + index); // A, B, C, D, E
      worksheet.mergeCells(`${col}2:${col}3`);
      const cell = worksheet.getCell(`${col}2`);
      cell.value = header;
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.style.border = {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      };
      cell.style.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF9CC2E5" },
      };
    });

    // Header minggu dinamis
    excelData.headerRow.forEach((item, index) => {
      const col1 = getExcelColumn(5 + index * 6);
      const col2 = getExcelColumn(10 + index * 6);

      // Merge cells untuk header minggu
      worksheet.mergeCells(`${col1}1:${col2}1`);
      const cell = worksheet.getCell(`${col1}1`);
      cell.value = `${item.week} (${item.month} ${item.year})`;
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.style.border = {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      };
      cell.style.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF9CC2E5" },
      };

      // Sub columns (LO, SLO, AM)
      let subColumnStart = 5 + index * 6;
      ["LO", "SLO", "AM"].forEach((label, subIndex) => {
        const subCol1 = getExcelColumn(subColumnStart + subIndex * 2);
        const subCol2 = getExcelColumn(subColumnStart + 1 + subIndex * 2);

        worksheet.mergeCells(`${subCol1}2:${subCol2}2`);
        const subCell = worksheet.getCell(`${subCol1}2`);
        subCell.value = label;
        subCell.font = { bold: true };
        subCell.alignment = { horizontal: "center", vertical: "middle" };
        subCell.style.border = {
          top: { style: "thin", color: { argb: "FF000000" } },
          left: { style: "thin", color: { argb: "FF000000" } },
          bottom: { style: "thin", color: { argb: "FF000000" } },
          right: { style: "thin", color: { argb: "FF000000" } },
        };
        subCell.style.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF9CC2E5" },
        };

        // GOOD and BAD headers
        let startStatus = subColumnStart + subIndex * 2;
        ["GOOD", "BAD"].forEach((status, statusIndex) => {
          const statusCol = getExcelColumn(startStatus + statusIndex);
          const statusCell = worksheet.getCell(`${statusCol}3`);
          statusCell.value = status;
          statusCell.font = { bold: true };
          statusCell.alignment = { horizontal: "center", vertical: "middle" };
          statusCell.style.border = {
            top: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
          };
          statusCell.style.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF9CC2E5" },
          };
        });
      });
    });

    let totalWilayahAll = {};

    // Iterating through data dan generating rows
    excelData.data.forEach((region) => {
      let regionTotal = 0;
      const weeksCount = excelData.headerRow.length;
      let regionWeekGoodLO = Array(weeksCount).fill(0);
      let regionWeekBadLO = Array(weeksCount).fill(0);
      let regionWeekGoodSLO = Array(weeksCount).fill(0);
      let regionWeekBadSLO = Array(weeksCount).fill(0);
      let regionWeekGoodAM = Array(weeksCount).fill(0);
      let regionWeekBadAM = Array(weeksCount).fill(0);

      region.am.branch.forEach((branch) => {
        let weekGoodLO = Array(weeksCount).fill(0);
        let weekBadLO = Array(weeksCount).fill(0);
        let weekGoodSLO = Array(weeksCount).fill(0);
        let weekBadSLO = Array(weeksCount).fill(0);
        let weekGoodAM = Array(weeksCount).fill(0);
        let weekBadAM = Array(weeksCount).fill(0);

        // Add rows untuk setiap LO
        branch.LO.forEach((lo) => {
          const rowData = [
            branch.branch,
            region.region,
            branch.slo,
            lo.name,
            lo.target,
          ];

          // Iterate over each report (week)
          lo.report.forEach((item, index) => {
            rowData.push(
              item.lo.good,
              item.lo.bad,
              item.slo.good,
              item.slo.bad,
              item.am.good,
              item.am.bad
            );

            weekGoodLO[index] += item.lo.good;
            weekBadLO[index] += item.lo.bad;
            weekGoodSLO[index] += item.slo.good;
            weekBadSLO[index] += item.slo.bad;
            weekGoodAM[index] += item.am.good;
            weekBadAM[index] += item.am.bad;
          });

          const row = worksheet.addRow(rowData);
          row.eachCell((cell) => {
            cell.style.border = {
              top: { style: "thin", color: { argb: "FF000000" } },
              left: { style: "thin", color: { argb: "FF000000" } },
              bottom: { style: "thin", color: { argb: "FF000000" } },
              right: { style: "thin", color: { argb: "FF000000" } },
            };
          });
          row.getCell(5).alignment = {
            horizontal: "center",
            vertical: "middle",
          };
        });

        // Total row untuk branch
        const totalTarget = branch.LO.reduce((acc, lo) => acc + lo.target, 0);
        const totalRow = ["TOTAL", "", "", "", totalTarget];

        [
          weekGoodLO,
          weekBadLO,
          weekGoodSLO,
          weekBadSLO,
          weekGoodAM,
          weekBadAM,
        ].forEach((weekArray) => {
          weekArray.forEach((value) => totalRow.push(value));
        });

        // Accumulate to region totals
        weekGoodLO.forEach((value, index) => {
          regionWeekGoodLO[index] += value;
          regionWeekBadLO[index] += weekBadLO[index];
          regionWeekGoodSLO[index] += weekGoodSLO[index];
          regionWeekBadSLO[index] += weekBadSLO[index];
          regionWeekGoodAM[index] += weekGoodAM[index];
          regionWeekBadAM[index] += weekBadAM[index];
        });

        const rawTotal = worksheet.addRow(totalRow);
        rawTotal.getCell(5).alignment = {
          horizontal: "center",
          vertical: "middle",
        };
        rawTotal.eachCell((cell) => {
          cell.style.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFC5E0B3" },
          };
          cell.style.border = {
            top: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
          };
        });

        const lastRowIndex = worksheet.lastRow.number;
        worksheet.mergeCells(`A${lastRowIndex}:D${lastRowIndex}`);
        regionTotal += totalTarget;
      });

      // Region total row
      const regionTotalRow = [
        `WILAYAH ${region.region}`,
        "",
        region.am.name,
        "",
        regionTotal,
      ];

      [
        regionWeekGoodLO,
        regionWeekBadLO,
        regionWeekGoodSLO,
        regionWeekBadSLO,
        regionWeekGoodAM,
        regionWeekBadAM,
      ].forEach((weekArray) => {
        weekArray.forEach((value) => regionTotalRow.push(value));
      });

      const rawTotalRegion = worksheet.addRow(regionTotalRow);
      rawTotalRegion.getCell(5).alignment = {
        horizontal: "center",
        vertical: "middle",
      };
      rawTotalRegion.eachCell((cell) => {
        cell.style.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF9CC2E5" },
        };
        cell.style.border = {
          top: { style: "thin", color: { argb: "FF000000" } },
          left: { style: "thin", color: { argb: "FF000000" } },
          bottom: { style: "thin", color: { argb: "FF000000" } },
          right: { style: "thin", color: { argb: "FF000000" } },
        };
      });

      const regionTotalRowIndex = worksheet.lastRow.number;
      worksheet.mergeCells(`A${regionTotalRowIndex}:B${regionTotalRowIndex}`);
      worksheet.mergeCells(`C${regionTotalRowIndex}:D${regionTotalRowIndex}`);

      totalWilayahAll[region.region] = regionTotal;
    });

    // Final total row
    const grandTotal = Object.values(totalWilayahAll).reduce(
      (a, b) => a + b,
      0
    );
    const finalTotalRow = ["TOTAL WILAYAH", "", "", "", grandTotal];

    worksheet.addRow(finalTotalRow);
    worksheet.mergeCells(
      `A${worksheet.lastRow.number}:B${worksheet.lastRow.number}`
    );
    worksheet.mergeCells(
      `C${worksheet.lastRow.number}:D${worksheet.lastRow.number}`
    );

    // Set column widths
    worksheet.getColumn(1).width = 12;
    worksheet.getColumn(2).width = 10;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 25;
    worksheet.getColumn(5).width = 10;

    // Freeze panes
    worksheet.views = [
      {
        state: "frozen",
        xSplit: 5,
        ySplit: 3,
      },
    ];

    const xlsxBuffer = await workbook.xlsx.writeBuffer();
    return xlsxBuffer;
  }

  async listAllReports(year, month) {
    // Validasi input parameters
    if (typeof year !== "number" || typeof month !== "number") {
      throw new Error(`Invalid parameters: year=${year}, month=${month}`);
    }

    if (month < 0 || month > 11) {
      throw new Error(`Month must be between 0-11, got: ${month}`);
    }

    if (year < 2000 || year > 2100) {
      throw new Error(`Year must be between 2000-2100, got: ${year}`);
    }

    // month sudah 0-indexed (0 = Januari, 9 = Oktober)
    // Buat start date: first day of month at 00:00:00
    const startDate = new Date(year, month, 1, 0, 0, 0, 0);

    // Buat end date: last day of month at 23:59:59
    // month + 1, 0 akan memberikan hari terakhir dari month
    const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

    // Validasi Date objects
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error(`Invalid date created: year=${year}, month=${month}`);
    }

    console.log("Date Range:", {
      year,
      month: month + 1, // untuk display (1-12)
      monthName: this.getMonthName(month),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    const data = await this.prisma.region.findMany({
      select: {
        region: true,
        user: {
          select: { name: true, role: true },
          where: { role: "AM" },
        },
        branches: {
          select: {
            branch: true,
            user: {
              select: {
                name: true,
                role: true,
                subordinates: {
                  select: {
                    name: true,
                    role: true,
                    report_lo: {
                      select: {
                        process: true,
                        created_at: true,
                        review_by_am: true,
                        review_by_slo: true,
                      },
                      where: {
                        OR: [
                          // Filter created_at (selalu ada)
                          {
                            created_at: {
                              gte: startDate,
                              lte: endDate,
                            },
                          },
                          // Filter review_by_am (bisa null, jadi perlu AND dengan not null)
                          {
                            AND: [
                              { review_by_am: { not: null } },
                              {
                                review_by_am: {
                                  gte: startDate,
                                  lte: endDate,
                                },
                              },
                            ],
                          },
                          // Filter review_by_slo (bisa null, jadi perlu AND dengan not null)
                          {
                            AND: [
                              { review_by_slo: { not: null } },
                              {
                                review_by_slo: {
                                  gte: startDate,
                                  lte: endDate,
                                },
                              },
                            ],
                          },
                        ],
                      },
                    },
                  },
                },
              },
              where: {
                role: "SLO",
              },
            },
          },
        },
      },
    });

    return { data };
  }
}

export default new TestService();
