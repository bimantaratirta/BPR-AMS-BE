// modules/report/report-routes.js
import BaseRoutes from "../../../base_classes/base-routes.js";
import tryCatch from "../../../utils/tryCatcher.js";
import GenerateReportController from "./generate-report-controller.js";

class GenerateReportRoutes extends BaseRoutes {
  routes() {
    this.router.get("/generate-xlsx-am", [
      // AuthMiddleware.authenticate, // Middleware untuk validasi token
      tryCatch(GenerateReportController.generateXlsxAM), // Menambahkan rute generate-xlsx
    ]);
    this.router.get("/generate-xlsx", [
      // AuthMiddleware.authenticate, // Middleware untuk validasi token
      tryCatch(GenerateReportController.generateXlsx), // Menambahkan rute generate-xlsx
    ]);
    this.router.get("/list", [
      // AuthMiddleware.authenticate, // Middleware untuk validasi token
      tryCatch(GenerateReportController.listAllReports), // Menambahkan rute generate-xlsx
    ]);
  }
}

export default new GenerateReportRoutes().router;
