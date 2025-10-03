import BaseError from '../../../base_classes/base-error.js';

import { generateVerifEmail } from '../../../utils/bodyEmail.js';
import sendEmail from '../../../utils/sendEmail.js';
import joi from 'joi';
import db from '../../../config/db.js';
import { parseJWT, generateToken } from '../../../utils/jwtTokenConfig.js';
import { matchPassword, hashPassword } from '../../../utils/passwordConfig.js';

class AuthService {
  async login(username, password) {
    let user = await db.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      throw BaseError.badRequest('Invalid credentials');
    }

    const isMatch = await matchPassword(password, user.password);

    if (!isMatch) {
      throw BaseError.badRequest('Invalid credentials');
    }

    const accessToken = generateToken(
      { id: user.id, role: user.role, type: 'access' },
      '1d'
    );
    const refreshToken = generateToken(
      { id: user.id, role: user.role, type: 'refresh' },
      '365d'
    );

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async register(data) {
    const emailExist = await db.user.findUnique({
      where: {
        username: data.username,
      },
    });

    if (emailExist) {
      let validation = '';
      let stack = [];

      validation += 'Username already taken.';

      stack.push({
        message: 'Username already taken.',
        path: ['username'],
      });

      throw new joi.ValidationError(validation, stack);
    }

    const createdUser = await db.user.create({
      data: {
        username: data.username,
        password: await hashPassword(data.password),
        role: 'PIC',
      },
    });

    if (!createdUser) {
      throw Error('Failed to register');
    }

    const accessToken = generateToken(
      { id: createdUser.id, role: user.role, type: 'access' },
      '1d'
    );
    const refreshToken = generateToken(
      { id: createdUser.id, role: user.role, type: 'refresh' },
      '365d'
    );

    return {
      message: 'User register successfully',
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(token) {
    const decoded = parseJWT(token);

    if (!decoded) {
      throw BaseError.unauthorized('Invalid token');
    }

    if (decoded.type !== 'refresh') {
      throw BaseError.unauthorized('Invalid token type');
    }

    const user = await db.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      throw BaseError.notFound('User not found');
    }

    const accessToken = generateToken(
      { id: user.id, role: user.role, type: 'access' },
      '1d'
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
        username: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      throw BaseError.notFound('User not found');
    }

    return user;
  }
}

export default new AuthService();
