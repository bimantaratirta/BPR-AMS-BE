import { successResponse } from "../../utils/response.js";
import NotificationService from "./notification-service.js";

class NotificationController {
  async list(req, res) {
    const result = await NotificationService.getAll({
      query: req.query,
      currentUser: req.user,
    });
    return successResponse(res, result.data, "Success", result.meta);
  }

  async markAsRead(req, res) {
    const { id } = req.params;
    const result = await NotificationService.markAsRead(id);
    return successResponse(res, result, "Notification marked as read");
  }

  async markAllAsRead(req, res) {
    const result = await NotificationService.markAllAsRead(req.user);
    return successResponse(res, result, "All notifications marked as read");
  }

  async unreadCount(req, res) {
    const result = await NotificationService.getUnreadCount(req.user);
    return successResponse(res, result, "Success");
  }
}

export default new NotificationController();
