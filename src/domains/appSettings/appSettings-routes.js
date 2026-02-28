import BaseRoutes from "../../base_classes/base-routes.js";
import AppsettingsController from "./appSettings-controller.js";

import tryCatch from "../../utils/tryCatcher.js";
import AuthMiddleware from "../../middlewares/auth-token-middleware.js";
import validateCredentials from "../../middlewares/validate-credentials-middleware.js";
import { handleMulterError } from "../../middlewares/handler-multer-error.js";
import { uploadFile } from "../../middlewares/upload-file-middleware.js";

class AppsettingsRoutes extends BaseRoutes {
  routes() {
    this.router.get("/", [
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(["ADMIN", "SUPER_ADMIN"]),
      tryCatch(AppsettingsController.list),
    ]);
    this.router.get("/:id", [
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(["ADMIN", "SUPER_ADMIN"]),
      tryCatch(AppsettingsController.show),
    ]);
    this.router.post("/", [
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(["ADMIN", "SUPER_ADMIN"]),
      uploadFile("image", { maxMb: 5, maxCount: 1 }).array("companyLogo", 1),
      handleMulterError,
      tryCatch(AppsettingsController.create),
    ]);
    this.router.put("/:id", [
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(["ADMIN", "SUPER_ADMIN"]),
      uploadFile("image", { maxMb: 5, maxCount: 1 }).array("companyLogo", 1),
      handleMulterError,
      tryCatch(AppsettingsController.update),
    ]);
    this.router.delete("/:id", [
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(["ADMIN", "SUPER_ADMIN"]),
      tryCatch(AppsettingsController.delete),
    ]);
  }
}

export default new AppsettingsRoutes().router;
