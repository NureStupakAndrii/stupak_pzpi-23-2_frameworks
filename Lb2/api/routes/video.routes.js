const express = require("express");

const {
  createComment,
  getVideoComments,
} = require("../controllers/comment.controller");
const {
  getVideos,
  getSharedVideos,
  getVideoStream,
  createVideo,
  shareVideoWithUser,
} = require("../controllers/video.controller");
const { requireAuth } = require("../middlewares/auth.middleware");
const { uploadVideoMiddleware } = require("../middlewares/upload.middleware");

const videoRouter = express.Router();

videoRouter.get("/", getVideos);
videoRouter.get("/shared", requireAuth, getSharedVideos);
videoRouter.get("/:id/comments", getVideoComments);
videoRouter.get("/:id", getVideoStream);
videoRouter.post("/", requireAuth, uploadVideoMiddleware, createVideo);
videoRouter.post("/:id/comments", requireAuth, createComment);
videoRouter.post("/:id/share", requireAuth, shareVideoWithUser);

module.exports = {
  videoRouter,
};
