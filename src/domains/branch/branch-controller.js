import BranchService from "./branch-service.js";
import {
  successResponse,
  createdResponse,
  updatedResponse,
} from "../../utils/response.js";

class BranchController {
  list = async (req, res) => {
    const result = await BranchService.getAll({ query: req.query });
    return successResponse(res, result.data, "Success", result.meta);
  };

  show = async (req, res) => {
    const { id } = req.params;
    const result = await BranchService.getById(id);
    return successResponse(res, result.data, "Success");
  };

  create = async (req, res) => {
    const created = await BranchService.create(req.user, req.body);
    return createdResponse(res, created, "Branch created successfully");
  };

  update = async (req, res) => {
    const { id } = req.params;
    const updated = await BranchService.update(id, req.body);
    return updatedResponse(res, updated, "Branch updated successfully");
  };

  delete = async (req, res) => {
    const { id } = req.params;
    const deleted = await BranchService.delete(id);
    return successResponse(res, deleted, "Branch deleted successfully");
  };
}

export default new BranchController();
