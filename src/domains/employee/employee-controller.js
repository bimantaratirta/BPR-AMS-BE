import { successResponse } from "../../utils/response.js";
import EmployeeService from "./employee-service.js";

class EmployeeController {
  async list(req, res) {
    const result = await EmployeeService.getAll({ query: req.query });
    return successResponse(res, result.data, "Success", result.meta);
  }

  async show(req, res) {
    const { id } = req.params;
    const result = await EmployeeService.getById(id);
    return successResponse(res, result, "Success");
  }

  async create(req, res) {
    const created = await EmployeeService.create(req.body);
    return successResponse(res, created, "Employee created successfully");
  }

  async update(req, res) {
    const { id } = req.params;
    const files = req.files || [];
    const updated = await EmployeeService.update(id, files, req.body);
    return successResponse(res, updated, "Employee updated successfully");
  }

  async delete(req, res) {
    const { id } = req.params;
    const deleted = await EmployeeService.delete(id);
    return successResponse(res, deleted, "Employee deleted successfully");
  }
}

export default new EmployeeController();
