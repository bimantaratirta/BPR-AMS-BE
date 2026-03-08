import BaseRoutes from "../../base_classes/base-routes.js";
import BranchController from "./branch-controller.js";

import tryCatch from "../../utils/tryCatcher.js";
import AuthMiddleware from "../../middlewares/auth-token-middleware.js";
import validateCredentials from "../../middlewares/validate-credentials-middleware.js";
import { branchSchema } from "./branch-schema.js";

class BranchRoutes extends BaseRoutes {
  routes() {
    this.router.get("/", [
      validateCredentials(branchSchema.query),
      tryCatch(BranchController.list),
    ]);
    this.router.get("/:id", [
      AuthMiddleware.authenticate,
      tryCatch(BranchController.show),
    ]);
    this.router.post("/", [
      // AuthMiddleware.authenticate,
      validateCredentials(branchSchema.create),
      tryCatch(BranchController.create),
    ]);
    this.router.put("/:id", [
      AuthMiddleware.authenticate,
      validateCredentials(branchSchema.update),
      tryCatch(BranchController.update),
    ]);
    this.router.delete("/:id", [
      AuthMiddleware.authenticate,
      tryCatch(BranchController.delete),
    ]);
  }
}

export default new BranchRoutes().router;
