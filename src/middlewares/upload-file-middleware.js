import multer from 'multer';
import path from 'path';

const mimeTypes = {
  image: /(jpeg|jpg|png|webp|heic|heif)/i,
  document: /(pdf|doc|docx|xls|xlsx|ppt|pptx|csv)/i,
  all: /.*/i,
};

export function uploadFile(type = 'image', { maxMb = 10, maxCount } = {}) {
  const fileFilter = (req, file, cb) => {
    const allowed = mimeTypes[type];
    if (!allowed) {
      const err = new Error(`Unsupported type: ${type}`);
      err.status = 400;
      return cb(err);
    }

    const extValid = allowed.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeValid = allowed.test(file.mimetype);

    if (extValid && mimeValid) return cb(null, true);

    const err = new Error(`Only ${type} files are allowed.`);
    err.status = 400;
    return cb(err, false);
  };

  const limits = { fileSize: maxMb * 1024 * 1024 };
  if (typeof maxCount === 'number') limits.files = maxCount;

  return multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits,
  });
}

// default export untuk kompatibilitas lama
export default (type) => uploadFile(type);
