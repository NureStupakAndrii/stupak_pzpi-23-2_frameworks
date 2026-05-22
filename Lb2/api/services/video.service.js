const generateThumbnail = require("./thumbnail.service");
const {
  fetchSharedVideos,
  fetchVideoById,
  fetchVideos,
  findUserByUsername,
  insertNewVideoNotifications,
  insertVideo,
  insertVideoShare,
} = require("./database.service");
const { HttpError } = require("../errors/http.error");

async function listVideos() {
  return fetchVideos();
}

async function findVideoById(videoId) {
  return fetchVideoById(videoId);
}

async function listSharedVideos(userId) {
  return fetchSharedVideos(userId);
}

async function shareVideo(videoId, username, currentUserId) {
  const normalizedUsername = username.trim();

  if (normalizedUsername === "") {
    throw new HttpError(400, "Username is required");
  }

  const video = await fetchVideoById(videoId);

  if (video === null) {
    throw new HttpError(404, "Video not found");
  }

  const targetUser = await findUserByUsername(normalizedUsername);

  if (targetUser === null) {
    throw new HttpError(404, "User not found");
  }

  if (String(targetUser.id) === String(currentUserId)) {
    throw new HttpError(400, "You cannot share a video with yourself");
  }

  await insertVideoShare(videoId, currentUserId, targetUser.id);

  return {
    videoId,
    username: targetUser.username,
  };
}

async function saveUploadedVideo(file, rawTitle, rawDescription, userId) {
  const normalizedTitle = rawTitle.trim();
  const normalizedDescription = rawDescription.trim();

  const videoId = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

  const thumbnailFilename = `${videoId}.jpg`;

  await generateThumbnail(file.path, thumbnailFilename);

  const video = {
    id: videoId,
    userId,
    title: normalizedTitle === "" ? file.originalname : normalizedTitle,
    description: normalizedDescription,
    filename: file.filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    thumbnail: thumbnailFilename,
  };

  await insertVideo(video);
  await insertNewVideoNotifications(video.id, userId);

  return video;
}

module.exports = {
  listVideos,
  listSharedVideos,
  findVideoById,
  saveUploadedVideo,
  shareVideo,
};
