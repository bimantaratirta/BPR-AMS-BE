import { successResponse } from "../../../utils/response.js";
import userService from "./user-service.js";

class UserController {
  async List(req, res) {
    const result = await userService.List();
    return successResponse(res, result);
  }

  async ListLoBySlo(req, res) {
    const query = req.query;
    const result = await userService.ListLoBySlo(req.params.id, { query });
    return successResponse(
      res,
      result.data,
      "User retrieved successfully",
      result.meta
    );
  }

  async ListSloByAm(req, res) {
    const query = req.query;
    const result = await userService.ListSloByAm(req.params.id, { query });
    return successResponse(
      res,
      result.data,
      "User retrieved successfully",
      result.meta
    );
  }
}

export default new UserController();
