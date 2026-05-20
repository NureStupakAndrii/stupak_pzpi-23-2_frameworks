const path = require("path");
const multer = require("multer");

const { HttpError } = require("../errors/http.error");
const { UPLOADS_DIR } = require("../config/storage-paths");

const ALLOWED_MIME_TYPES = ["video/mp4", "video/webm", "video/ogg"];
const ALLOWED_EXTENSIONS = [".mp4", ".webm", ".ogg"];
const MAX_FILE_SIZE = 500 * 1024 * 1024;

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, UPLOADS_DIR);
  },
  filename(req, file, callback) {
    const extension = path.extname(file.originalname).toLowerCase();
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

    callback(null, filename);
  },
});

function filterVideoFile(req, file, callback) {
  const extension = path.extname(file.originalname).toLowerCase();
  const isAllowedMimeType = ALLOWED_MIME_TYPES.includes(file.mimetype);
  const isAllowedExtension = ALLOWED_EXTENSIONS.includes(extension);

  if (!isAllowedMimeType || !isAllowedExtension) {
    callback(new HttpError(400, "Only video files are allowed"));
    return;
  }

  callback(null, true);
}

const uploadVideoMiddleware = multer({
  storage,
  fileFilter: filterVideoFile,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
}).single("video");

module.exports = {
  uploadVideoMiddleware,
};
