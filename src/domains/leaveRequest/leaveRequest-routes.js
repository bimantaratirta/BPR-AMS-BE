import BaseRoutes from "../../base_classes/base-routes.js";
import LeaveRequestController from "./leaveRequest-controller.js";

import tryCatch from "../../utils/tryCatcher.js";
import AuthMiddleware from "../../middlewares/auth-token-middleware.js";
import validateCredentials from "../../middlewares/validate-credentials-middleware.js";
import { handleMulterError } from "../../middlewares/handler-multer-error.js";
import { uploadFile } from "../../middlewares/upload-file-middleware.js";
import { leaveRequestSchema } from "./leaveRequest-schema.js";

class LeaveRequestRoutes extends BaseRoutes {
  routes() {
    this.router.get("/", [
      AuthMiddleware.authenticate,
      // AuthMiddleware.authorize(["EMPLOYEE"]),
      validateCredentials(leaveRequestSchema.query),
      tryCatch(LeaveRequestController.list),
    ]);
    this.router.get("/:id", [
      AuthMiddleware.authenticate,
      tryCatch(LeaveRequestController.show),
    ]);
    this.router.post("/", [
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(["EMPLOYEE"]),
      uploadFile("all", { maxMb: 5, maxCount: 1 }).array("attachment", 1),
      handleMulterError,
      validateCredentials(leaveRequestSchema.create),
      tryCatch(LeaveRequestController.create),
    ]);
    this.router.put("/:id", [
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(["ADMIN", "SUPER_ADMIN"]),
      validateCredentials(leaveRequestSchema.update),
      tryCatch(LeaveRequestController.update),
    ]);
    this.router.delete("/:id", [
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(["ADMIN", "SUPER_ADMIN"]),
      tryCatch(LeaveRequestController.delete),
    ]);
  }
}

export default new LeaveRequestRoutes().router;
