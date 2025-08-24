import { successResponse } from '../../../utils/response.js';
import DashboardService from './dashboard-service.js';

class DashboardController {
  async getProductStats(req, res) {
    try {
      const data = await DashboardService.getProductStats();
      res.status(200).json({ code: 200, status: 'OK', data });
    } catch (error) {
      res.status(500).json({
        code: 500,
        status: 'Internal Server Error',
        message: error.message,
      });
    }
    return successResponse(res, data);
  }

  async getDailyProductsTraffic(req, res) {
    try {
      const data = await DashboardService.getDailyProductsTraffic();
      res.status(200).json({ code: 200, status: 'OK', data });
    } catch (error) {
      res.status(500).json({
        code: 500,
        status: 'Internal Server Error',
        message: error.message,
      });
    }
    return successResponse(res, data);
  }

  async getCountProducts(req, res) {
    try {
      const data = await DashboardService.getCountProducts();
      res.status(200).json({ code: 200, status: 'OK', data });
    } catch (error) {
      res.status(500).json({
        code: 500,
        status: 'Internal Server Error',
        message: error.message,
      });
    }
    return successResponse(res, data);
  }
}

export default new DashboardController();
