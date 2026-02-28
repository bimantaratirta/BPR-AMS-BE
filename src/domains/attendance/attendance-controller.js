import { createdResponse, successResponse } from "../../utils/response.js";
import AttendanceService from "./attendance-service.js";

class AttendanceController {
  list = async (req, res) => {
    const result = await AttendanceService.getAll({ query: req.query });
    return successResponse(res, result.data, "Success", result.meta);
  };

  async show() {
    throw new Error("Method not implemented");
  }

  async checkIn(req, res) {
    const checkIn = await AttendanceService.checkIn(
      req.user,
      req.files,
      req.body,
    );
    return createdResponse(res, checkIn, "Attendance checked in successfully");
  }

  async checkOut(req, res) {
    const checkOut = await AttendanceService.checkOut(req.user, req.body);
    return successResponse(
      res,
      checkOut,
      "Attendance checked out successfully",
    );
  }

  async update() {
    throw new Error("Method not implemented");
  }

  async delete(req, res) {
    const { id } = req.params;
    const result = await AttendanceService.delete(id);
    return successResponse(
      res,
      result,
      "Attendance record deleted successfully",
    );
  }
}

export default new AttendanceController();
