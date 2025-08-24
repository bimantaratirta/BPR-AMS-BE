import BaseRoutes from '../../../base_classes/base-routes.js';
import AuthMiddleware from '../../../middlewares/auth-token-middleware.js';
import validateCredentials from '../../../middlewares/validate-credentials-middleware.js';
import tryCatch from '../../../utils/tryCatcher.js';
import KMMController from './KMM-controller.js';
import { createKMM } from './KMM-schema.js';

class KMMRoutes extends BaseRoutes {
  routes() {
    this.router.get('/', [
      AuthMiddleware.authenticate,
      tryCatch(KMMController.get),
    ]);

    this.router.get('/:id', [
      AuthMiddleware.authenticate,
      tryCatch(KMMController.getById),
    ]);

    this.router.post('/', [
      AuthMiddleware.authenticate,
      validateCredentials(createKMM),
      tryCatch(KMMController.post),
    ]);

    this.router.put('/:id', [
      AuthMiddleware.authenticate,
      validateCredentials(createKMM),
      tryCatch(KMMController.put),
    ]);

    this.router.delete('/:id', [
      AuthMiddleware.authenticate,
      tryCatch(KMMController.deleteById),
    ]);

    this.router.get('/:id/generate-pdf', [
      AuthMiddleware.authenticate,
      tryCatch(KMMController.generatePDF),
    ]);

    this.router.get('/:id/generate-docx', [
      AuthMiddleware.authenticate,
      tryCatch(KMMController.generateDOCX),
    ]);
  }
}

export default new KMMRoutes().router;
