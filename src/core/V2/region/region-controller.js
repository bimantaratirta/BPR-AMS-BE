import { successResponse } from '../../../utils/response.js';
import RegionService from './region-service.js';

class RegionController {
  async create(req, res) {
    const result = await RegionService.create(req.body);
    return successResponse(res, result);
  }

  async list(req, res) {
    const { q, page, per_page, order_by, order } = req.query;
    const result = await RegionService.list({
      q,
      page,
      per_page,
      order_by,
      order,
    });
    return successResponse(res, result);
  }

  async detail(req, res) {
    const result = await RegionService.detail(req.params.id);
    return successResponse(res, result);
  }

  async update(req, res) {
    const result = await RegionService.update(req.params.id, req.body);
    return successResponse(res, result);
  }

  async remove(req, res) {
    const result = await RegionService.remove(req.params.id);
    return successResponse(res, result);
  }
}

export default new RegionController();
