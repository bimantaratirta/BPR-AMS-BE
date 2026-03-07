import { createdResponse, successResponse } from "../../utils/response.js";
import AttendanceService from "./attendance-service.js";

class AttendanceController {
  list = async (req, res) => {
    const result = await AttendanceService.getAll({ query: req.query });
    return successResponse(res, result.data, "Success", result.meta);
  };

  async show(req, res) {
    const { id } = req.params;
    const result = await AttendanceService.getById(id);
    return successResponse(res, result, "Success");
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

  async exportXlsx(req, res) {
    const { startDate, endDate, branchId } = req.query;
    const buffer = await AttendanceService.exportXlsx({ startDate, endDate, branchId });
    res.set({
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="laporan-absensi-${startDate || "all"}_${endDate || "all"}.xlsx"`,
    });
    res.send(Buffer.from(buffer));
  }

  async update(req, res) {
    const { id } = req.params;
    const updated = await AttendanceService.update(id, req.body);
    return successResponse(res, updated, "Attendance updated successfully");
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
