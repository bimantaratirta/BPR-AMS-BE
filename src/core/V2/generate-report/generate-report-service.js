import { PrismaService } from "../../../common/service/prisma.service.js";
import ExcelJS from "exceljs";
import { getExcelColumn } from "../../../utils/getExcelColumn.js";
import { buildQueryOptions } from "../../../utils/buildQueryOptions.js";
import generateReportQueryConfig from "./generate-report-query-config.js";

class GenerateReportService {
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
      let isGoodLO = null;
      let isGoodSLO = null;
      let isGoodAM = null;

      // Proses LO level (created_at - selalu ada)
      // if (report.process.includes("_LO") || report.process === "REVIEW_SLO") {

      // Tentukan GOOD atau BAD LO

      if (
        [
          "REVIEW_SLO",
          "DECLINE_REVIEW_SLO",
          "EVALUATION_SLO",
          "DECLINE_EVALUATION_SLO",
          "REVIEW_AM",
          "APPROVE_AM",
          "DECLINE_AM",
        ].includes(report.process)
      ) {
        dateToUse = report.created_at;
        const reportDate = new Date(dateToUse);
        if (
          reportDate.getFullYear() === year &&
          reportDate.getMonth() === month
        ) {
          isGoodLO = true; // GOOD LO
        }
      }
      // BAD LO jika process adalah DECLINE_LO
      else if (report.process === "DECLINE_LO") {
        dateToUse = report.created_at;
        const reportDate = new Date(dateToUse);
        if (
          reportDate.getFullYear() === year &&
          reportDate.getMonth() === month
        ) {
          isGoodLO = false; // BAD LO
        }
      }

      if (["REVIEW_AM", "APPROVE_AM", "DECLINE_AM"].includes(report.process)) {
        dateToUse = report.review_by_slo;
        const reportDate = new Date(dateToUse);
        if (
          reportDate.getFullYear() === year &&
          reportDate.getMonth() === month
        ) {
          isGoodSLO = true; // GOOD LO
        }
      }
      // BAD LO jika process adalah DECLINE_LO
      else if (
        ["DECLINE_REVIEW_SLO", "DECLINE_EVALUATION_SLO"].includes(
          report.process
        )
      ) {
        dateToUse = report.review_by_slo;
        const reportDate = new Date(dateToUse);
        if (
          reportDate.getFullYear() === year &&
          reportDate.getMonth() === month
        ) {
          isGoodSLO = false; // BAD
        }
      }

      if (["APPROVE_AM"].includes(report.process)) {
        dateToUse = report.review_by_am;
        const reportDate = new Date(dateToUse);
        if (
          reportDate.getFullYear() === year &&
          reportDate.getMonth() === month
        ) {
          isGoodAM = true; // GOOD LO
        }
      }
      // BAD LO jika process adalah DECLINE_LO
      else if (["DECLINE_AM"].includes(report.process)) {
        dateToUse = report.review_by_am;
        const reportDate = new Date(dateToUse);
        if (
          reportDate.getFullYear() === year &&
          reportDate.getMonth() === month
        ) {
          isGoodAM = false; // BAD
        }
      }

      // // Proses SLO level (review_by_slo - bisa null)
      // if (report.process.includes("_SLO") || report.process === "REVIEW_AM") {
      //   dateToUse = report.review_by_slo || report.created_at;

      //   // Tentukan GOOD atau BAD SLO
      //   const reportDate = new Date(dateToUse);
      //   if (
      //     ["REVIEW_AM", "APPROVE_AM", "DECLINE_AM"].includes(report.process)
      //   ) {
      //     if (
      //       reportDate.getFullYear() === year &&
      //       reportDate.getMonth() === month
      //     ) {
      //       isGood = true; // GOOD SLO
      //     }
      //   } else if (
      //     ["DECLINE_REVIEW_SLO", "DECLINE_EVALUATION_SLO"].includes(
      //       report.process
      //     )
      //   ) {
      //     isGood = false; // BAD SLO
      //   }
      // }
      // // Proses AM level (review_by_am - bisa null)
      // if (report.process.includes("_AM")) {
      //   dateToUse = report.review_by_am || report.created_at;

