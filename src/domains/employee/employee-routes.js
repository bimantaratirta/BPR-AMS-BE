import BaseRoutes from "../../base_classes/base-routes.js";
import EmployeeController from "./employee-controller.js";

import tryCatch from "../../utils/tryCatcher.js";
import AuthMiddleware from "../../middlewares/auth-token-middleware.js";
import validateCredentials from "../../middlewares/validate-credentials-middleware.js";
import { handleMulterError } from "../../middlewares/handler-multer-error.js";
import { uploadFile } from "../../middlewares/upload-file-middleware.js";
import { employeeSchema } from "./employee-schema.js";

class EmployeeRoutes extends BaseRoutes {
  routes() {
    this.router.get("/", [
      AuthMiddleware.authenticate,
      validateCredentials(employeeSchema.query),
      tryCatch(EmployeeController.list),
    ]);
    this.router.get("/:id", [
      AuthMiddleware.authenticate,
      tryCatch(EmployeeController.show),
    ]);
    this.router.post("/", [
      AuthMiddleware.authenticate,
      tryCatch(EmployeeController.create),
    ]);
    this.router.put("/:id", [
      AuthMiddleware.authenticate,
      uploadFile("image", { maxMb: 5, maxCount: 1 }).array("avatar", 1),
      handleMulterError,
      validateCredentials(employeeSchema.update),
      tryCatch(EmployeeController.update),
    ]);
    this.router.delete("/:id", [
      AuthMiddleware.authenticate,
      tryCatch(EmployeeController.delete),
    ]);
  }
}

export default new EmployeeRoutes().router;
