const ffmpeg = require("fluent-ffmpeg");
const { THUMBNAIL_DIR } = require("../config/storage-paths");

function generateThumbnail(videoPath, thumbnailFilename) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .on("end", () => {
        resolve(thumbnailFilename);
      })
      .on("error", (error) => {
        reject(error);
      })
      .screenshots({
        timestamps: ["00:00:01"],
        filename: thumbnailFilename,
        folder: THUMBNAIL_DIR,
        size: "320x?",
      });
  });
}

module.exports = generateThumbnail;
