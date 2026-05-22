const express = require("express");

const {
  getNotifications,
  markNotificationRead,
} = require("../controllers/notification.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

const notificationRouter = express.Router();

notificationRouter.get("/", requireAuth, getNotifications);
notificationRouter.patch("/:id/read", requireAuth, markNotificationRead);

module.exports = {
  notificationRouter,
};
