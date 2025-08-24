// import statusCodes from '../errors/status-codes.js';
// import BaseError from '../base_classes/base-error.js';
// import jwt from 'jsonwebtoken';

// const authToken = (req, res, next) => {
//    const authHeader = req.get('Authorization');

//    const token = authHeader && authHeader.split(' ')[1];

//    if (token == null)
//         throw new BaseError(
//             401,
//             statusCodes.UNAUTHORIZED.message,
//             'UNAUTHORIZED',
//             'User Have Not Login',
//         );

//    jwt.verify(
//         token,
//         process.env.JWT_SECRET || '',
//         (err, data) => {
//             if (err) {
//                 console.log(err.message)
//                 if (err.message == 'invalid signature') {
//                     throw new BaseError(
//                         403,
//                         statusCodes.FORBIDDEN.message,
//                         'FORBIDDEN',
//                         'Invalid Signature',
//                     );
//                 } else if (err.message == 'invalid token') {
//                     throw new BaseError(
//                         403,
//                         statusCodes.FORBIDDEN.message,
//                         'FORBIDDEN',
//                         'Invalid Token',
//                     );
//                 } else if (err.message == 'jwt expired') {
//                     throw new BaseError(
//                         403,
//                         statusCodes.FORBIDDEN.message,
//                         'FORBIDDEN',
//                         "Token Expired"
//                     );
//                 } else {
//                     throw new BaseError(
//                         403,
//                         statusCodes.FORBIDDEN.message,
//                         'FORBIDDEN',
//                         'Token Is Invalid Or No Longer Valid',
//                     );
//                 }
//             }

//             if (data.type !== 'access') {
//                 throw new BaseError(
//                     403,
//                     statusCodes.FORBIDDEN.message,
//                     'FORBIDDEN',
//                     'Token Is Not An Access Token',
//                 );
//             }

//             req.app.locals.user = data.id;

//             return next();
//         },
//     );
// };

// export default authToken;

// middlewares/auth-middleware.js
import statusCodes from '../errors/status-codes.js';
import BaseError from '../base_classes/base-error.js';
import jwt from 'jsonwebtoken';
import { PrismaService } from '../common/service/prisma.service.js';
import logger from '../utils/logger.js';

class AuthMiddleware {
  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || '';
    this.prisma = new PrismaService();
  }

  authenticate = async (req, res, next) => {
    const authHeader = req.get('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    console.info();

    if (!token) {
      return next(BaseError.unauthorized('No Token Provided'));
    }

    try {
      const decoded = jwt.verify(token, this.JWT_SECRET);

      if (
        !decoded ||
        !decoded.id ||
        !decoded.type ||
        decoded.type !== 'access'
      ) {
        logger.debug('Decoded Token: ' + decoded);
        return next(BaseError.unauthorized('Invalid Token'));
      }

      const user = await this.prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
      });

      delete user.password;

      if (!user) {
        return next(
          new BaseError.unauthorized(
            'Token Valid, But User Not Found in Database'
          )
        );
      }

      req.user = user;

      next();
    } catch (err) {
      let message = 'Token Is Invalid Or No Longer Valid';
      if (err.message === 'invalid signature') message = 'Invalid Signature';
      if (err.message === 'invalid token') message = 'Invalid Token';
      if (err.message === 'jwt expired') message = 'Token Expired';

      return next(BaseError.unauthorized(message));
    }
  };
}

export default new AuthMiddleware();
