import tryCatch from "../../../utils/tryCatcher.js";
import validateCredentials from "../../../middlewares/validate-credentials-middleware.js";
import { evaluationSchema } from "./evaluation-schema.js";
import EvaluationController from "./evaluation-controller.js";
import AuthMiddleware from "../../../middlewares/auth-token-middleware.js";
import BaseRoutes from "../../../base_classes/base-routes.js";

class EvaluationRoutes extends BaseRoutes {
  routes() {
    this.router.post("/", [
      AuthMiddleware.authenticate,
      validateCredentials(evaluationSchema.create),
      tryCatch(EvaluationController.create),
    ]);
    this.router.get("/", [
      AuthMiddleware.authenticate,
      tryCatch(EvaluationController.list),
    ]);
  }
}
export default new EvaluationRoutes().router;
