const path = require("path");

const API_DIR = path.join(__dirname, "..");
const UPLOADS_DIR = path.join(API_DIR, "uploads");
const THUMBNAIL_DIR = path.join(API_DIR, "thumbnails");

module.exports = {
  UPLOADS_DIR,
  THUMBNAIL_DIR,
};
