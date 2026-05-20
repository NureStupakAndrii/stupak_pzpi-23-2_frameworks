const fs = require("fs");

const { UPLOADS_DIR, THUMBNAIL_DIR } = require("../config/storage-paths");

function initializeStorage() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  if (!fs.existsSync(THUMBNAIL_DIR)) {
    fs.mkdirSync(THUMBNAIL_DIR, { recursive: true });
  }
}

module.exports = {
  initializeStorage,
};
