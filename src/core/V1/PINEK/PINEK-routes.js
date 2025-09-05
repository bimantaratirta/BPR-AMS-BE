import BaseRoutes from '../../../base_classes/base-routes.js';
import validateCredentials from '../../../middlewares/validate-credentials-middleware.js';
import PINEKController from './PINEK-controller.js';
import { createPINEK } from './PINEK-schema.js';
import tryCatch from '../../../utils/tryCatcher.js';
import AuthMiddleware from '../../../middlewares/auth-token-middleware.js';

class PINEKRoutes extends BaseRoutes {
  routes() {
    this.router.get('/', [
      AuthMiddleware.authenticate,
      tryCatch(PINEKController.get),
    ]);

    this.router.get('/:id', [
      AuthMiddleware.authenticate,
      tryCatch(PINEKController.getById),
    ]);

    this.router.put('/:id', [
      AuthMiddleware.authenticate,
      validateCredentials(createPINEK),
      tryCatch(PINEKController.put),
    ]);

    this.router.post('/', [
      AuthMiddleware.authenticate,
      validateCredentials(createPINEK),
      tryCatch(PINEKController.post),
    ]);

    this.router.delete('/:id', [
      AuthMiddleware.authenticate,
      tryCatch(PINEKController.deleteById),
    ]);

    this.router.get('/:id/generate-pdf', [
      AuthMiddleware.authenticate,
      tryCatch(PINEKController.generatePDF),
    ]);

    this.router.get('/:id/generate-docx', [
      AuthMiddleware.authenticate,
      tryCatch(PINEKController.generateDOCX),
    ]);
  }
}

export default new PINEKRoutes().router;
