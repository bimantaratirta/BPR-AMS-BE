import BaseRoutes from '../../../base_classes/base-routes.js';
import AuthController from './auth-controller.js';

import tryCatch from '../../../utils/tryCatcher.js';
import validateCredentials from '../../../middlewares/validate-credentials-middleware.js';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from './auth-schema.js';
import AuthMiddleware from '../../../middlewares/auth-token-middleware.js';

class AuthRoutes extends BaseRoutes {
  routes() {
    this.router.post('/register', [
      validateCredentials(registerSchema),
      tryCatch(AuthController.register),
    ]);

    this.router.post('/login', [
      validateCredentials(loginSchema),
      tryCatch(AuthController.login),
    ]);

    this.router.post('/refresh-token', [
      validateCredentials(refreshTokenSchema),
      tryCatch(AuthController.refreshToken),
    ]);

    this.router.get('/me', [
      AuthMiddleware.authenticate,
      tryCatch(AuthController.getProfile),
    ]);
  }
}

export default new AuthRoutes().router;
