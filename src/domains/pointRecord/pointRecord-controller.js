import { successResponse } from "../../utils/response.js";
import PointrecordService from "./pointRecord-service.js";

class PointrecordController {
  async list(req, res) {
    const result = await PointrecordService.getAll({ query: req.query });
    return successResponse(res, result.data, "Success", result.meta);
  }

  async show(req, res) {
    const { id } = req.params;
    const result = await PointrecordService.getById(id);
    return successResponse(res, result.data, "Success");
  }

  async summary(req, res) {
    const { startDate, endDate, branchId, search, page, limit } = req.query;
    const result = await PointrecordService.getSummary({ startDate, endDate, branchId, search, page, limit });
    return successResponse(res, result.data, "Success", result.meta, {
      branches: result.branches,
      metrics: result.metrics,
    });
  }

  // async create() {
  //     throw new Error("Method not implemented");
  // }

  // async update() {
  //     throw new Error("Method not implemented");
  // }

  async delete(req, res) {
    const { id } = req.params;
    const result = await PointrecordService.delete(id);
    return successResponse(res, result, "Point record deleted successfully");
  }
}

export default new PointrecordController();
