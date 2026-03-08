import BaseRoutes from "../../base_classes/base-routes.js";
import NotificationController from "./notification-controller.js";
import tryCatch from "../../utils/tryCatcher.js";
import AuthMiddleware from "../../middlewares/auth-token-middleware.js";

class NotificationRoutes extends BaseRoutes {
  routes() {
    this.router.get("/", [
      AuthMiddleware.authenticate,
      tryCatch(NotificationController.list),
    ]);
    this.router.get("/unread-count", [
      AuthMiddleware.authenticate,
      tryCatch(NotificationController.unreadCount),
    ]);
    this.router.put("/read-all", [
      AuthMiddleware.authenticate,
      tryCatch(NotificationController.markAllAsRead),
    ]);
    this.router.put("/:id/read", [
      AuthMiddleware.authenticate,
      tryCatch(NotificationController.markAsRead),
    ]);
  }
}

export default new NotificationRoutes().router;
