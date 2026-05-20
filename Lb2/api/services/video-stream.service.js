const fs = require("fs");
const path = require("path");

const { UPLOADS_DIR } = require("../config/storage-paths");

function getVideoFilePath(filename) {
  return path.join(UPLOADS_DIR, filename);
}

function parseRangeHeader(rangeHeader, fileSize) {
  const parts = rangeHeader.replace(/bytes=/, "").split("-");
  const start = Number.parseInt(parts[0], 10);
  const end = parts[1] === "" ? fileSize - 1 : Number.parseInt(parts[1], 10);

  if (
    Number.isNaN(start) ||
    Number.isNaN(end) ||
    start < 0 ||
    end >= fileSize ||
    start > end
  ) {
    return null;
  }

  return {
    start,
    end,
  };
}

function createFullVideoStreamPayload(filePath, mimeType, fileSize) {
  return {
    headers: {
      "Content-Length": fileSize,
      "Content-Type": mimeType,
      "Accept-Ranges": "bytes",
    },
    stream: fs.createReadStream(filePath),
  };
}

function createPartialVideoStreamPayload(
  filePath,
  mimeType,
  fileSize,
  start,
  end,
) {
  return {
    headers: {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
      "Content-Type": mimeType,
    },
    stream: fs.createReadStream(filePath, { start, end }),
  };
}

module.exports = {
  getVideoFilePath,
  parseRangeHeader,
  createFullVideoStreamPayload,
  createPartialVideoStreamPayload,
};
