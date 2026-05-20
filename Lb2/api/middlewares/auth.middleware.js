const { HttpError } = require("../errors/http.error");

function requireAuth(req, res, next) {
  if (req.session.userId === undefined) {
    next(new HttpError(401, "Authentication required"));
    return;
  }

  next();
}

module.exports = {
  requireAuth,
};
