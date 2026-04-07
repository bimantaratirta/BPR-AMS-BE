import Joi from "joi";
import BaseError from "../../base_classes/base-error.js";
import { PrismaService } from "../../common/service/prisma.service.js";
import { hashPassword, matchPassword } from "../../utils/passwordConfig.js";
import { generateToken, parseJWT } from "../../utils/jwtTokenConfig.js";

class AuthService {
  constructor() {
    this.prisma = new PrismaService();
  }
  async loginAdmin(email, password) {
    let admin = await this.prisma.admin.findUnique({
      where: {
        email: email,
      },
    });

    if (!admin) {
      throw BaseError.badRequest("Invalid credentials");
    }

    const isMatch = await matchPassword(password, admin.password);

    if (!isMatch) {
      throw BaseError.badRequest("Invalid credentials");
    }

    console.log(admin.role);

    const accessToken = generateToken(
      { id: admin.id, role: admin.role, type: "access", userType: admin.role },
      "365d",
    );
    const refreshToken = generateToken(
      { id: admin.id, role: admin.role, type: "refresh", userType: admin.role },
      "365d",
    );

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async registerAdmin(data) {
    let validation = "";
    let stack = [];
    const fail = (message, path) => {
      validation += (validation ? " " : "") + message;
      stack.push({ message, path: [path] });
    };

    return this.prisma.$transaction(async (tx) => {
      // 1) email unique check
      const emailExist = await tx.admin.findFirst({
        where: { email: data.email },
      });
      if (emailExist) {
        fail("Email already taken.", "email");
        throw new Joi.ValidationError(validation, stack);
      }

      // 2) create admin
      const createdAdmin = await tx.admin.create({
        data: {
          name: data.name,
          email: data.email,
          password: await hashPassword(data.password),
          role: data.role,
          status: data.status,
        },
      });

      return createdAdmin;
    });
  }

  async refreshTokenAdmin(token) {
    try {
      const decoded = parseJWT(token);
      if (decoded.type !== "refresh") {
        throw BaseError.badRequest("Invalid token type");
      }

      const admin = await this.prisma.admin.findUnique({
        where: { id: decoded.id },
      });

      if (!admin) {
        throw BaseError.badRequest("Admin not found");
      }

      const accessToken = generateToken(
        {
          id: admin.id,
          role: admin.role,
          type: "access",
          userType: admin.role,
        },
        "365d",
      );
      const refreshToken = generateToken(
        {
          id: admin.id,
          role: admin.role,
          type: "refresh",
          userType: admin.role,
        },
        "365d",
      );

      return { access_token: accessToken, refresh_token: refreshToken };
    } catch (error) {
      throw BaseError.badRequest("Invalid token");
    }
  }

  async loginEmployee(email, password) {
    let employee = await this.prisma.employee.findUnique({
      where: {
        email: email,
      },
    });

    if (!employee) {
      throw BaseError.badRequest("Invalid credentials");
    }

    const isMatch = await matchPassword(password, employee.password);

    if (!isMatch) {
      throw BaseError.badRequest("Invalid credentials");
    }

    const accessToken = generateToken(
      {
        id: employee.id,
        role: employee.role,
        type: "access",
        userType: "EMPLOYEE",
      },
      "365d",
    );
    const refreshToken = generateToken(
      {
        id: employee.id,
        role: employee.role,
        type: "refresh",
        userType: "EMPLOYEE",
      },
      "365d",
    );

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async registerEmployee(data) {
    let validation = "";
    let stack = [];
    const fail = (message, path) => {
      validation += (validation ? " " : "") + message;
      stack.push({ message, path: [path] });
    };

    return this.prisma.$transaction(async (tx) => {
      // 1) email unique check
      const emailExist = await tx.employee.findFirst({
        where: { email: data.email },
      });
      if (emailExist) {
        fail("Email already taken.", "email");
        throw new Joi.ValidationError(validation, stack);
      }

      // 2) create employee
      const createdEmployee = await tx.employee.create({
        data: {
          nik: data.nik,
          name: data.name,
          email: data.email,
          password: await hashPassword(data.password),
          role: data.role,
          branchId: data.branchId,
          isActive: data.isActive,
        },
      });

      return createdEmployee;
    });
  }

  async refreshEmployeeToken(token) {
    try {
      const decoded = parseJWT(token);
      if (decoded.type !== "refresh") {
        throw BaseError.badRequest("Invalid token type");
      }

      const employee = await this.prisma.employee.findUnique({
        where: { id: decoded.id },
      });

      if (!employee) {
        throw BaseError.badRequest("Employee not found");
      }

      const accessToken = generateToken(
        {
          id: employee.id,
          role: employee.role,
          type: "access",
          userType: "EMPLOYEE",
        },
        "365d",
      );
      const refreshToken = generateToken(
        {
          id: employee.id,
          role: employee.role,
          type: "refresh",
          userType: "EMPLOYEE",
        },
        "365d",
      );

      return { access_token: accessToken, refresh_token: refreshToken };
    } catch (error) {
      throw BaseError.badRequest("Invalid token");
    }
  }
}

export default new AuthService();
