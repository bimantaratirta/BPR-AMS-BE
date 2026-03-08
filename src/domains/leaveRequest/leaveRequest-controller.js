import LeaveRequestService from "./leaveRequest-service.js";
import {
  successResponse,
  createdResponse,
  updatedResponse,
} from "../../utils/response.js";

class LeaveRequestController {
  list = async (req, res) => {
    const result = await LeaveRequestService.getAll({ query: req.query });
    return successResponse(res, result.data, "Success", result.meta, {
      counts: result.counts,
    });
  };

  show = async (req, res) => {
    const { id } = req.params;
    const result = await LeaveRequestService.getById(id);
    return successResponse(res, result.data, "Success");
  };

  create = async (req, res) => {
    const created = await LeaveRequestService.create(
      req.user,
      req.files,
      req.body,
    );
    return createdResponse(res, created, "Leave request created successfully");
  };

  update = async (req, res) => {
    const { id } = req.params;
    const updated = await LeaveRequestService.update(id, req.user, req.body);
    return updatedResponse(res, updated, "Leave request updated successfully");
  };

  delete = async (req, res) => {
    const { id } = req.params;
    const deleted = await LeaveRequestService.delete(id);
    return successResponse(res, deleted, "Leave request deleted successfully");
  };
}

export default new LeaveRequestController();