      //   // Tentukan GOOD atau BAD AM
      //   const reportDate = new Date(dateToUse);
      //   if (report.process === "APPROVE_AM") {
      //     if (
      //       reportDate.getFullYear() === year &&
      //       reportDate.getMonth() === month
      //     ) {
      //       isGood = true; // GOOD AM
      //     }
      //   } else if (report.process === "DECLINE_AM") {
      //     isGood = false; // BAD AM
      //   }
      // }

      // Skip jika tidak ada tanggal atau level tidak terdeteksi
      // if (!dateToUse || !level) {
      //   console.warn("Skipping report - no date or level:", {
      //     process: report.process,
      //     created_at: report.created_at,
      //     review_by_slo: report.review_by_slo,
      //     review_by_am: report.review_by_am,
      //   });
      //   return;
      // }

      // Validasi date object
      const reportDate = new Date(dateToUse);
      if (isNaN(reportDate.getTime())) {
        console.warn("Invalid date for report:", {
          process: report.process,
          dateToUse,
        });
        return;
      }

      const reportMonth = reportDate.getMonth();
      const reportYear = reportDate.getFullYear();

      // Filter hanya report di bulan dan tahun yang diminta
      if (reportYear === year && reportMonth === month) {
        const weekNum = this.getWeekOfMonth(reportDate);
        const weekKey = `MINGGU ${weekNum}`;
        if (grouped[weekKey]) {
          // Tentukan apakah GOOD atau BAD berdasarkan kondisi yang sudah ditentukan
          if (isGoodLO !== null) {
            if (isGoodLO) {
              grouped[weekKey]["lo"].good++;
            } else {
              grouped[weekKey]["lo"].bad++;
            }
          }

          if (isGoodSLO != null) {
            if (isGoodSLO) {
              grouped[weekKey]["slo"].good++;
            } else {
              grouped[weekKey]["slo"].bad++;
            }
          }

          if (isGoodAM != null) {
            if (isGoodAM) {
              grouped[weekKey]["am"].good++;
            } else {
              grouped[weekKey]["am"].bad++;
            }
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
    const worksheet = workbook.addWorksheet(
      `Data Kunjungan PMS (${year}-${this.getMonthName(month)})`
    );

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
      const col1 = getExcelColumn(5 + index * 6 + index * 4); // Menambahkan gap 3 kolom
      const col2 = getExcelColumn(10 + index * 6 + index * 4); // Menambahkan gap 3 kolom

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
      let subColumnStart = 5 + index * 6 + index * 4; // Menambahkan gap 3 kolom
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

      const colTotal1 = getExcelColumn(11 + index * 3 + index * 7); // Menambahkan gap 3 kolom
      const colTotal2 = getExcelColumn(13 + index * 3 + index * 7); // Menambahkan gap 3 kolom
      // console.log(colTotal1, colTotal2, "<<< TOTAL COLS");

      worksheet.mergeCells(`${colTotal1}1:${colTotal2}2`);
      const cellTotal = worksheet.getCell(`${colTotal1}1`);
      cellTotal.value = `TOTAL`;
      cellTotal.font = { bold: true };
      cellTotal.alignment = { horizontal: "center", vertical: "middle" };
      cellTotal.style.border = {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      };
      cellTotal.style.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF9CC2E5" },
      };
      let subTotalColumnStart = 11 + index * 3 + index * 7; // Menambahkan gap 3 kolom
      ["LO", "SLO", "AM"].forEach((label, subIndex) => {
        const subCol1 = getExcelColumn(subTotalColumnStart + subIndex);

        worksheet.mergeCells(`${subCol1}3`);
        const subCell = worksheet.getCell(`${subCol1}3`);
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
      });

      const colArchive = getExcelColumn(14 + index + index * 9); // Menambahkan gap 3 kolom

      console.log(colArchive, "<<< TOTAL COLS");
      worksheet.getColumn(colArchive).width = 20; // Mengatur lebar kolom

      worksheet.mergeCells(`${colArchive}1:${colArchive}3`);
      const cellArchive = worksheet.getCell(`${colArchive}1`);
      cellArchive.value = `ARCHIVE (%)`;
      cellArchive.font = { bold: true };
      cellArchive.alignment = { horizontal: "center", vertical: "middle" };
      cellArchive.style.border = {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      };
      cellArchive.style.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF9CC2E5" },
      };

      if (index === excelData.headerRow.length - 1) {
        const colTotalAll = getExcelColumn(14 + index + index * 9 + 1); // Menambahkan gap 3 kolom

        console.log(colTotalAll, "<<< TOTAL COLS");
        worksheet.getColumn(colTotalAll).width = 15; // Mengatur lebar kolom

        worksheet.mergeCells(`${colTotalAll}1:${colTotalAll}3`);
        const cellTotalAll = worksheet.getCell(`${colTotalAll}1`);
        cellTotalAll.value = `TOTAL ALL`;
        cellTotalAll.font = { bold: true };
        cellTotalAll.alignment = { horizontal: "center", vertical: "middle" };
        cellTotalAll.style.border = {
          top: { style: "thin", color: { argb: "FF000000" } },
          left: { style: "thin", color: { argb: "FF000000" } },
          bottom: { style: "thin", color: { argb: "FF000000" } },
          right: { style: "thin", color: { argb: "FF000000" } },
        };
        cellTotalAll.style.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF9CC2E5" },
        };

        const colTargetArchive = getExcelColumn(14 + index + index * 9 + 2); // Menambahkan gap 3 kolom

        console.log(colTargetArchive, "<<< TOTAL COLS");
        worksheet.getColumn(colTargetArchive).width = 20; // Mengatur lebar kolom

        worksheet.mergeCells(`${colTargetArchive}1:${colTargetArchive}3`);
        const cellTargetArchive = worksheet.getCell(`${colTargetArchive}1`);
        cellTargetArchive.value = `TARGET ARCHIVE (%)`;
        cellTargetArchive.font = { bold: true };
        cellTargetArchive.alignment = {
          horizontal: "center",
          vertical: "middle",
        };
        cellTargetArchive.style.border = {
          top: { style: "thin", color: { argb: "FF000000" } },
          left: { style: "thin", color: { argb: "FF000000" } },
          bottom: { style: "thin", color: { argb: "FF000000" } },
          right: { style: "thin", color: { argb: "FF000000" } },
        };
        cellTargetArchive.style.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF9CC2E5" },
        };
      }
    });

    let totalWilayahAll = {};
    // console.log(JSON.stringify(excelData.data, null, 2));
    const weeksCount = excelData.headerRow.length;
    let finalGoodLO = Array(weeksCount).fill(0);
    let finalBadLO = Array(weeksCount).fill(0);
    let finalGoodSLO = Array(weeksCount).fill(0);
    let finalBadSLO = Array(weeksCount).fill(0);
    let finalGoodAM = Array(weeksCount).fill(0);
    let finalBadAM = Array(weeksCount).fill(0);

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
          let totalMonthCustomer = 0;
          let avarageArchive = 0;

          lo.report.forEach((item, index) => {
            rowData.push(
              item.lo.good,
              item.lo.bad,
              item.slo.good,
              item.slo.bad,
              item.am.good,
              item.am.bad,
              item.lo.good + item.lo.bad,
              item.slo.good + item.slo.bad,
              item.am.good + item.am.bad,
              ((item.lo.good + item.lo.bad) / lo.target) * 100 + "%"
            );

            weekGoodLO[index] += item.lo.good;
            weekBadLO[index] += item.lo.bad;
            weekGoodSLO[index] += item.slo.good;
            weekBadSLO[index] += item.slo.bad;
            weekGoodAM[index] += item.am.good;
            weekBadAM[index] += item.am.bad;

            totalMonthCustomer += item.lo.good + item.lo.bad;
            avarageArchive += ((item.lo.good + item.lo.bad) / lo.target) * 100;
          });
          rowData.push(
            totalMonthCustomer,
            avarageArchive / lo.report.length + "%"
          );

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

        // console.log(
        //   weekGoodLO,
        //   weekBadLO,
        //   weekGoodSLO,
        //   weekBadSLO,
        //   weekGoodAM,
        //   weekBadAM,
        //   "+++++++++++"
        // );

        let length = weekGoodLO.length; // Asumsi semua array memiliki panjang yang sama
        let totalMonthCustomer = 0;
        let avarageArchive = 0;
        for (let i = 0; i < length; i++) {
          totalRow.push(
            weekGoodLO[i],
            weekBadLO[i],
            weekGoodSLO[i],
            weekBadSLO[i],
            weekGoodAM[i],
            weekBadAM[i],
            weekGoodLO[i] + weekBadLO[i],
            weekGoodSLO[i] + weekBadSLO[i],
            weekGoodAM[i] + weekBadAM[i],
            ((weekGoodLO[i] + weekBadLO[i]) / totalTarget) * 100 + "%"
          );
          totalMonthCustomer += weekGoodLO[i] + weekBadLO[i];
          avarageArchive +=
            ((weekGoodLO[i] + weekBadLO[i]) / totalTarget) * 100;
        }
        totalRow.push(totalMonthCustomer, avarageArchive / length + "%");

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
      // Accumulate to final totals
      regionWeekGoodLO.forEach((value, index) => {
        finalGoodLO[index] += value;
        finalBadLO[index] += regionWeekBadLO[index];
        finalGoodSLO[index] += regionWeekGoodSLO[index];
        finalBadSLO[index] += regionWeekBadSLO[index];
        finalGoodAM[index] += regionWeekGoodAM[index];
        finalBadAM[index] += regionWeekBadAM[index];
      });

      // Region total row
      const regionTotalRow = [
        `WILAYAH ${region.region}`,
        "",
        region.am.name,
        "",
        regionTotal,
      ];

      let length = regionWeekGoodLO.length; // Asumsi semua array memiliki panjang yang sama
      let totalMonthCustomer = 0;
      let avarageArchive = 0;

      for (let i = 0; i < length; i++) {
        regionTotalRow.push(
          regionWeekGoodLO[i],
          regionWeekBadLO[i],
          regionWeekGoodSLO[i],
          regionWeekBadSLO[i],
          regionWeekGoodAM[i],
          regionWeekBadAM[i],
          regionWeekGoodLO[i] + regionWeekBadLO[i],
          regionWeekGoodSLO[i] + regionWeekBadSLO[i],
          regionWeekGoodAM[i] + regionWeekBadAM[i],
          ((regionWeekGoodLO[i] + regionWeekBadLO[i]) / regionTotal) * 100 + "%"
        );
        totalMonthCustomer += regionWeekGoodLO[i] + regionWeekBadLO[i];
        avarageArchive +=
          ((regionWeekGoodLO[i] + regionWeekBadLO[i]) / regionTotal) * 100;
      }
      regionTotalRow.push(totalMonthCustomer, avarageArchive / length + "%");

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
    const finalTotalRow = [
      "TOTAL KESELURUHAN (ALI ZAENI)",
      "",
      "",
      "",
      grandTotal,
    ];

    let length = finalGoodLO.length; // Asumsi semua array memiliki panjang yang sama
    let totalMonthCustomer = 0;
    let avarageArchive = 0;

    for (let i = 0; i < length; i++) {
      finalTotalRow.push(
        finalGoodLO[i],
        finalBadLO[i],
        finalGoodSLO[i],
        finalBadSLO[i],
        finalGoodAM[i],
        finalBadAM[i],
        finalGoodLO[i] + finalBadLO[i],
        finalGoodSLO[i] + finalBadSLO[i],
        finalGoodAM[i] + finalBadAM[i],
        ((finalGoodLO[i] + finalBadLO[i]) / grandTotal) * 100 + "%"
      );
      totalMonthCustomer += finalGoodLO[i] + finalBadLO[i];
      avarageArchive += ((finalGoodLO[i] + finalBadLO[i]) / grandTotal) * 100;
    }
    finalTotalRow.push(totalMonthCustomer, avarageArchive / length + "%");

    const finalTotal = worksheet.addRow(finalTotalRow);
    worksheet.mergeCells(
      `A${worksheet.lastRow.number}:D${worksheet.lastRow.number}`
    );

    finalTotal.getCell(1).alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    finalTotal.getCell(5).alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    finalTotal.eachCell((cell) => {
      cell.style.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFFF01" },
      };
      cell.style.border = {
        top: { style: "medium", color: { argb: "FF000000" } },
        left: { style: "medium", color: { argb: "FF000000" } },
        bottom: { style: "medium", color: { argb: "FF000000" } },
        right: { style: "medium", color: { argb: "FF000000" } },
      };
    });

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

    // console.log("Date Range:", {
    //   year,
    //   month: month + 1, // untuk display (1-12)
    //   monthName: this.getMonthName(month),
    //   startDate: startDate.toISOString(),
    //   endDate: endDate.toISOString(),
    // });

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

    // const excelData = this.processApiDataForExcel({ data }, year, month);

    return { data };
  }

  async generateXlsxByRole({ currentUser, query }) {
    const roleKeyMap = {
      LO: "lo_id",
      SLO: "slo_id",
      AM: "am_id",
    };

    // const key = roleKeyMap[currentUser.role] || null;

    const baseWhere =
      // key
      // ?
      {
        // [key]: currentUser.id,
        lo_id: "e7f8a9b0-c1d2-3e4f-5a6b-7c8d9e0f1a2b",
      };
    // : null;

    const options = buildQueryOptions(
      generateReportQueryConfig,
      query,
      baseWhere
    );

    const [data, count] = await Promise.all([
      this.prisma.report.findMany(options),
      this.prisma.report.count({ where: options.where }),
    ]);

    console.log(JSON.stringify(data, null, 2));

    // Membuat workbook baru
    const workbook = new ExcelJS.Workbook();

    // Fungsi untuk menambahkan worksheet
    const addWorksheet = (sheetName) => {
      const worksheet = workbook.addWorksheet(sheetName);

      // Menambahkan Header: "DATA KUNJUNGAN PMS"
      worksheet.mergeCells("A1:M1");
      const headerCell = worksheet.getCell("A1");
      headerCell.value = "DATA KUNJUNGAN PMS";
      headerCell.font = { bold: true, size: 16 };
      headerCell.alignment = { horizontal: "center", vertical: "middle" };

      // Menambahkan header untuk kolom
      worksheet.mergeCells("A2:A3");
      worksheet.getCell("A2").value = "NO";
      worksheet.getCell("A2").font = { bold: true, size: 11 };
      worksheet.getCell("A2").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.mergeCells("B2:B3");
      worksheet.getCell("B2").value = "TANGGAL";
      worksheet.getCell("B2").font = { bold: true, size: 11 };
      worksheet.getCell("B2").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.mergeCells("C2:C3");
      worksheet.getCell("C2").value = "NAMA LENGKAP";
      worksheet.getCell("C2").font = { bold: true, size: 11 };
      worksheet.getCell("C2").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      // Menambahkan header "DOMISILI" di baris ke-3 dan merge
      worksheet.mergeCells("D2:F2");
      worksheet.getCell("D2").value = "DOMISILI";
      worksheet.getCell("D2").font = { bold: true, size: 11 };
      worksheet.getCell("D2").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      // Menambahkan sub-header untuk DOMISILI
      worksheet.getCell("D3").value = "ALAMAT";
      worksheet.getCell("D3").font = { bold: true, size: 11 };
      worksheet.getCell("E3").value = "RT/RW";
      worksheet.getCell("E3").font = { bold: true, size: 11 };
      worksheet.getCell("F3").value = "DESA";
      worksheet.getCell("F3").font = { bold: true, size: 11 };

      worksheet.mergeCells("G2:G3");
      worksheet.getCell("G2").value = "KARYAWAN";
      worksheet.getCell("G2").font = { bold: true, size: 11 };
      worksheet.getCell("G2").alignment = {
        horizontal: "center",
        vertical: "middle",
      };
      worksheet.mergeCells("H2:H3");
      worksheet.getCell("H2").value = "KARYAWAN";
      worksheet.getCell("H2").font = { bold: true, size: 11 };
      worksheet.getCell("H2").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.mergeCells("I2:I3");
      worksheet.getCell("I2").value = "USAHA";
      worksheet.getCell("I2").font = { bold: true, size: 11 };
      worksheet.getCell("I2").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.mergeCells("J2:J3");
      worksheet.getCell("J2").value = "PENDAPATAN";
      worksheet.getCell("J2").font = { bold: true, size: 11 };
      worksheet.getCell("J2").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.mergeCells("K2:K3");
      worksheet.getCell("K2").value = "LO";
      worksheet.getCell("K2").font = { bold: true, size: 11 };
      worksheet.getCell("K2").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.mergeCells("L2:L3");
      worksheet.getCell("L2").value = "SLO";
      worksheet.getCell("L2").font = { bold: true, size: 11 };
      worksheet.getCell("L2").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.mergeCells("M2:M3");
      worksheet.getCell("M2").value = "AM";
      worksheet.getCell("M2").font = { bold: true, size: 11 };
      worksheet.getCell("M2").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      worksheet.mergeCells("N2:N3");
      worksheet.getCell("N2").value = "STATUS";
      worksheet.getCell("N2").font = { bold: true, size: 11 };
      worksheet.getCell("N2").alignment = {
        horizontal: "center",
        vertical: "middle",
      };

      // Menambahkan data nasabah
      // nasabahData.forEach((nasabah, index) => {
      //   worksheet.addRow([
      //     index + 1,
      //     nasabah.created_at,
      //     nasabah.customer_name,
      //     nasabah.address,
      //     nasabah.rt_rw,
      //     nasabah.village,
      //     nasabah.employment ?? " - ",
      //     nasabah.business ?? " - ",
      //     nasabah.salary_frequency,
      //     nasabah.lo,
      //     nasabah.slo,
      //     nasabah.am,
      //     nasabah.status,
      //   ]);
      // });

      data.forEach((nasabah, index) => {
        worksheet.addRow([
          index + 1,
          nasabah.created_at,
          nasabah.customer_snapshot.name,
          nasabah.customer_snapshot.address,
          nasabah.customer_snapshot.rt_rw,
          nasabah.customer_snapshot.village,
          nasabah.non_employee_snapshot
            ? nasabah.non_employee_snapshot.work
            : " - ",
          nasabah.employee_snapshot
            ? nasabah.employee_snapshot.position
            : " - ",
          nasabah.business_snapshot
            ? nasabah.business_snapshot.business_type
            : " - ",
          nasabah.non_employee_snapshot
            ? nasabah.non_employee_snapshot.salary_frequency
            : nasabah.employee_snapshot
            ? "Bulan"
            : nasabah.business_snapshot
            ? "Bulan"
            : " - ",
          nasabah.lo.name,
          nasabah.slo.name,
          nasabah.am.name,
          nasabah.status,
        ]);
      });

      // Menentukan lebar kolom (menyesuaikan panjang data)
      worksheet.getColumn(1).width = 5; // No
      worksheet.getColumn(2).width = 15; // Tanggal
      worksheet.getColumn(3).width = 25; // Nama Lengkap
      worksheet.getColumn(4).width = 35; // DOMISILI (ALAMAT)
      worksheet.getColumn(5).width = 15; // RT/RW
      worksheet.getColumn(6).width = 20; // Desa
      worksheet.getColumn(7).width = 20; // Pekerjaan
      worksheet.getColumn(8).width = 20; // Usaha
      worksheet.getColumn(9).width = 15; // Pendapatan
      worksheet.getColumn(10).width = 15; // LO
      worksheet.getColumn(11).width = 15; // SLO
      worksheet.getColumn(12).width = 15; // AM
      worksheet.getColumn(13).width = 10; // Status
    };

    // Tambahkan sheet berdasarkan bulan dan minggu
    // addWorksheet(selectedMonth); // Bulan yang dipilih untuk sheet pertama

    // // Menambahkan sheet untuk minggu-minggu berikutnya
    // for (let i = 1; i <= 4; i++) {
    //   addWorksheet(`${selectedMonth} Minggu ${i}`);
    // }
    addWorksheet(`test`);

    // Menghasilkan file XLSX sebagai buffer (tanpa menyimpan ke disk)
    const xlsxBuffer = await workbook.xlsx.writeBuffer();

    return xlsxBuffer; // Mengembalikan buffer file XLSX
  }

  async list({ currentUser, query } = {}) {
    const roleKeyMap = {
      LO: "lo_id",
      SLO: "slo_id",
      AM: "am_id",
    };

    const key = roleKeyMap[currentUser.role] || null;

    const baseWhere = key
      ? {
          [key]: currentUser.id,
        }
      : null;

    const options = buildQueryOptions(
      generateReportQueryConfig,
      query,
      baseWhere
    );

    const [data, count] = await Promise.all([
      this.prisma.report.findMany(options),
      this.prisma.report.count({ where: options.where }),
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
}

export default new GenerateReportService();
