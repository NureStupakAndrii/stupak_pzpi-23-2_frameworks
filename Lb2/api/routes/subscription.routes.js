const express = require("express");

const {
  createSubscription,
  deleteSubscription,
  getSubscriptions,
} = require("../controllers/subscription.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

const subscriptionRouter = express.Router();

subscriptionRouter.get("/", requireAuth, getSubscriptions);
subscriptionRouter.post("/", requireAuth, createSubscription);
subscriptionRouter.delete("/:username", requireAuth, deleteSubscription);

module.exports = {
  subscriptionRouter,
};
