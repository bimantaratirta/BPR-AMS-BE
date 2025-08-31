import BaseRoutes from '../../../base_classes/base-routes.js';
import AuthMiddleware from '../../../middlewares/auth-token-middleware.js';
import tryCatch from '../../../utils/tryCatcher.js';
import ReviewCustomerController from './review-customer-controller.js';

class ReviewCustomerRoutes extends BaseRoutes {
  routes() {
    this.router.post('/', [
      AuthMiddleware.authenticate,
      tryCatch(ReviewCustomerController.create),
    ]);

    this.router.get('/', [
      AuthMiddleware.authenticate,
      tryCatch(ReviewCustomerController.list),
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

export default new ReviewCustomerRoutes().router;
