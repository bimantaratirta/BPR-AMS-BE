import { successResponse } from "../../../utils/response.js";
import dashboardService from "./dashboard-service.js";

class DashboardController {
  async dashboardLo(req, res) {
    const currentUser = req.user; // scope by creator
    const { format } = req.query; // Menangkap query parameter 'format' (minggu atau bulan)

    try {
      // Memanggil service dashboardLo dengan parameter format (minggu atau bulan)
      const result = await dashboardService.dashboardLo(currentUser, {
        format, // Format bisa 'minggu' atau 'bulan'
      });

      // Menyesuaikan label untuk format "bulan"
      //   if (format === "bulan") {
      //     result.progresive = result.progresive.map((data, index) => ({
      //       label: `Minggu ${index + 1}`, // Mengganti label dengan 'Minggu 1', 'Minggu 2', dst
      //       value: data,
      //     }));
      //   }

      // Mengirimkan response dengan data yang diambil dari service
      return successResponse(
        res,
        result,
        "Customer data retrieved successfully",
        null // Tidak ada meta
      );
    } catch (error) {
      console.error("Error in dashboardLo controller:", error);
      return res.status(500).json({
        message: "An error occurred while retrieving customer data",
        error: error.message,
      });
    }
  }

  async dashboardSlo(req, res) {
    const currentUser = req.user; // scope by creator
    const { format } = req.query; // Menangkap query parameter 'format' (minggu atau bulan)

    try {
      // Memanggil service dashboardSlo untuk mendapatkan laporan LO
      const result = await dashboardService.dashboardSlo(currentUser, {
        format,
      });

      // Mengirimkan response dengan data
      return successResponse(
        res,
        result, // data berisi jumlah laporan per LO dan totalnya
        "LO report data retrieved successfully",
        null // Tidak ada meta
      );
    } catch (error) {
      console.error("Error in dashboardSlo controller:", error);
      return res.status(500).json({
        message: "An error occurred while retrieving LO report data",
        error: error.message,
      });
    }
  }

  async dashboardAm(req, res) {
    const currentUser = req.user; // scope by creator
    const { format } = req.query; // Menangkap query parameter 'format' (minggu atau bulan)

    try {
      // Memanggil service dashboardSlo untuk mendapatkan laporan LO
      const result = await dashboardService.dashboardAm(currentUser, {
        format,
      });

      // Mengirimkan response dengan data
      return successResponse(
        res,
        result, // data berisi jumlah laporan per LO dan totalnya
        "SLO report data retrieved successfully",
        null // Tidak ada meta
      );
    } catch (error) {
      console.error("Error in dashboardSlo controller:", error);
      return res.status(500).json({
        message: "An error occurred while retrieving LO report data",
        error: error.message,
      });
    }
  }

  async dashboardDireksi(req, res) {
    const currentUser = req.user; // scope by creator
    const { format } = req.query; // Menangkap query parameter 'format' (minggu atau bulan)

    try {
      // Memanggil service dashboardSlo untuk mendapatkan laporan LO
      const result = await dashboardService.dashboardDireksi(currentUser, {
        format,
      });

      // Mengirimkan response dengan data
      return successResponse(
        res,
        result, // data berisi jumlah laporan per LO dan totalnya
        "AM report data retrieved successfully",
        null // Tidak ada meta
      );
    } catch (error) {
      console.error("Error in dashboardSlo controller:", error);
      return res.status(500).json({
        message: "An error occurred while retrieving LO report data",
        error: error.message,
      });
    }
  }
}

export default new DashboardController();
