const { HttpError } = require("../errors/http.error");
const {
  listSubscriptions,
  subscribeToUser,
  unsubscribeFromUser,
} = require("../services/subscription.service");

async function getSubscriptions(req, res, next) {
  try {
    const subscriptions = await listSubscriptions(req.session.userId);

    return res.json(subscriptions);
  } catch (error) {
    next(error);
  }
}

async function createSubscription(req, res, next) {
  try {
    const username = typeof req.body.username === "string" ? req.body.username : "";

    if (username.trim() === "") {
      throw new HttpError(400, "Username is required");
    }

    const subscription = await subscribeToUser(username, req.session.userId);

    return res.status(201).json({
      subscription,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteSubscription(req, res, next) {
  try {
    await unsubscribeFromUser(req.params.username, req.session.userId);

    return res.status(204).end();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createSubscription,
  deleteSubscription,
  getSubscriptions,
};
