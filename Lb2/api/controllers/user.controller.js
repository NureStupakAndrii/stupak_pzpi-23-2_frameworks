const { HttpError } = require("../errors/http.error");
const { getCurrentUser, login, register } = require("../services/user.service");

async function registerUser(req, res, next) {
  try {
    const { email, username, password } = req.body;

    if (email === undefined || email.trim() === "") {
      throw new HttpError(400, "Email is required");
    }

    if (username === undefined || username.trim() === "") {
      throw new HttpError(400, "Username is required");
    }

    if (password === undefined || password.trim() === "") {
      throw new HttpError(400, "Password is required");
    }

    const user = await register(email, username, password);

    req.session.userId = user.id;

    return res.status(201).json({
      user,
    });
  } catch (error) {
    next(error);
  }
}

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;

    if (email === undefined || email.trim() === "") {
      throw new HttpError(400, "Email is required");
    }

    if (password === undefined || password.trim() === "") {
      throw new HttpError(400, "Password is required");
    }

    const user = await login(email, password);

    req.session.userId = user.id;

    return res.json({
      user,
    });
  } catch (error) {
    next(error);
  }
}

async function logoutUser(req, res, next) {
  try {
    req.session.destroy((error) => {
      if (error !== null) {
        next(new HttpError(500, "Failed to destroy session"));
        return;
      }

      res.clearCookie("connect.sid");
      res.status(204).end();
    });
  } catch (error) {
    next(error);
  }
}

async function getMe(req, res, next) {
  try {
    const user = await getCurrentUser(req.session.userId);

    return res.json({
      user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMe,
  loginUser,
  logoutUser,
  registerUser,
};
