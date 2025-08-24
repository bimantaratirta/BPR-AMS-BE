import { successResponse } from '../../../utils/response.js';
import BranchService from './branch-service.js';

class BranchController {
  async create(req, res) {
    const result = await BranchService.create(req.body);
    return successResponse(res, result);
  }

  async list(req, res) {
    const { q, page, per_page, order_by, order } = req.query;
    const result = await BranchService.list({
      q,
      page,
      per_page,
      order_by,
      order,
    });
    return successResponse(res, result);
  }

  async detail(req, res) {
    const result = await BranchService.detail(req.params.id);
    return successResponse(res, result);
  }

  async update(req, res) {
    const result = await BranchService.update(req.params.id, req.body);
    return successResponse(res, result);
  }

  async remove(req, res) {
    const result = await BranchService.remove(req.params.id);
    return successResponse(res, result);
  }
}

export default new BranchController();
