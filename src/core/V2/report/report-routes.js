// modules/report/report-routes.js
import BaseRoutes from "../../../base_classes/base-routes.js";
import tryCatch from "../../../utils/tryCatcher.js";
import AuthMiddleware from "../../../middlewares/auth-token-middleware.js";
import ReportController from "./report-controller.js";
import { reportSchema } from "./report-schema.js";
import uploadFile from "../../../middlewares/upload-file-middleware.js";
import validateCredentials from "../../../middlewares/validate-credentials-middleware.js";
import { handleMulterError } from "../../../middlewares/handler-multer-error.js";
import validateQueryCredentials from "../../../middlewares/validate-query-credentials-middleware.js";

class ReportRoutes extends BaseRoutes {
  routes() {
    // Satu endpoint: create report + upload banyak foto
    // console.log('first '),
    this.router.post("/", [
      AuthMiddleware.authenticate,
      uploadFile("image", { maxMb: 5, maxCount: 5 }).array("images", 5),
      handleMulterError,
      validateCredentials(reportSchema.create),
      tryCatch(ReportController.create),
    ]);

    // (opsional) list, detail, delete tetap ada:
    this.router.get("/", [
      AuthMiddleware.authenticate,
      validateQueryCredentials(reportSchema.query),
      tryCatch(ReportController.list),
    ]);
    this.router.get("/:id", [
      AuthMiddleware.authenticate,
      tryCatch(ReportController.detail),
    ]);
    this.router.delete("/:id", [
      AuthMiddleware.authenticate,
      tryCatch(ReportController.remove),
    ]);
  }
}

export default new ReportRoutes().router;
