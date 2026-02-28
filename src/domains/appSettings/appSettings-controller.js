import {
  createdResponse,
  successResponse,
  updatedResponse,
} from "../../utils/response.js";
import AppsettingsService from "./appSettings-service.js";

class AppsettingsController {
  list = async (req, res) => {
    const result = await AppsettingsService.getAll();
    return successResponse(res, result, "Success");
  };

  show = async (req, res) => {
    const { id } = req.params;
    const result = await AppsettingsService.getById(id);
    return successResponse(res, result, "Success");
  };

  create = async (req, res) => {
    const created = await AppsettingsService.create(
      req.user,
      req.files,
      req.body,
    );
    return createdResponse(res, created, "App settings created successfully");
  };

  update = async (req, res) => {
    const { id } = req.params;
    const updated = await AppsettingsService.update(
      req.user,
      id,
      req.files,
      req.body,
    );
    return updatedResponse(res, updated, "App settings updated successfully");
  };

  delete = async (req, res) => {
    const { id } = req.params;
    const deleted = await AppsettingsService.delete(id);
    return successResponse(res, deleted, "App settings deleted successfully");
  };
}

export default new AppsettingsController();
