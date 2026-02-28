// modules/report/report-controller.js
import { successResponse } from "../../../utils/response.js";
import ReportService from "./report-service.js";

class ReportController {
  async create(req, res) {
    const data = req.body;
    const files = req.files || [];
    // Validasi tambahan jika perlu
    // await reportSchema.create.validateAsync(data);

    const result = await ReportService.create(data, files);
    return successResponse(res, result, "Report retrieved successfully");
  }

  async list(req, res) {
    const currentUser = req.user; // scope by creator
    const query = req.query;
    const result = await ReportService.list({ currentUser, query });

    return successResponse(
      res,
      result.data,
      "customer retrieved successfully",
      result.meta
    );
  }

  async detail(req, res) {
    const result = await ReportService.detail(req.params.id);
    return successResponse(res, result, "report detail retrieved");
  }

  async remove(req, res) {
    const result = await ReportService.remove(req.params.id);
    return successResponse(res, null, "report deleted successfully");
  }
}

export default new ReportController();
