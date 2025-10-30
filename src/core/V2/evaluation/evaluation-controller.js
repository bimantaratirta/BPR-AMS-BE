import {
  createdResponse,
  successResponse,
  updatedResponse,
} from "../../../utils/response.js";
import EvaluationService from "./evaluation-service.js";

class EvaluationController {
  async create(req, res) {
    const data = req.body;
    // await evaluationSchema.create.validateAsync(data);

    const result = await EvaluationService.create(data, req.user);
    return createdResponse(res, result, "Evaluation created successfully");
  }

  async update(req, res) {
    const result = await EvaluationService.update(
      req.params.id,
      req.body,
      req.user
    );
    return updatedResponse(res, result);
  }

  async list(req, res) {
    const result = await EvaluationService.list();
    return successResponse(
      res,
      result,
      "Evaluation list retrieved successfully"
    );
  }
}

export default new EvaluationController();
