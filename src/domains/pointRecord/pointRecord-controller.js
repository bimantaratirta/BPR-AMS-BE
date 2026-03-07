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
    const { startDate, endDate, branchId } = req.query;
    const result = await PointrecordService.getSummary({ startDate, endDate, branchId });
    return successResponse(res, result, "Success");
  }

  // async create() {
  //     throw new Error("Method not implemented");
  // }

  // async update() {
  //     throw new Error("Method not implemented");
  // }

  // async delete() {
  //     throw new Error("Method not implemented");
  // }
}

export default new PointrecordController();
