import BaseError from '../base_classes/base-error.js';
import StatusCodes from '../errors/status-codes.js';
import { PrismaService } from '../common/service/prisma.service.js';
import logger from '../utils/logger.js';

export const errorHandler = (err, req, res, _next) => {
  const statusCode = Object.values(StatusCodes).find(
    (code) => code.message === err.statusCode
  );

  if (err.name === 'ValidationError') {
    const errorObj = {};

    for (const error of err.details) {
      errorObj[error.path] = [error.message];
    }

    if (err.source === 'query') {
      return res.status(StatusCodes.INVALID_PARAMS.code).json({
        code: StatusCodes.INVALID_PARAMS.code,
        status: StatusCodes.INVALID_PARAMS.codeName,
        message: StatusCodes.INVALID_PARAMS.message,
        pagination: null,
        data: null,
        errors: {
          name: err.name,
          message: err.message,
          validation: errorObj,
        },
      });
    }

    return res.status(StatusCodes.UNPROCESSABLE_ENTITY.code).json({
      code: StatusCodes.UNPROCESSABLE_ENTITY.code,
      status: StatusCodes.UNPROCESSABLE_ENTITY.codeName,
      message: StatusCodes.UNPROCESSABLE_ENTITY.message,
      pagination: null,
      data: null,
      errors: {
        name: err.name,
        message: err.message,
        validation: errorObj,
      },
    });
  }

  if (err.name === 'MulterError') {
    // console.log(err);
    return res.status(StatusCodes.BAD_REQUEST.code).json({
      code: StatusCodes.BAD_REQUEST.code,
      status: StatusCodes.BAD_REQUEST.codeName,
      message: StatusCodes.BAD_REQUEST.message,
      pagination: null,
      data: null,
      errors: {
        name: err.name,
        message: err.field,
        validation: null,
      },
    });
  }

  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] ?? 'field';
    const labels = { nik: 'NIK', email: 'Email', name: 'Nama' };
    const label = labels[field] ?? field;
    return res.status(409).json({
      code: 409,
      status: 'CONFLICT',
      message: `${label} sudah terdaftar.`,
      pagination: null,
      data: null,
      errors: {
        name: 'DuplicateError',
        message: `${label} sudah terdaftar.`,
        validation: { [field]: [`${label} sudah terdaftar.`] },
      },
    });
  }

  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      code: err.statusCode,
      status: err.errorCode,
      message: err.message,
      pagination: null,
      data: null,
      errors: {
        name: err.errorName,
        message: err.message,
        validation: null,
      },
    });
  }

  console.error('❌ Error:', err);

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR.code).json({
    code: StatusCodes.INTERNAL_SERVER_ERROR.code,
    status: StatusCodes.INTERNAL_SERVER_ERROR.codeName,
    message: StatusCodes.INTERNAL_SERVER_ERROR.message,
    pagination: null,
    data: null,
    errors: {
      name: err.name,
      message: err.message,
      validation: null,
    },
  });
};

export default errorHandler;
