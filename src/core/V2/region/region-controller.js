import { successResponse } from "../../../utils/response.js";
import RegionService from "./region-service.js";

class RegionController {
  async create(req, res) {
    const result = await RegionService.create(req.user, req.body);
    return successResponse(res, result);
  }

  async list(req, res) {
    const query = req.query;
    const result = await RegionService.list({ query });

    return successResponse(
      res,
      result.data,
      "region retrieved successfully",
      result.meta
    );
  }

  async detail(req, res) {
    const result = await RegionService.detail(req.params.id);
    return successResponse(res, result);
  }

  async update(req, res) {
    const result = await RegionService.update(
      req.user,
      req.params.id,
      req.body
    );
    return successResponse(res, result);
  }

  async remove(req, res) {
    const result = await RegionService.remove(req.params.id);
    return successResponse(res, result);
  }
}

export default new RegionController();
