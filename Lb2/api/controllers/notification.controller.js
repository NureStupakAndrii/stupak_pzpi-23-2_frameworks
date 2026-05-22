const {
  listNotifications,
  readNotification,
} = require("../services/notification.service");

async function getNotifications(req, res, next) {
  try {
    const notifications = await listNotifications(req.session.userId);

    return res.json(notifications);
  } catch (error) {
    next(error);
  }
}

async function markNotificationRead(req, res, next) {
  try {
    const notification = await readNotification(req.params.id, req.session.userId);

    return res.json({
      notification,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getNotifications,
  markNotificationRead,
};
