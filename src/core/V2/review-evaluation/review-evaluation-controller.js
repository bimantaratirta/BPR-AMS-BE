import {
  createdResponse,
  successResponse,
  updatedResponse,
} from "../../../utils/response.js";
import reviewEvaluationService from "./review-evaluation-service.js";

class ReviewEvaluationController {
  async create(req, res) {
    const result = await reviewEvaluationService.create(req.body, req.user);
    return createdResponse(
      res,
      result,
      "review evaluation created successfully"
    );
  }

  async update(req, res) {
    const result = await reviewEvaluationService.update(
      req.params.id,
      req.body,
      req.user
    );
    return updatedResponse(res, result);
  }

  async list(req, res) {
    const result = await reviewEvaluationService.list();
    return successResponse(
      res,
      result,
      "review evaluations retrieved successfully"
    );
  }
}
export default new ReviewEvaluationController();
