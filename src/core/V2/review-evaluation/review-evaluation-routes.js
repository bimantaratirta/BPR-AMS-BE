import BaseRoutes from "../../../base_classes/base-routes.js";
import AuthMiddleware from "../../../middlewares/auth-token-middleware.js";
import tryCatch from "../../../utils/tryCatcher.js";
import ReviewEvaluationController from "./review-evaluation-controller.js";

class ReviewEvaluationRoutes extends BaseRoutes {
  routes() {
    this.router.post("/", [
      AuthMiddleware.authenticate,
      tryCatch(ReviewEvaluationController.create),
    ]);

    this.router.get("/", [
      AuthMiddleware.authenticate,
      tryCatch(ReviewEvaluationController.list),
    ]);
    // this.router.get('/:id', [
    //   AuthMiddleware.authenticate,
    //   tryCatch(ReviewCustomerController.detail),
    // ]);
    // this.router.delete('/:id', [
    //   AuthMiddleware.authenticate,
    //   tryCatch(ReviewCustomerController.remove),
    // ]);
  }
}

export default new ReviewEvaluationRoutes().router;
