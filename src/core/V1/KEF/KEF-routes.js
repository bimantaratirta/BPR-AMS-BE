import BaseRoutes from '../../../base_classes/base-routes.js';
import AuthMiddleware from '../../../middlewares/auth-token-middleware.js';
import validateCredentials from '../../../middlewares/validate-credentials-middleware.js';
import tryCatch from '../../../utils/tryCatcher.js';
import KEFController from './KEF-controller.js';
import { createKEF } from './KEF-schema.js';

class KEFRoutes extends BaseRoutes {
  routes() {
    this.router.get('/', [
      AuthMiddleware.authenticate,
      tryCatch(KEFController.get),
    ]);

    this.router.get('/:id', [
      AuthMiddleware.authenticate,
      tryCatch(KEFController.getById),
    ]);

    this.router.post('/', [
      AuthMiddleware.authenticate,
      validateCredentials(createKEF),
      tryCatch(KEFController.post),
    ]);

    this.router.put('/:id', [
      AuthMiddleware.authenticate,
      validateCredentials(createKEF),
      tryCatch(KEFController.put),
    ]);

    this.router.delete('/:id', [
      AuthMiddleware.authenticate,
      tryCatch(KEFController.deleteById),
    ]);

    this.router.get('/:id/generate-pdf', [
      AuthMiddleware.authenticate,
      tryCatch(KEFController.generatePDF),
    ]);

    this.router.get('/:id/generate-docx', [
      AuthMiddleware.authenticate,
      tryCatch(KEFController.generateDOCX),
    ]);
  }
}

export default new KEFRoutes().router;
