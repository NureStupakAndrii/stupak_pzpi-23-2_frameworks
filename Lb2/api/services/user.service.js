const bcrypt = require("bcrypt");
const { HttpError } = require("../errors/http.error");
const {
  findUserByEmail,
  findUserById,
  findUserByUsername,
  insertUser,
} = require("./database.service");

async function login(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await findUserByEmail(normalizedEmail);

  if (user === null) {
    throw new HttpError(401, "Invalid email or password");
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);

  if (!validPassword) {
    throw new HttpError(401, "Invalid email or password");
  }

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    createdAt: user.createdAt,
  };
}

async function register(email, username, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim();

  if (normalizedEmail === "") {
    throw new HttpError(400, "Email is required");
  }

  if (normalizedUsername === "") {
    throw new HttpError(400, "Username is required");
  }

  if (password.length < 6) {
    throw new HttpError(400, "Password must be at least 6 characters long");
  }

  const existingUserByEmail = await findUserByEmail(normalizedEmail);

  if (existingUserByEmail !== null) {
    throw new HttpError(409, "User with this email already exists");
  }

  const existingUserByUsername = await findUserByUsername(normalizedUsername);

  if (existingUserByUsername !== null) {
    throw new HttpError(409, "User with this username already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const createdUser = await insertUser({
    email: normalizedEmail,
    username: normalizedUsername,
    password_hash: hashedPassword,
  });

  return {
    id: createdUser.id,
    email: createdUser.email,
    username: createdUser.username,
    createdAt: createdUser.createdAt,
  };
}

async function getCurrentUser(userId) {
  const user = await findUserById(userId);

  if (user === null) {
    throw new HttpError(404, "User not found");
  }

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    createdAt: user.createdAt,
  };
}

module.exports = {
  getCurrentUser,
  login,
  register,
};
