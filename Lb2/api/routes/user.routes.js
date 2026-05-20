const express = require("express");

const {
  getMe,
  loginUser,
  logoutUser,
  registerUser,
} = require("../controllers/user.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", requireAuth, logoutUser);
userRouter.get("/me", requireAuth, getMe);

module.exports = {
  userRouter,
};
