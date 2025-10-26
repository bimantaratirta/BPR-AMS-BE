import { successResponse } from "../../../utils/response.js";
import dashboardService from "./dashboard-service.js";

class DashboardController {
  async dashboardLo(req, res) {
    const currentUser = req.user; // scope by creator
    // const query = req.query;
    const result = await dashboardService.dashboardLo(currentUser);

    return successResponse(
      res,
      result,
      "customer retrieved successfully",
      null
    );
  }
  async dashboardSlo(req, res) {
    const currentUser = req.user; // scope by creator
    // const query = req.query;
    const result = await dashboardService.dashboardSlo(currentUser);

    return successResponse(
      res,
      result.data,
      "customer retrieved successfully",
      result.meta
    );
  }
  async dashboardAm(req, res) {
    const currentUser = req.user; // scope by creator
    // const query = req.query;
    const result = await dashboardService.dashboardAm(currentUser);

    return successResponse(
      res,
      result.data,
      "customer retrieved successfully",
      result.meta
    );
  }
}

export default new DashboardController();
