// modules/report/report-controller.js
import BaseError from "../../../base_classes/base-error.js";
import { successResponse } from "../../../utils/response.js";
import ReportService from "./report-service.js";

class ReportController {
  async generateXlsxAM(req, res) {
    try {
      const currentUser = req.user; // scope by creator
      const query = req.query; // filter query (misalnya berdasarkan status, customer_id, dll)

      // Panggil fungsi generateXlsx dari ReportService
      const xlsxBuffer = await ReportService.generateXlsxAM();

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
  async generateXlsx(req, res) {
    try {
      const currentUser = req.user; // scope by creator
      const query = req.query; // filter query (misalnya berdasarkan status, customer_id, dll)

      // Panggil fungsi generateXlsx dari ReportService
      const xlsxBuffer = await ReportService.generateXlsx({
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

  async create(req, res) {
    console.log("Kontol");
    const data = req.body;
    const files = req.files || [];
    // Validasi tambahan jika perlu
    // await reportSchema.create.validateAsync(data);

    const result = await ReportService.create(data, files);
    return successResponse(res, result, "Report retrieved successfully");
  }

  async list(req, res) {
    const currentUser = req.user; // scope by creator
    const query = req.query;
    const result = await ReportService.list({ currentUser, query });

    return successResponse(
      res,
      result.data,
      "customer retrieved successfully",
      result.meta
    );
  }

  async detail(req, res) {
    const result = await ReportService.detail(req.params.id);
    return successResponse(res, result, "report detail retrieved");
  }

  async remove(req, res) {
    const result = await ReportService.remove(req.params.id);
    return successResponse(res, null, "report deleted successfully");
  }

  async generateXlsx(req, res) {
    try {
      const currentUser = req.user; // scope by creator
      const query = req.query;
      const xlsxBuffer = await ReportService.generateXlsx({
        currentUser,
        query,
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ); // MIME type untuk XLSX
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="report.xlsx"'
      ); // Menjadikan file dapat diunduh, dengan nama file

      // Kirim buffer file XLSX ke respon
      res.send(xlsxBuffer); // Kirim buffer sebagai respon
    } catch (err) {
      console.log(err);
      throw BaseError.badRequest("Error generating XLSX report", err);
    }
  }
}

export default new ReportController();
