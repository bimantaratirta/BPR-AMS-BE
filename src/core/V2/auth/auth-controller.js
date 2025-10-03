import { createdResponse, successResponse } from '../../../utils/response.js';
import AuthService from './auth-service.js';

class AuthController {
  async login(req, res) {
    const { username, password } = req.body;

    const token = await AuthService.login(username, password);

    if (!token) {
      throw Error('Failed to login');
    }

    return successResponse(res, { token });
  }
  async register(req, res) {
    const {
      name,
      region_id,
      branch_id,
      supervisor_id,
      username,
      password,
      role,
    } = req.body;

    const message = await AuthService.register({
      name,
      region_id,
      branch_id,
      supervisor_id,
      username,
      password,
      role,
    });

    if (!message) {
      throw Error('Failed to register');
    }

    return createdResponse(res, message);
  }

  // async registerLO(req, res) {
  //   const {
  //     name,
  //     region_id,
  //     branch_id,
  //     supervisor_id,
  //     username,
  //     password,
  //     role,
  //   } = req.body;

  //   const message = await AuthService.registerLO({
  //     name,
  //     region_id,
  //     branch_id,
  //     supervisor_id,
  //     username,
  //     password,
  //     role,
  //   });

  //   if (!message) {
  //     throw Error('Failed to register');
  //   }

  //   return successResponse(res, message);
  // }

  // async registerSLO(req, res) {
  //   const {
  //     name,
  //     region_id,
  //     branch_id,
  //     supervisor_id,
  //     username,
  //     password,
  //     role,
  //   } = req.body;

  //   const message = await AuthService.registerSLO({
  //     name,
  //     region_id,
  //     branch_id,
  //     supervisor_id,
  //     username,
  //     password,
  //     role,
  //   });

  //   if (!message) {
  //     throw Error('Failed to register');
  //   }

  //   return successResponse(res, message);
  // }

  // async registerAM(req, res) {
  //   const { name, region_id, username, password, role } = req.body;

  //   const message = await AuthService.registerAM({
  //     name,
  //     region_id,
  //     username,
  //     password,
  //     role,
  //   });

  //   if (!message) {
  //     throw Error('Failed to register');
  //   }

  //   return successResponse(res, message);
  // }

  async refreshToken(req, res) {
    const { refresh_token } = req.body;

    const token = await AuthService.refreshToken(refresh_token);

    if (!token) {
      throw Error('Failed to refresh token');
    }

    return createdResponse(res, { access_token: token });
  }

  async getProfile(req, res) {
    const user = await AuthService.getProfile(req.user.id);

    if (!user) {
      throw Error('Failed to get user profile');
    }

    return createdResponse(res, user);
  }

  async updateProfile(req, res) {
    const { id } = req.user; // Assuming the user info is in req.user after authentication
    const data = req.body;

    try {
      // Validate the incoming data using the updateProfileSchema
      // await updateProfileSchema.validateAsync(data);

      // Call the AuthService to update the profile
      const updatedUser = await AuthService.updateProfile(id, data);

      return successResponse(res, updatedUser);
    } catch (error) {
      // Handle validation or other errors
      return errorResponse(
        res,
        error.message || 'An error occurred while updating the profile.'
      );
    }
  }
}

export default new AuthController();
