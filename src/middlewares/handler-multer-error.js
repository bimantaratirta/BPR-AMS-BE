import multer from 'multer';

export function handleMulterError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    // LIMIT_FILE_SIZE, LIMIT_FILE_COUNT, dll.
    const code = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    return res.status(code).json({
      code,
      status: code === 413 ? 'PAYLOAD_TOO_LARGE' : 'BAD_REQUEST',
      message:
        err.code === 'LIMIT_FILE_SIZE'
          ? 'File too large'
          : err.message || 'Upload error',
      details: { field: err.field, code: err.code },
    });
  }
  if (err && err.status) {
    return res.status(err.status).json({
      code: err.status,
      status: 'BAD_REQUEST',
      message: err.message,
    });
  }
  return next(err);
}
