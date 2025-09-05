import { successResponse } from "../../../utils/response.js";
import AuthService from "./auth-service.js";

class AuthController {
  async login(req, res) {
    const { username, password } = req.body;

    const token = await AuthService.login(username, password);

    if (!token) {
      throw Error("Failed to login");
    }

    return successResponse(res, { token });
  }

  async register(req, res) {
    const { username, password } = req.body;

    const message = await AuthService.register({ username, password });

    if (!message) {
      throw Error("Failed to register");
    }

    return successResponse(res, message);
  }

  async refreshToken(req, res) {
    const { refresh_token } = req.body;

    const token = await AuthService.refreshToken(refresh_token);

    if (!token) {
      throw Error("Failed to refresh token");
    }

    return successResponse(res, { access_token: token });
  }

  async getProfile(req, res) {
    const user = await AuthService.getProfile(req.user.id);

    if (!user) {
      throw Error("Failed to get user profile");
    }

    return successResponse(res, user);
  }
}

export default new AuthController();
