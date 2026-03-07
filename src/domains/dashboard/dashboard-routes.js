import BaseRoutes from "../../base_classes/base-routes.js";
import DashboardController from "./dashboard-controller.js";
import tryCatch from "../../utils/tryCatcher.js";
import AuthMiddleware from "../../middlewares/auth-token-middleware.js";

class DashboardRoutes extends BaseRoutes {
  routes() {
    this.router.get("/summary", [
      AuthMiddleware.authenticate,
      tryCatch(DashboardController.summary),
    ]);
  }
}

export default new DashboardRoutes().router;
