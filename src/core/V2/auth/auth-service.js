import BaseError from '../../../base_classes/base-error.js';

import joi from 'joi';
import db from '../../../config/db.js';
import { parseJWT, generateToken } from '../../../utils/jwtTokenConfig.js';
import { matchPassword, hashPassword } from '../../../utils/passwordConfig.js';
import { PrismaService } from '../../../common/service/prisma.service.js';

import Role from '../../../common/enums/role.enum.js';

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
      throw BaseError.badRequest('Invalid credentials');
    }

    const isMatch = await matchPassword(password, user.password);

    if (!isMatch) {
      throw BaseError.badRequest('Invalid credentials');
    }

    const accessToken = generateToken({ id: user.id, type: 'access' }, '1d');
    const refreshToken = generateToken(
      { id: user.id, type: 'refresh' },
      '365d'
    );

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async register(data) {
    let validation = '';
    let stack = [];
    const fail = (message, path) => {
      validation += (validation ? ' ' : '') + message;
      stack.push({ message, path: [path] });
    };

    return this.prisma.$transaction(async (tx) => {
      // 1) Username unique check
      const usernameExist = await tx.user.findFirst({
        where: { username: data.username },
      });
      if (usernameExist) {
        fail('Username already taken.', 'username');
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
          fail('Region has already been assigned to another AM', 'region_id');
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
          fail('Branch has already been assigned to another SLO', 'branch_id');
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
          fail('No AM supervisor found for the given region', 'supervisor_id');
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
          fail('Branch does not exist', 'branch_id');
          throw new joi.ValidationError(validation, stack);
        }

        // 6) Get supervisor for LO based on the branch
        const supervisorForLO = await tx.user.findFirst({
          where: { role: Role.SLO, branch_id: data.branch_id },
        });
        if (!supervisorForLO) {
          fail('No SLO supervisor found for the given branch', 'supervisor_id');
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
        throw Error('Failed to register');
      }

      return { message: 'User registered successfully' };
    });
  }

  // async registerLO(data) {
  //   let validation = '';
  //   let stack = [];
  //   const fail = (message, path) => {
  //     validation += (validation ? ' ' : '') + message;
  //     stack.push({ message, path: [path] });
  //   };

  //   return this.prisma.$transaction(async (tx) => {
  //     // 1) Username unik
  //     const usernameExist = await tx.user.findFirst({
  //       where: { username: data.username },
  //     });
  //     if (usernameExist) {
  //       fail('Username already taken.', 'username');
  //       throw new joi.ValidationError(validation, stack);
  //     }

  //     // 2) Region harus ada
  //     const regionExist = await tx.region.findUnique({
  //       where: { id: data.region_id },
  //     });
  //     if (!regionExist) {
  //       fail("Region doesn't exist", 'region_id');
  //       throw new joi.ValidationError(validation, stack);
  //     }

  //     // 3) Branch harus ada DAN memang milik region yang diberikan
  //     const branchInRegion = await tx.branch.findFirst({
  //       where: { id: data.branch_id, region_id: data.region_id },
  //     });
  //     if (!branchInRegion) {
  //       fail('Branch does not belong to the given region', 'branch_id');
  //       throw new joi.ValidationError(validation, stack);
  //     }

  //     // 4) Tentukan supervisor (SLO) di region & branch yang sama
  //     //    - Jika supervisor_id diberikan -> validasi.
  //     //    - Jika tidak -> auto-pilih SLO pertama (paling awal dibuat) di area tsb.
  //     let supervisorId = data.supervisor_id;

  //     if (supervisorId) {
  //       const supervisorValid = await tx.user.findFirst({
  //         where: {
  //           id: supervisorId,
  //           role: Role.SLO,
  //           region_id: data.region_id,
  //           branch_id: data.branch_id,
  //         },
  //       });
  //       if (!supervisorValid) {
  //         fail(
  //           'Supervisors are not included in the given area',
  //           'supervisor_id'
  //         );
  //         throw new joi.ValidationError(validation, stack);
  //       }
  //     } else {
  //       const pickSLO = await tx.user.findFirst({
  //         where: {
  //           role: Role.SLO,
  //           region_id: data.region_id,
  //           branch_id: data.branch_id,
  //         },
  //         orderBy: { created_at: 'asc' }, // pilih yang paling awal ada
  //         select: { id: true },
  //       });
  //       if (!pickSLO) {
  //         fail(
  //           'No SLO supervisor found for the given region and branch',
  //           'supervisor_id'
  //         );
  //         throw new joi.ValidationError(validation, stack);
  //       }
  //       supervisorId = pickSLO.id;
  //     }

  //     // 5) Create user
  //     const hashedPassword = await hashPassword(data.password);
  //     const createdUser = await tx.user.create({
  //       data: {
  //         ...data,
  //         password: hashedPassword,
  //         supervisor_id: supervisorId,
  //       },
  //     });

  //     if (!createdUser) throw Error('Failed to register');

  //     return { message: 'User register successfully' };
  //   });
  // }

  // async registerSLO(data) {
  //   let validation = '';
  //   let stack = [];
  //   const fail = (message, path) => {
  //     validation += (validation ? ' ' : '') + message;
  //     stack.push({ message, path: [path] });
  //   };

  //   return this.prisma.$transaction(async (tx) => {
  //     // 1) Username unik
  //     const usernameExist = await tx.user.findFirst({
  //       where: { username: data.username },
  //     });
  //     if (usernameExist) {
  //       fail('Username already taken.', 'username');
  //       throw new joi.ValidationError(validation, stack);
  //     }

  //     // 2) Region harus ada
  //     const regionExist = await tx.region.findUnique({
  //       where: { id: data.region_id },
  //     });
  //     if (!regionExist) {
  //       fail("Region doesn't exist", 'region_id');
  //       throw new joi.ValidationError(validation, stack);
  //     }

  //     // 3) Branch harus ada & milik region
  //     const branchInRegion = await tx.branch.findFirst({
  //       where: { id: data.branch_id, region_id: data.region_id },
  //     });
  //     if (!branchInRegion) {
  //       fail('Branch does not belong to the given region', 'branch_id');
  //       throw new joi.ValidationError(validation, stack);
  //     }

  //     // 4) Supervisor = AM pada region yang sama
  //     let supervisorId = data.supervisor_id;

  //     if (supervisorId) {
  //       const supervisorValid = await tx.user.findFirst({
  //         where: {
  //           id: supervisorId,
  //           role: Role.AM,
  //           region_id: data.region_id,
  //           // branch tidak wajib untuk AM
  //         },
  //       });
  //       if (!supervisorValid) {
  //         fail(
  //           'Supervisors do not fall within the given area',
  //           'supervisor_id'
  //         );
  //         throw new joi.ValidationError(validation, stack);
  //       }
  //     } else {
  //       const pickAM = await tx.user.findFirst({
  //         where: {
  //           role: Role.AM,
  //           region_id: data.region_id,
  //         },
  //         orderBy: { created_at: 'asc' },
  //         select: { id: true },
  //       });
  //       if (!pickAM) {
  //         fail('No AM supervisor found for the given region', 'supervisor_id');
  //         throw new joi.ValidationError(validation, stack);
  //       }
  //       supervisorId = pickAM.id;
  //     }

  //     // 5) Pastikan belum ada SLO di branch tsb
  //     const isAssignUserBranch = await tx.user.findFirst({
  //       where: { role: Role.SLO, branch_id: data.branch_id },
  //     });
  //     if (isAssignUserBranch) {
  //       throw BaseError.badRequest(
  //         'Branch has already been assigned to another SLO'
  //       );
  //     }

  //     // 6) Create user
  //     const hashedPassword = await hashPassword(data.password);
  //     const createdUser = await tx.user.create({
  //       data: {
  //         ...data,
  //         password: hashedPassword,
  //         supervisor_id: supervisorId,
  //       },
  //     });

  //     if (!createdUser) throw Error('Failed to register');

  //     return { message: 'User register successfully' };
  //   });
  // }

  // async registerAM(data) {
  //   let validation = '';
  //   let stack = [];
  //   const fail = (message, path) => {
  //     validation += (validation ? ' ' : '') + message;
  //     stack.push({ message, path: [path] });
  //   };

  //   return this.prisma.$transaction(async (tx) => {
  //     // 1) Username unik
  //     const usernameExist = await tx.user.findFirst({
  //       where: {
  //         username: data.username,
  //       },
  //     });
  //     if (usernameExist) {
  //       fail('Username already taken.', 'username');
  //       throw new joi.ValidationError(validation, stack);
  //     }

  //     // 2) Region harus ada
  //     const regionExist = await tx.region.findUnique({
  //       where: { id: data.region_id },
  //     });
  //     if (!regionExist) {
  //       fail("Region doesn't exist", 'region_id');
  //       throw new joi.ValidationError(validation, stack);
  //     }

  //     // 3) Pastikan belum ada AM yang assigned di region tsb
  //     const isAssignUserRegion = await tx.user.findFirst({
  //       where: {
  //         role: Role.AM,
  //         region_id: data.region_id,
  //       },
  //     });
  //     if (isAssignUserRegion) {
  //       throw BaseError.badRequest(
  //         'Region has already been assigned to another AM'
  //       );
  //     }

  //     // 4) Create user
  //     const hashedPassword = await hashPassword(data.password);
  //     const createdUser = await tx.user.create({
  //       data: {
  //         ...data,
  //         password: hashedPassword,
  //       },
  //     });

  //     if (!createdUser) {
  //       throw Error('Failed to register');
  //     }

  //     return { message: 'User register successfully' };
  //   });
  // }

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

    const accessToken = generateToken({ id: user.id, type: 'access' }, '1d');

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
