import { successResponse } from "../../utils/response.js";
import DashboardService from "./dashboard-service.js";

class DashboardController {
  async summary(req, res) {
    const result = await DashboardService.getSummary();
    return successResponse(res, result, "Success");
  }
}

export default new DashboardController();
