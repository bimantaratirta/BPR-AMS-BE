import BaseRoutes from '../../../base_classes/base-routes.js';
import validateCredentials from '../../../middlewares/validate-credentials-middleware.js';
import FLEKSIController from './FLEKSI-controller.js';
import { createFLEKSI } from './FLEKSI-schema.js';
import tryCatch from '../../../utils/tryCatcher.js';
import AuthMiddleware from '../../../middlewares/auth-token-middleware.js';

class FLEKSIRoutes extends BaseRoutes {
  routes() {
    this.router.get('/', [
      AuthMiddleware.authenticate,
      tryCatch(FLEKSIController.get),
    ]);

    this.router.get('/:id', [
      AuthMiddleware.authenticate,
      tryCatch(FLEKSIController.getById),
    ]);

    this.router.post('/', [
      AuthMiddleware.authenticate,
      validateCredentials(createFLEKSI),
      tryCatch(FLEKSIController.post),
    ]);

    this.router.put('/:id', [
      AuthMiddleware.authenticate,
      validateCredentials(createFLEKSI),
      tryCatch(FLEKSIController.put),
    ]);

    this.router.delete('/:id', [
      AuthMiddleware.authenticate,
      tryCatch(FLEKSIController.deleteById),
    ]);

    this.router.get('/:id/generate-pdf', [
      AuthMiddleware.authenticate,
      tryCatch(FLEKSIController.generatePDF),
    ]);

    this.router.get('/:id/generate-docx', [
      AuthMiddleware.authenticate,
      tryCatch(FLEKSIController.generateDOCX),
    ]);
  }
}

export default new FLEKSIRoutes().router;
