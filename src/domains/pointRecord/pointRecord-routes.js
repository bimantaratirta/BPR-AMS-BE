import BaseRoutes from "../../base_classes/base-routes.js";
import PointrecordController from "./pointRecord-controller.js";

import tryCatch from "../../utils/tryCatcher.js";
import AuthMiddleware from "../../middlewares/auth-token-middleware.js";

import validateCredentials from "../../middlewares/validate-credentials-middleware.js";

class PointrecordRoutes extends BaseRoutes {
  routes() {
    this.router.get("/", [
      AuthMiddleware.authenticate,
      tryCatch(PointrecordController.list),
    ]);
    this.router.get("/:id", [
      AuthMiddleware.authenticate,
      tryCatch(PointrecordController.show),
    ]);
    // this.router.post("/", [tryCatch(PointrecordController.create)]);
    // this.router.put("/:id", [tryCatch(PointrecordController.update)]);
    // this.router.delete("/:id", [tryCatch(PointrecordController.delete)]);
  }
}

export default new PointrecordRoutes().router;
