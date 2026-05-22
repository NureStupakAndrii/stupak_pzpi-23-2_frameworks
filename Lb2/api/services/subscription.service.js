const { HttpError } = require("../errors/http.error");
const {
  deleteSubscription,
  fetchSubscriptionsByUserId,
  findUserByUsername,
  insertSubscription,
} = require("./database.service");

async function listSubscriptions(userId) {
  return fetchSubscriptionsByUserId(userId);
}

async function subscribeToUser(username, currentUserId) {
  const normalizedUsername = username.trim();

  if (normalizedUsername === "") {
    throw new HttpError(400, "Username is required");
  }

  const targetUser = await findUserByUsername(normalizedUsername);

  if (targetUser === null) {
    throw new HttpError(404, "User not found");
  }

  if (String(targetUser.id) === String(currentUserId)) {
    throw new HttpError(400, "You cannot subscribe to yourself");
  }

  return insertSubscription(currentUserId, targetUser.id);
}

async function unsubscribeFromUser(username, currentUserId) {
  const normalizedUsername = username.trim();

  if (normalizedUsername === "") {
    throw new HttpError(400, "Username is required");
  }

  const targetUser = await findUserByUsername(normalizedUsername);

  if (targetUser === null) {
    throw new HttpError(404, "User not found");
  }

  const deleted = await deleteSubscription(currentUserId, targetUser.id);

  if (!deleted) {
    throw new HttpError(404, "Subscription not found");
  }
}

module.exports = {
  listSubscriptions,
  subscribeToUser,
  unsubscribeFromUser,
};
