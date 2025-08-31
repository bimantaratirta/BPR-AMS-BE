import { createdResponse, successResponse } from '../../../utils/response.js';
import reviewCustomerService from './review-customer-service.js';

class ReviewCustomerController {
  async create(req, res) {
    const result = await reviewCustomerService.create({
      ...req.body,
      report_id: req.params.reportId,
    });
    return createdResponse(res, result, 'review customer created successfully');
  }

  async list(req, res) {
    const result = await reviewCustomerService.list();
    return successResponse(
      res,
      result,
      'review customers retrieved successfully'
    );
  }
}

export default new ReviewCustomerController();
