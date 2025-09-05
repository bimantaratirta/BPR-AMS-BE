import BaseRoutes from '../../../base_classes/base-routes.js';

import tryCatch from '../../../utils/tryCatcher.js';
import validateCredentials from '../../../middlewares/validate-credentials-middleware.js';
import AuthMiddleware from '../../../middlewares/auth-token-middleware.js';
import KSSMController from './KSSM-controller.js';
import { createKSSM } from './KSSM-schema.js';

class KSSMRoutes extends BaseRoutes {
  routes() {
    this.router.get('/', [
      AuthMiddleware.authenticate,
      tryCatch(KSSMController.get),
    ]);

    this.router.get('/:id', [
      AuthMiddleware.authenticate,
      tryCatch(KSSMController.getById),
    ]);

    this.router.post('/', [
      AuthMiddleware.authenticate,
      validateCredentials(createKSSM),
      tryCatch(KSSMController.post),
    ]);

    this.router.put('/:id', [
      AuthMiddleware.authenticate,
      validateCredentials(createKSSM),
      tryCatch(KSSMController.put),
    ]);

    this.router.delete('/:id', [
      AuthMiddleware.authenticate,
      tryCatch(KSSMController.deleteById),
    ]);

    this.router.get('/:id/generate-pdf', [
      AuthMiddleware.authenticate,
      tryCatch(KSSMController.generatePDF),
    ]);

    this.router.get('/:id/generate-docx', [
      AuthMiddleware.authenticate,
      tryCatch(KSSMController.generateDOCX),
    ]);
  }
}

export default new KSSMRoutes().router;
