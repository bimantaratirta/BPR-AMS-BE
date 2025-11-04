// modules/report/report-controller.js
import BaseError from "../../../base_classes/base-error.js";
import { successResponse } from "../../../utils/response.js";
import GenerateReportService from "./generate-report-service.js";

class GenerateReportController {
  async generateXlsxAM(req, res) {
    try {
      // Ambil parameter dari query
      const { year, month } = req.query;

      // Validasi parameter
      if (!year || !month) {
        throw BaseError.badRequest("Year and month are required");
      }

      const yearNum = parseInt(year);
      const monthNum = parseInt(month); // 1-12 dari user

      // Validasi range
      if (monthNum < 1 || monthNum > 12) {
        throw BaseError.badRequest("Month must be between 1-12");
      }

      if (yearNum < 2000 || yearNum > 2100) {
        throw BaseError.badRequest("Year must be between 2000-2100");
      }

      // Konversi ke 0-indexed untuk JavaScript Date (0 = Januari)
      const monthIndex = monthNum - 1;

      console.log("Generating report for:", {
        year: yearNum,
        month: monthNum,
        monthIndex,
      });

      // Panggil fungsi generateXlsxAM dengan parameter
      const xlsxBuffer = await GenerateReportService.generateXlsxAM(
        yearNum,
        monthIndex
      );

      // Get month name untuk filename
      const monthNames = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ];
      const monthName = monthNames[monthIndex];

      // Set header untuk response file XLSX
      res.set({
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="Laporan_Kunjungan_${monthName}_${yearNum}.xlsx"`,
      });

      // Kirim buffer XLSX sebagai response
      res.send(xlsxBuffer);
    } catch (err) {
      console.error("Error generating XLSX report:", err);
      throw BaseError.badRequest("Error generating XLSX report", err.message);
    }
  }

  async listAllReports(req, res) {
    try {
      // Mengambil year dan month dari query string
      const { year, month } = req.query;
      console.log("Request params:", year, month);

      // Validasi year dan month
      if (!year || !month) {
        throw BaseError.badRequest("Year and month are required");
      }

      const yearNum = parseInt(year);
      const monthNum = parseInt(month); // 1-12 dari user

      // Validasi range
      if (monthNum < 1 || monthNum > 12) {
        throw BaseError.badRequest("Month must be between 1-12");
      }

      if (isNaN(yearNum) || isNaN(monthNum)) {
        throw BaseError.badRequest("Year and month must be valid numbers");
      }

      // Konversi ke 0-indexed untuk JavaScript Date
      const monthIndex = monthNum - 1;

      console.log("Fetching reports for:", {
        year: yearNum,
        month: monthNum,
        monthIndex,
      });

      // Call the service method to get the reports
      const data = await GenerateReportService.listAllReports(
        yearNum,
        monthIndex
      );

      // Log jumlah data yang ditemukan
      const totalRegions = data.data?.length || 0;
      let totalReports = 0;

      data.data?.forEach((region) => {
        region.branches?.forEach((branch) => {
          branch.user?.forEach((slo) => {
            slo.subordinates?.forEach((lo) => {
              totalReports += lo.report_lo?.length || 0;
            });
          });
        });
      });

      console.log("Data retrieved:", {
        totalRegions,
        totalReports,
      });

      // Kirimkan response berhasil
      return successResponse(res, data, "Reports retrieved successfully", null);
    } catch (err) {
      console.error("Error retrieving reports:", err);
      throw BaseError.badRequest("Error retrieving reports", err.message);
    }
  }

  async generateXlsx(req, res) {
    try {
      const currentUser = req.user; // scope by creator
      const query = req.query; // filter query (misalnya berdasarkan status, customer_id, dll)

      // Panggil fungsi generateXlsx dari ReportService
      const xlsxBuffer = await GenerateReportService.generateXlsxByRole({
        currentUser,
        query,
      });

      // Set header untuk response file XLSX
      res.set({
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="Laporan_Nasabah_${Date.now()}.xlsx"`,
      });

      // Kirim buffer XLSX sebagai response untuk diunduh oleh pengguna
      res.send(xlsxBuffer); // Mengirimkan file XLSX dalam bentuk buffer
    } catch (err) {
      console.log(err);
      throw BaseError.badRequest("Error generating XLSX report", err);
    }
  }
}

export default new GenerateReportController();
