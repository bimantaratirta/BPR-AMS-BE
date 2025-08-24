import BaseRoutes from '../../../base_classes/base-routes.js';
import tryCatch from '../../../utils/tryCatcher.js';
import validateCredentials from '../../../middlewares/validate-credentials-middleware.js';
import AuthMiddleware from '../../../middlewares/auth-token-middleware.js';

import RegionController from './region-controller.js';
import { createRegionSchema, updateRegionSchema } from './region-schema.js';

class RegionRoutes extends BaseRoutes {
  routes() {
    // List
    this.router.get('/', [
      AuthMiddleware.authenticate,
      tryCatch(RegionController.list),
    ]);

    // Create
    this.router.post('/', [
      AuthMiddleware.authenticate,
      validateCredentials(createRegionSchema),
      tryCatch(RegionController.create),
    ]);

    // Detail
    this.router.get('/:id', [
      AuthMiddleware.authenticate,
      tryCatch(RegionController.detail),
    ]);

    // Update
    this.router.put('/:id', [
      AuthMiddleware.authenticate,
      validateCredentials(updateRegionSchema),
      tryCatch(RegionController.update),
    ]);

    // Delete (soft delete via middleware)
    this.router.delete('/:id', [
      AuthMiddleware.authenticate,
      tryCatch(RegionController.remove),
    ]);
  }
}

export default new RegionRoutes().router;
