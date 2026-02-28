import BaseRoutes from "../../base_classes/base-routes.js";
import AttendanceController from "./attendance-controller.js";

import tryCatch from "../../utils/tryCatcher.js";
import AuthMiddleware from "../../middlewares/auth-token-middleware.js";
import validateCredentials from "../../middlewares/validate-credentials-middleware.js";
import { handleMulterError } from "../../middlewares/handler-multer-error.js";
import { uploadFile } from "../../middlewares/upload-file-middleware.js";
import { attendanceSchema } from "./attendance-schema.js";

class AttendanceRoutes extends BaseRoutes {
  routes() {
    this.router.get("/", [
      AuthMiddleware.authenticate,
      validateCredentials(attendanceSchema.query),
      tryCatch(AttendanceController.list),
    ]);
    this.router.get("/:id", [
      AuthMiddleware.authenticate,
      tryCatch(AttendanceController.show),
    ]);
    this.router.post("/checkin", [
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(["EMPLOYEE"]),
      uploadFile("all", { maxMb: 5, maxCount: 1 }).array("checkInPhoto", 1),
      handleMulterError,
      validateCredentials(attendanceSchema.checkIn),
      tryCatch(AttendanceController.checkIn),
    ]);
    this.router.post("/checkout", [
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(["EMPLOYEE"]),
      validateCredentials(attendanceSchema.checkOut),
      tryCatch(AttendanceController.checkOut),
    ]);
    this.router.post("/auto-generate-absent-employees", [
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(["ADMIN"]),
      tryCatch(AttendanceController.autoGenerateAttandanceForAbsentEmployees),
    ]);

    this.router.put("/:id", [
      AuthMiddleware.authenticate,
      tryCatch(AttendanceController.update),
    ]);
    this.router.delete("/:id", [
      AuthMiddleware.authenticate,
      tryCatch(AttendanceController.delete),
    ]);
  }
}

export default new AttendanceRoutes().router;
