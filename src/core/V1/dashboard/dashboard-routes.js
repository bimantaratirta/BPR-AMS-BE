import { Router } from 'express';
import DashboardController from './dashboard-controller.js';
import tryCatch from '../../../utils/tryCatcher.js';
import AuthMiddleware from '../../../middlewares/auth-token-middleware.js';

const router = Router();

router.get('/products-stats', [
  // AuthMiddleware.authenticate,
  tryCatch(DashboardController.getProductStats),
]);

router.get('/daily-products', [
  AuthMiddleware.authenticate,
  tryCatch(DashboardController.getDailyProductsTraffic),
]);

router.get('/products-total-report', [
  AuthMiddleware.authenticate,
  tryCatch(DashboardController.getCountProducts),
]);

export default router;
