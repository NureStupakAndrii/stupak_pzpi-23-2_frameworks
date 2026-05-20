const fs = require("fs");
const path = require("path");

const { UPLOADS_DIR } = require("../config/storage-paths");

const { HttpError } = require("../errors/http.error");
const {
  listVideos,
  listSharedVideos,
  findVideoById,
  saveUploadedVideo,
  shareVideo,
} = require("../services/video.service");
const {
  getVideoFilePath,
  createFullVideoStreamPayload,
  createPartialVideoStreamPayload,
  parseRangeHeader,
} = require("../services/video-stream.service");

async function getVideos(req, res, next) {
  try {
    const videos = await listVideos();

    return res.json(videos);
  } catch (error) {
    next(error);
  }
}

async function getVideoStream(req, res, next) {
  try {
    const videoId = req.params.id;
    const video = await findVideoById(videoId);

    if (video === null) {
      throw new HttpError(404, "Video not found");
    }

    const videoFilePath = getVideoFilePath(video.filename);

    if (!fs.existsSync(videoFilePath)) {
      throw new HttpError(404, "Video not found");
    }

    const fileSize = fs.statSync(videoFilePath).size;
    const rangeHeader = req.headers.range;

    if (rangeHeader === undefined) {
      const responsePayload = createFullVideoStreamPayload(
        videoFilePath,
        video.mimeType,
        fileSize,
      );

      res.writeHead(200, responsePayload.headers);
      responsePayload.stream.pipe(res);
      return;
    }

    const parsedRange = parseRangeHeader(rangeHeader, fileSize);

    if (parsedRange === null) {
      res.writeHead(416, {
        "Content-Range": `bytes */${fileSize}`,
      });
      res.end();
      return;
    }

    const responsePayload = createPartialVideoStreamPayload(
      videoFilePath,
      video.mimeType,
      fileSize,
      parsedRange.start,
      parsedRange.end,
    );

    res.writeHead(206, responsePayload.headers);
    responsePayload.stream.pipe(res);
  } catch (error) {
    next(error);
  }
}

async function getSharedVideos(req, res, next) {
  try {
    const videos = await listSharedVideos(req.session.userId);

    return res.json(videos);
  } catch (error) {
    next(error);
  }
}

async function createVideo(req, res, next) {
  try {
    if (req.file === undefined) {
      throw new HttpError(400, "Video file is required");
    }

    const title = typeof req.body.title === "string" ? req.body.title : "";
    const description =
      typeof req.body.description === "string" ? req.body.description : "";

    await saveUploadedVideo(req.file, title, description, req.session.userId);

    return res.status(201).json({
      message: "Video uploaded successfully",
    });
  } catch (error) {
    if (req.file === undefined) {
      next(error);
      return;
    }

    const filePath = path.join(UPLOADS_DIR, req.file.filename);

    if (!fs.existsSync(filePath)) {
      next(error);
      return;
    }

    fs.unlinkSync(filePath);
    next(error);
  }
}

async function shareVideoWithUser(req, res, next) {
  try {
    const videoId = req.params.id;
    const username = typeof req.body.username === "string" ? req.body.username : "";
    const share = await shareVideo(videoId, username, req.session.userId);

    return res.status(201).json({
      share,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getVideos,
  getSharedVideos,
  getVideoStream,
  createVideo,
  shareVideoWithUser,
};
