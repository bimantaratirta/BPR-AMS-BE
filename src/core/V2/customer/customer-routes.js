// routes/customerRoutes.js
import BaseRoutes from '../../../base_classes/base-routes.js';
import tryCatch from '../../../utils/tryCatcher.js';
import validateCredentials from '../../../middlewares/validate-credentials-middleware.js';
import AuthMiddleware from '../../../middlewares/auth-token-middleware.js';

import CustomerController from './customer-controller.js';
import { customerSchema } from './customer-schema.js';

class CustomerRoutes extends BaseRoutes {
  routes() {
    // List
    this.router.get('/', [
      AuthMiddleware.authenticate,
      validateCredentials(customerSchema.query),
      tryCatch(CustomerController.list),
    ]);

    // Create
    this.router.post('/', [
      AuthMiddleware.authenticate,
      validateCredentials(customerSchema.create),
      tryCatch(CustomerController.create),
    ]);

    // Detail
    this.router.get('/:id', [
      AuthMiddleware.authenticate,
      tryCatch(CustomerController.detail),
    ]);

    // Update
    this.router.put('/:id', [
      AuthMiddleware.authenticate,
      validateCredentials(customerSchema.update),
      tryCatch(CustomerController.update),
    ]);

    // Delete
    this.router.delete('/:id', [
      AuthMiddleware.authenticate,
      tryCatch(CustomerController.remove),
    ]);
  }
}

export default new CustomerRoutes().router;
