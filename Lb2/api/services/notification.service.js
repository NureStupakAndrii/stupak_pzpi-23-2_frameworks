const { HttpError } = require("../errors/http.error");
const {
  fetchNotificationsByUserId,
  markNotificationAsRead,
} = require("./database.service");

async function listNotifications(userId) {
  return fetchNotificationsByUserId(userId);
}

async function readNotification(notificationId, userId) {
  const notification = await markNotificationAsRead(notificationId, userId);

  if (notification === null) {
    throw new HttpError(404, "Notification not found");
  }

  return notification;
}

module.exports = {
  listNotifications,
  readNotification,
};
