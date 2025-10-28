// modules/report/report-controller.js
import BaseError from "../../../base_classes/base-error.js";
import { successResponse } from "../../../utils/response.js";
import testService from "./test-service.js";

class TestController {
  async generateXlsxAM(req, res) {
    try {
      // Panggil fungsi generateXlsx dari ReportService
      const xlsxBuffer = await testService.generateXlsxAM();

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

  async listAllReports(req, res) {
    try {
      // Mengambil year dan month dari query string
      const { year, month } = req.query;

      // Pastikan year dan month ada dalam query
      if (!year || !month) {
        return res
          .status(400)
          .json({ message: "Year and month are required." });
      }

      // Call the service method to get the reports
      const data = await testService.listAllReports(year, month);

      // Kirimkan response berhasil
      return successResponse(
        res,
        data,
        "Customer retrieved successfully",
        null
      );
    } catch (err) {
      console.log(err);
      throw BaseError.badRequest("Error retrieving reports", err);
    }
  }
}

export default new TestController();
