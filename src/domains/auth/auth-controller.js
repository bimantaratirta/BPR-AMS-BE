import { createdResponse, successResponse } from "../../utils/response.js";
import authService from "./auth-service.js";

class AuthController {
  async LoginAdmin(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.loginAdmin(email, password);
      return successResponse(res, result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async RegisterAdmin(req, res) {
    try {
      const result = await authService.registerAdmin(req.body);
      return createdResponse(res, result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async RefreshTokenAdmin(req, res) {
    try {
      const { refresh_token } = req.body;
      const result = await authService.refreshTokenAdmin(refresh_token);
      return successResponse(res, result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async LoginEmployee(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.loginEmployee(email, password);
      return successResponse(res, result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async RegisterEmployee(req, res) {
    try {
      const result = await authService.registerEmployee(req.body);
      return createdResponse(res, result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async RefreshTokenEmployee(req, res) {
    try {
      const { refresh_token } = req.body;
      const result = await authService.refreshTokenEmployee(refresh_token);
      return successResponse(res, result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new AuthController();
