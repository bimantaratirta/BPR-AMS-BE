import { createdResponse, successResponse } from "../../../utils/response.js";
import EvaluationService from "./evaluation-service.js";

class EvaluationController {
  async create(req, res) {
    const data = req.body;
    // await evaluationSchema.create.validateAsync(data);

    const result = await EvaluationService.create(data, req.user);
    return createdResponse(res, result, "Evaluation created successfully");
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
