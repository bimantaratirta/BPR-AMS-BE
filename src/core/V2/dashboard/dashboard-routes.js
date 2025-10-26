import BaseRoutes from "../../../base_classes/base-routes.js";
import authTokenMiddleware from "../../../middlewares/auth-token-middleware.js";
import tryCatch from "../../../utils/tryCatcher.js";
import dashboardController from "./dashboard-controller.js";

class DashboardRoutes extends BaseRoutes {
  routes() {
    this.router.get("/lo", [
      authTokenMiddleware.authenticate,
      tryCatch(dashboardController.dashboardLo),
    ]);
    this.router.get("/slo", [
      authTokenMiddleware.authenticate,
      tryCatch(dashboardController.dashboardSlo),
    ]);
    this.router.get("/am", [
      authTokenMiddleware.authenticate,
      tryCatch(dashboardController.dashboardAm),
    ]);
    this.router.get("/direksi", [
      authTokenMiddleware.authenticate,
      tryCatch(dashboardController.dashboardDireksi),
    ]);
  }
}

export default new DashboardRoutes().router;
