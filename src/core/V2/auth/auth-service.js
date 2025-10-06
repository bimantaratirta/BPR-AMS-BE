import BaseError from "../../../base_classes/base-error.js";

import joi from "joi";
import db from "../../../config/db.js";
import { parseJWT, generateToken } from "../../../utils/jwtTokenConfig.js";
import { matchPassword, hashPassword } from "../../../utils/passwordConfig.js";
import { PrismaService } from "../../../common/service/prisma.service.js";

import Role from "../../../common/enums/role.enum.js";

class AuthService {
  constructor() {
    this.prisma = new PrismaService();
  }

  async login(username, password) {
    let user = await db.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      throw BaseError.badRequest("Invalid credentials");
    }

    const isMatch = await matchPassword(password, user.password);

    if (!isMatch) {
      throw BaseError.badRequest("Invalid credentials");
    }

    const accessToken = generateToken(
      { id: user.id, role: user.role, type: "access" },
      "1d"
    );
    const refreshToken = generateToken(
      { id: user.id, role: user.role, type: "refresh" },
      "365d"
    );

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async register(data) {
    let validation = "";
    let stack = [];
    const fail = (message, path) => {
      validation += (validation ? " " : "") + message;
      stack.push({ message, path: [path] });
    };

    return this.prisma.$transaction(async (tx) => {
      // 1) Username unique check
      const usernameExist = await tx.user.findFirst({
        where: { username: data.username },
      });
      if (usernameExist) {
        fail("Username already taken.", "username");
        throw new joi.ValidationError(validation, stack);
      }

      // Role validation and custom checks based on role
      let supervisorId = data.supervisor_id;

      if (data.role === Role.AM) {
        // 2) For AM role: Only one AM per region
        const existingAM = await tx.user.findFirst({
          where: { role: Role.AM, region_id: data.region_id },
        });
        if (existingAM) {
          fail("Region has already been assigned to another AM", "region_id");
          throw new joi.ValidationError(validation, stack);
        }
        // No branch or supervisor required for AM role
        supervisorId = null;
      }

      if (data.role === Role.SLO) {
        // 3) For SLO role: Only one SLO per branch
        const existingSLO = await tx.user.findFirst({
          where: { role: Role.SLO, branch_id: data.branch_id },
        });
        if (existingSLO) {
          fail("Branch has already been assigned to another SLO", "branch_id");
          throw new joi.ValidationError(validation, stack);
        }

        // 4) Supervisor for SLO: Find supervisor (AM) from the region
        const regionId = await tx.branch.findUnique({
          where: {
            id: data.branch_id,
          },
        });

        const supervisor = await tx.user.findFirst({
          where: {
            role: Role.AM,
            region_id: regionId.region_id,
          },
        });
        if (!supervisor) {
          fail("No AM supervisor found for the given region", "supervisor_id");
          throw new joi.ValidationError(validation, stack);
        }
        supervisorId = supervisor.id;

        // No region needed for SLO role
        data.region_id = null;
      }

      if (data.role === Role.LO) {
        // 5) For LO role: Choose a branch and supervisor based on branch
        const branch = await tx.branch.findFirst({
          where: { id: data.branch_id },
        });
        if (!branch) {
          fail("Branch does not exist", "branch_id");
          throw new joi.ValidationError(validation, stack);
        }

        // 6) Get supervisor for LO based on the branch
        const supervisorForLO = await tx.user.findFirst({
          where: { role: Role.SLO, branch_id: data.branch_id },
        });
        if (!supervisorForLO) {
          fail("No SLO supervisor found for the given branch", "supervisor_id");
          throw new joi.ValidationError(validation, stack);
        }
        supervisorId = supervisorForLO.id;

        // No region needed for LO role
        data.region_id = null;
      }

      // 7) Create the user
      const hashedPassword = await hashPassword(data.password);
      const createdUser = await tx.user.create({
        data: {
          ...data,
          password: hashedPassword,
          supervisor_id: supervisorId,
        },
      });

      if (!createdUser) {
        throw Error("Failed to register");
      }

      return createdUser;
    });
  }

  async refreshToken(token) {
    const decoded = parseJWT(token);

    if (!decoded) {
      throw BaseError.unauthorized("Invalid token");
    }

    if (decoded.type !== "refresh") {
      throw BaseError.unauthorized("Invalid token type");
    }

    const user = await db.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      throw BaseError.notFound("User not found");
    }

    const accessToken = generateToken(
      { id: user.id, role: user.role, type: "access" },
      "1d"
    );

    return accessToken;
  }

  async getProfile(id) {
    const user = await db.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        region: {
          select: {
            id: true,
            region: true,
            // Add more fields from the region table as needed
          },
        },
        branch: {
          select: {
            id: true,
            branch: true,
            // Add more fields from the branch table as needed
          },
        },
        supervisor: {
          select: {
            id: true,
            name: true,
            // Add other fields you want from the supervisor
          },
        },
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      throw BaseError.notFound("User not found");
    }

    return user;
  }

  async updateProfile(id, data) {
    let validation = "";
    let stack = [];

    const fail = (message, path) => {
      validation += (validation ? " " : "") + message;
      stack.push({ message, path: [path] });
    };

    return this.prisma.$transaction(async (tx) => {
      // 1) Get current user to compare with the new username
      const currentUser = await tx.user.findUnique({
        where: { id: id },
      });

      if (!currentUser) {
        throw new Error("User not found");
      }

      // 2) Only check for username uniqueness if it's being updated
      if (data.username && data.username !== currentUser.username) {
        const usernameExist = await tx.user.findFirst({
          where: { username: data.username },
        });

        if (usernameExist) {
          fail("Username already taken.", "username");
          throw new joi.ValidationError(validation, stack);
        }
      }

      // 3) Only update fields provided in the data object
      const updatedData = {};
      if (data.name) updatedData.name = data.name;
      if (data.username) updatedData.username = data.username; // update username only if provided

      // 4) Perform the update in the database
      const updatedUser = await tx.user.update({
        where: { id: id },
        data: updatedData,
      });

      if (!updatedUser) {
        throw new Error("Failed to update profile");
      }

      return { message: "User profile updated successfully" };
    });
  }
}

export default new AuthService();
