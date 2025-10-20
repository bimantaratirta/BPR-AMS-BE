import BaseRoutes from "../../../base_classes/base-routes.js";
import tryCatch from "../../../utils/tryCatcher.js";
import AuthMiddleware from "../../../middlewares/auth-token-middleware.js";
import userController from "./user-controller.js";

class BranchRoutes extends BaseRoutes {
  routes() {
    this.router.get("/", [
      AuthMiddleware.authenticate,
      tryCatch(userController.List),
    ]);

    this.router.get("/lo-by-slo/:id", [
      AuthMiddleware.authenticate,
      tryCatch(userController.ListLoBySlo),
    ]);

    this.router.get("/slo-by-am/:id", [
      AuthMiddleware.authenticate,
      tryCatch(userController.ListSloByAm),
    ]);
  }
}

export default new BranchRoutes().router;
