import BaseRoutes from '../../../base_classes/base-routes.js';
import AuthMiddleware from '../../../middlewares/auth-token-middleware.js';

import validateCredentials from '../../../middlewares/validate-credentials-middleware.js';
import tryCatch from '../../../utils/tryCatcher.js';
import KSSController from './KSS-controller.js';
import { createKSS } from './KSS-schema.js';

class KSSRoutes extends BaseRoutes {
  routes() {
    this.router.get('/', [
      AuthMiddleware.authenticate,
      tryCatch(KSSController.get),
    ]);

    this.router.get('/:id', [
      AuthMiddleware.authenticate,
      tryCatch(KSSController.getById),
    ]);

    this.router.post('/', [
      AuthMiddleware.authenticate,
      validateCredentials(createKSS),
      tryCatch(KSSController.post),
    ]);

    this.router.put('/:id', [
      AuthMiddleware.authenticate,
      validateCredentials(createKSS),
      tryCatch(KSSController.put),
    ]);

    this.router.delete('/:id', [
      AuthMiddleware.authenticate,
      tryCatch(KSSController.deleteById),
    ]);

    this.router.get('/:id/generate-pdf', [
      AuthMiddleware.authenticate,
      tryCatch(KSSController.generatePDF),
    ]);

    this.router.get('/:id/generate-docx', [
      AuthMiddleware.authenticate,
      tryCatch(KSSController.generateDOCX),
    ]);
  }
}

export default new KSSRoutes().router;
