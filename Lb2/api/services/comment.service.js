const { HttpError } = require("../errors/http.error");
const {
  fetchCommentsByVideoId,
  fetchVideoById,
  insertComment,
} = require("./database.service");

async function listVideoComments(videoId) {
  const video = await fetchVideoById(videoId);

  if (video === null) {
    throw new HttpError(404, "Video not found");
  }

  return fetchCommentsByVideoId(videoId);
}

async function createVideoComment(videoId, userId, rawContent) {
  const content = rawContent.trim();

  if (content === "") {
    throw new HttpError(400, "Comment content is required");
  }

  const video = await fetchVideoById(videoId);

  if (video === null) {
    throw new HttpError(404, "Video not found");
  }

  return insertComment({
    userId,
    videoId,
    content,
  });
}

module.exports = {
  createVideoComment,
  listVideoComments,
};
