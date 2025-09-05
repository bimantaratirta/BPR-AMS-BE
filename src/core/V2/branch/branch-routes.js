import BaseRoutes from '../../../base_classes/base-routes.js';
import tryCatch from '../../../utils/tryCatcher.js';
import validateCredentials from '../../../middlewares/validate-credentials-middleware.js';
import AuthMiddleware from '../../../middlewares/auth-token-middleware.js';

import BranchController from './branch-controller.js';
import { createBranchSchema, updateBranchSchema } from './branch-schema.js';

class BranchRoutes extends BaseRoutes {
  routes() {
    // List
    this.router.get('/', [
      AuthMiddleware.authenticate,
      tryCatch(BranchController.list),
    ]);

    // Create
    this.router.post('/', [
      AuthMiddleware.authenticate,
      validateCredentials(createBranchSchema),
      tryCatch(BranchController.create),
    ]);

    // Detail
    this.router.get('/:id', [
      AuthMiddleware.authenticate,
      tryCatch(BranchController.detail),
    ]);

    // Update
    this.router.put('/:id', [
      AuthMiddleware.authenticate,
      validateCredentials(updateBranchSchema),
      tryCatch(BranchController.update),
    ]);

    // Delete (soft delete via middleware)
    this.router.delete('/:id', [
      AuthMiddleware.authenticate,
      tryCatch(BranchController.remove),
    ]);
  }
}

export default new BranchRoutes().router;
