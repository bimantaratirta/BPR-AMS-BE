import BaseRoutes from "../../base_classes/base-routes.js";
import AdminController from "./admin-controller.js";

import tryCatch from "../../utils/tryCatcher.js";
import AuthMiddleware from "../../middlewares/auth-token-middleware.js";
import validateCredentials from "../../middlewares/validate-credentials-middleware.js";
import { adminSchema } from "./admin-schema.js";

class AdminRoutes extends BaseRoutes {
  routes() {
    this.router.get("/", [
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(["SUPER_ADMIN", "ADMIN", "VIEWER"]),
      validateCredentials(adminSchema.query),
      tryCatch(AdminController.list),
    ]);
    this.router.get("/:id", [
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(["SUPER_ADMIN", "ADMIN", "VIEWER"]),
      tryCatch(AdminController.show),
    ]);
    this.router.post("/", [
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(["SUPER_ADMIN"]),
      validateCredentials(adminSchema.create),
      tryCatch(AdminController.create),
    ]);
    this.router.put("/:id", [
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(["SUPER_ADMIN", "ADMIN", "VIEWER"]),
      validateCredentials(adminSchema.update),
      tryCatch(AdminController.update),
    ]);
    this.router.delete("/:id", [
      AuthMiddleware.authenticate,
      AuthMiddleware.authorize(["SUPER_ADMIN"]),
      tryCatch(AdminController.delete),
    ]);
  }
}

export default new AdminRoutes().router;
