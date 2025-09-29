import BaseRoutes from '../../base_classes/base-routes.js';
import tryCatch from '../../utils/tryCatcher.js';
import validateCredentials from '../../middlewares/validate-credentials-middleware.js';
import KARController from './KAR-controller.js';
import { createKAR } from './KAR-schema.js';
import authToken from '../../middlewares/auth-token-middleware.js';

class KARRoutes extends BaseRoutes {
  routes() {
    this.router.get('/', [authToken, tryCatch(KARController.get)]);

    this.router.get('/:id', [authToken, tryCatch(KARController.getById)]);

    this.router.post('/', [
      authToken,
      validateCredentials(createKAR),
      tryCatch(KARController.post),
    ]);

    this.router.put('/:id', [
      authToken,
      validateCredentials(createKAR),
      tryCatch(KARController.put),
    ]);

    this.router.delete('/:id', [authToken, tryCatch(KARController.deleteById)]);

    this.router.get('/:id/generate-pdf', [
      // authToken,
      tryCatch(KARController.generatePDF),
    ]);

    this.router.get('/:id/generate-docx', [
      authToken,
      tryCatch(KARController.generateDOCX),
    ]);
  }
}

export default new KARRoutes().router;
