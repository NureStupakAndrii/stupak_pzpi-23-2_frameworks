require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const pgSession = require("connect-pg-simple");

const { userRouter } = require("./routes/user.routes");
const { videoRouter } = require("./routes/video.routes");
const { subscriptionRouter } = require("./routes/subscription.routes");
const { notificationRouter } = require("./routes/notification.routes");
const { handleErrors } = require("./middlewares/error.middleware");
const { initializeDatabase, pool } = require("./services/database.service");
const { initializeStorage } = require("./services/storage.service");

const PORT = Number(process.env.PORT ?? "3001");
const sessionSecret = process.env.SESSION_SECRET;

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());

const PgStore = pgSession(session);

app.use(
  session({
    secret: sessionSecret,
    store: new PgStore({
      pool,
      createTableIfMissing: true,
      tableName: "user_sessions",
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: "lax",
    },
  }),
);

app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/subscriptions", subscriptionRouter);
app.use("/notifications", notificationRouter);
app.use(handleErrors);

async function bootstrap() {
  initializeStorage();
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
