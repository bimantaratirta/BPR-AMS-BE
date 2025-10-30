import {
  createdResponse,
  successResponse,
  updatedResponse,
} from "../../../utils/response.js";
import reviewCustomerService from "./review-customer-service.js";

class ReviewCustomerController {
  async create(req, res) {
    const result = await reviewCustomerService.create(req.body, req.user);
    return createdResponse(res, result, "review customer created successfully");
  }

  async update(req, res) {
    const result = await reviewCustomerService.update(
      req.params.id,
      req.body,
      req.user
    );
    return updatedResponse(res, result);
  }

  async list(req, res) {
    const result = await reviewCustomerService.list();
    return successResponse(
      res,
      result,
      "review customers retrieved successfully"
    );
  }
}

export default new ReviewCustomerController();
