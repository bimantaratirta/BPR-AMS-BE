import BaseRoutes from "../../base_classes/base-routes.js";
import AuthController from "./auth-controller.js";

import tryCatch from "../../utils/tryCatcher.js";
import validateCredentials from "../../middlewares/validate-credentials-middleware.js";
import { authSchema } from "./auth-schema.js";

class AuthRoutes extends BaseRoutes {
  routes() {
    this.router.post("/admin/login", [
      validateCredentials(authSchema.login),
      tryCatch(AuthController.LoginAdmin),
    ]);
    this.router.post("/admin/register", [
      validateCredentials(authSchema.registerAdmin),
      tryCatch(AuthController.RegisterAdmin),
    ]);
    this.router.post("/admin/refresh-token", [
      tryCatch(AuthController.RefreshTokenAdmin),
    ]);

    this.router.post("/employee/login", [
      validateCredentials(authSchema.login),
      tryCatch(AuthController.LoginEmployee),
    ]);
    this.router.post("/employee/register", [
      validateCredentials(authSchema.registerEmployee),
      tryCatch(AuthController.RegisterEmployee),
    ]);
    this.router.post("/employee/refresh-token", [
      tryCatch(AuthController.RefreshTokenEmployee),
    ]);
  }
}

export default new AuthRoutes().router;
