import { successResponse } from "../../utils/response.js";
import AdminService from "./admin-service.js";

class AdminController {
  async list(req, res) {
    const result = await AdminService.getAll({ query: req.query });
    return successResponse(res, result.data, "Success", result.meta);
  }

  async show(req, res) {
    const { id } = req.params;
    const result = await AdminService.getById(id);
    return successResponse(res, result, "Success");
  }

  async create(req, res) {
    const created = await AdminService.create(req.body);
    return successResponse(res, created, "Admin created successfully");
  }

  async update(req, res) {
    const { id } = req.params;
    const updated = await AdminService.update(id, req.body);
    return successResponse(res, updated, "Admin updated successfully");
  }

  async delete(req, res) {
    const { id } = req.params;
    const deleted = await AdminService.delete(id);
    return successResponse(res, deleted, "Admin deleted successfully");
  }
}

export default new AdminController();
