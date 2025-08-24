import BaseRoutes from '../../../base_classes/base-routes.js';
import AuthMiddleware from '../../../middlewares/auth-token-middleware.js';
import validateCredentials from '../../../middlewares/validate-credentials-middleware.js';
import tryCatch from '../../../utils/tryCatcher.js';
import KRSController from './KRS-controller.js';
import { createKRS } from './KRS-schema.js';

class KRSRoutes extends BaseRoutes {
  routes() {
    this.router.get('/', [
      AuthMiddleware.authenticate,
      tryCatch(KRSController.get),
    ]);

    this.router.get('/:id', [
      AuthMiddleware.authenticate,
      tryCatch(KRSController.getById),
    ]);

    this.router.post('/', [
      AuthMiddleware.authenticate,
      validateCredentials(createKRS),
      tryCatch(KRSController.post),
    ]);

    this.router.put('/:id', [
      AuthMiddleware.authenticate,
      validateCredentials(createKRS),
      tryCatch(KRSController.put),
    ]);

    this.router.delete('/:id', [
      AuthMiddleware.authenticate,
      tryCatch(KRSController.deleteById),
    ]);

    this.router.get('/:id/generate-pdf', [
      AuthMiddleware.authenticate,
      tryCatch(KRSController.generatePDF),
    ]);

    this.router.get('/:id/generate-docx', [
      AuthMiddleware.authenticate,
      tryCatch(KRSController.generateDOCX),
    ]);
  }
}

export default new KRSRoutes().router;
