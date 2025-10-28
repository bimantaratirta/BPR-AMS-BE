// modules/report/report-routes.js
import BaseRoutes from "../../../base_classes/base-routes.js";
import tryCatch from "../../../utils/tryCatcher.js";
import testController from "./test-controller.js";

class TestRoutes extends BaseRoutes {
  routes() {
    this.router.get("/generate-xlsx-am", [
      // AuthMiddleware.authenticate, // Middleware untuk validasi token
      tryCatch(testController.generateXlsxAM), // Menambahkan rute generate-xlsx
    ]);
    this.router.get("/list", [
      // AuthMiddleware.authenticate, // Middleware untuk validasi token
      tryCatch(testController.listAllReports), // Menambahkan rute generate-xlsx
    ]);
  }
}

export default new TestRoutes().router;
