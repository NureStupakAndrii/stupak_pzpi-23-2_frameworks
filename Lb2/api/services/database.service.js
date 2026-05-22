const { Pool } = require("pg");
const { DATABASE_CONFIG } = require("../config/db");

const pool = new Pool(DATABASE_CONFIG);

function mapVideoRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    username: row.username,
    title: row.title,
    description: row.description,
    filename: row.filename,
    originalName: row.original_name,
    mimeType: row.mime_type,
    size: row.size,
    uploadedAt: row.uploaded_at.toISOString(),
    thumbnail: row.thumbnail,
  };
}

function mapNotificationRow(row) {
  return {
    id: row.id,
    videoId: row.video_id,
    title: row.title,
    channelUserId: row.channel_user_id,
    channelUsername: row.channel_username,
    createdAt: row.created_at.toISOString(),
    readAt: row.read_at === null ? null : row.read_at.toISOString(),
  };
}

function mapSharedVideoRow(row) {
  return {
    ...mapVideoRow(row),
    sharedAt: row.shared_at.toISOString(),
    sharedByUsername: row.shared_by_username,
  };
}

function mapCommentRow(row) {
  return {
    id: row.id,
    videoId: row.video_id,
    userId: row.user_id,
    username: row.username,
    content: row.content,
    createdAt: row.created_at.toISOString(),
  };
}

function mapSubscriptionRow(row) {
  return {
    id: row.id,
    userId: row.target_user_id,
    username: row.username,
    createdAt: row.created_at.toISOString(),
  };
}

function mapUserRow(row) {
  return {
    id: row.id,
    email: row.email,
    username: row.username,
    passwordHash: row.password_hash,
    createdAt: row.created_at.toISOString(),
  };
}

async function initializeDatabase() {
  await pool.query("SELECT 1");
}

async function fetchVideos() {
  const result = await pool.query(`
    SELECT
      videos.id,
      videos.user_id,
      users.username,
      videos.title,
      videos.description,
      videos.filename,
      videos.original_name,
      videos.mime_type,
      videos.size,
      videos.uploaded_at,
      videos.thumbnail
    FROM videos
    LEFT JOIN users ON users.id = videos.user_id
    ORDER BY videos.uploaded_at DESC
  `);

  return result.rows.map(mapVideoRow);
}

async function fetchVideoById(videoId) {
  const result = await pool.query(
    `
      SELECT
        videos.id,
        videos.user_id,
        users.username,
        videos.title,
        videos.description,
        videos.filename,
        videos.original_name,
        videos.mime_type,
        videos.size,
        videos.uploaded_at,
        videos.thumbnail
      FROM videos
      LEFT JOIN users ON users.id = videos.user_id
      WHERE videos.id = $1
    `,
    [videoId],
  );

  if (result.rowCount === 0) {
    return null;
  }

  return mapVideoRow(result.rows[0]);
}

async function fetchSharedVideos(userId) {
  const result = await pool.query(
    `
      SELECT
        videos.id,
        videos.user_id,
        owner_users.username,
        videos.title,
        videos.description,
        videos.filename,
        videos.original_name,
        videos.mime_type,
        videos.size,
        videos.uploaded_at,
        videos.thumbnail,
        video_shares.created_at AS shared_at,
        sharer_users.username AS shared_by_username
      FROM video_shares
      JOIN videos ON videos.id = video_shares.video_id
      LEFT JOIN users AS owner_users ON owner_users.id = videos.user_id
      JOIN users AS sharer_users ON sharer_users.id = video_shares.from_user_id
      WHERE video_shares.to_user_id = $1
      ORDER BY video_shares.created_at DESC
    `,
    [userId],
  );

  return result.rows.map(mapSharedVideoRow);
}

async function insertVideo(video) {
  const result = await pool.query(
    `
      INSERT INTO videos (
        id,
        user_id,
        title,
        description,
        filename,
        original_name,
        mime_type,
        size,
        uploaded_at,
        thumbnail
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING
        id,
        user_id,
        title,
        description,
        filename,
        original_name,
        mime_type,
        size,
        uploaded_at,
        thumbnail
    `,
    [
      video.id,
      video.userId,
      video.title,
      video.description,
      video.filename,
      video.originalName,
      video.mimeType,
      video.size,
      video.uploadedAt,
      video.thumbnail,
    ],
  );

  return mapVideoRow(result.rows[0]);
}

async function insertVideoShare(videoId, fromUserId, toUserId) {
  const result = await pool.query(
    `
      INSERT INTO video_shares (
        video_id,
        from_user_id,
        to_user_id
      )
      VALUES ($1, $2, $3)
      ON CONFLICT (video_id, to_user_id)
      DO UPDATE SET
        from_user_id = EXCLUDED.from_user_id,
        created_at = NOW()
      RETURNING
        id,
        video_id,
        from_user_id,
        to_user_id,
        created_at
    `,
    [videoId, fromUserId, toUserId],
  );

  return result.rows[0];
}

async function fetchCommentsByVideoId(videoId) {
  const result = await pool.query(
    `
      SELECT
        comments.id,
        comments.video_id,
        comments.user_id,
        users.username,
        comments.content,
        comments.created_at
      FROM comments
      JOIN users ON users.id = comments.user_id
      WHERE comments.video_id = $1
      ORDER BY comments.created_at ASC
    `,
    [videoId],
  );

  return result.rows.map(mapCommentRow);
}

async function fetchSubscriptionsByUserId(userId) {
  const result = await pool.query(
    `
      SELECT
        subscriptions.id,
        subscriptions.target_user_id,
        users.username,
        subscriptions.created_at
      FROM subscriptions
      JOIN users ON users.id = subscriptions.target_user_id
      WHERE subscriptions.subscriber_id = $1
      ORDER BY subscriptions.created_at DESC
    `,
    [userId],
  );

  return result.rows.map(mapSubscriptionRow);
}

async function insertSubscription(subscriberId, targetUserId) {
  const result = await pool.query(
    `
      WITH subscription AS (
        INSERT INTO subscriptions (
          subscriber_id,
          target_user_id
        )
        VALUES ($1, $2)
        ON CONFLICT (subscriber_id, target_user_id)
        DO UPDATE SET
          created_at = subscriptions.created_at
        RETURNING
          id,
          target_user_id,
          created_at
      )
      SELECT
        subscription.id,
        subscription.target_user_id,
        users.username,
        subscription.created_at
      FROM subscription
      JOIN users ON users.id = subscription.target_user_id
    `,
    [subscriberId, targetUserId],
  );

  return mapSubscriptionRow(result.rows[0]);
}

async function deleteSubscription(subscriberId, targetUserId) {
  const result = await pool.query(
    `
      DELETE FROM subscriptions
      WHERE subscriber_id = $1
        AND target_user_id = $2
    `,
    [subscriberId, targetUserId],
  );

  return result.rowCount > 0;
}

async function insertComment(comment) {
  const result = await pool.query(
    `
      WITH inserted_comment AS (
        INSERT INTO comments (
          user_id,
          video_id,
          content
        )
        VALUES ($1, $2, $3)
        RETURNING
          id,
          video_id,
          user_id,
          content,
          created_at
      )
      SELECT
        inserted_comment.id,
        inserted_comment.video_id,
        inserted_comment.user_id,
        users.username,
        inserted_comment.content,
        inserted_comment.created_at
      FROM inserted_comment
      JOIN users ON users.id = inserted_comment.user_id
    `,
    [comment.userId, comment.videoId, comment.content],
  );

  return mapCommentRow(result.rows[0]);
}

async function insertNewVideoNotifications(videoId, channelUserId) {
  await pool.query(
    `
      INSERT INTO notifications (
        user_id,
        video_id,
        channel_user_id
      )
      SELECT
        subscriber_id,
        $1,
        $2
      FROM subscriptions
      WHERE target_user_id = $2
      ON CONFLICT (user_id, video_id)
      DO NOTHING
    `,
    [videoId, channelUserId],
  );
}

async function fetchNotificationsByUserId(userId) {
  const result = await pool.query(
    `
      SELECT
        notifications.id,
        notifications.video_id,
        videos.title,
        notifications.channel_user_id,
        users.username AS channel_username,
        notifications.created_at,
        notifications.read_at
      FROM notifications
      JOIN videos ON videos.id = notifications.video_id
      JOIN users ON users.id = notifications.channel_user_id
      WHERE notifications.user_id = $1
      ORDER BY notifications.created_at DESC
    `,
    [userId],
  );

  return result.rows.map(mapNotificationRow);
}

async function markNotificationAsRead(notificationId, userId) {
  const result = await pool.query(
    `
      UPDATE notifications
      SET read_at = COALESCE(read_at, NOW())
      WHERE id = $1
        AND user_id = $2
      RETURNING
        id,
        video_id,
        (
          SELECT title
          FROM videos
          WHERE videos.id = notifications.video_id
        ) AS title,
        channel_user_id,
        (
          SELECT username
          FROM users
          WHERE users.id = notifications.channel_user_id
        ) AS channel_username,
        created_at,
        read_at
    `,
    [notificationId, userId],
  );

  if (result.rowCount === 0) {
    return null;
  }

  return mapNotificationRow(result.rows[0]);
}

async function insertUser(user) {
  const result = await pool.query(
    `
      INSERT INTO users (
        email,
        username,
        password_hash
      )
      VALUES ($1, $2, $3)
      RETURNING
        id,
        email,
        username,
        password_hash,
        created_at
    `,
    [user.email, user.username, user.password_hash],
  );

  return mapUserRow(result.rows[0]);
}

async function findUserByEmail(email) {
  const result = await pool.query(
    `
      SELECT
        id,
        email,
        username,
        password_hash,
        created_at
      FROM users
      WHERE email = $1
    `,
    [email],
  );

  if (result.rowCount === 0) {
    return null;
  }

  return mapUserRow(result.rows[0]);
}

async function findUserByUsername(username) {
  const result = await pool.query(
    `
      SELECT
        id,
        email,
        username,
        password_hash,
        created_at
      FROM users
      WHERE username = $1
    `,
    [username],
  );

  if (result.rowCount === 0) {
    return null;
  }

  return mapUserRow(result.rows[0]);
}

async function findUserById(userId) {
  const result = await pool.query(
    `
      SELECT
        id,
        email,
        username,
        password_hash,
        created_at
      FROM users
      WHERE id = $1
    `,
    [userId],
  );

  if (result.rowCount === 0) {
    return null;
  }

  return mapUserRow(result.rows[0]);
}

module.exports = {
  pool,
  fetchCommentsByVideoId,
  fetchNotificationsByUserId,
  fetchSharedVideos,
  fetchSubscriptionsByUserId,
  fetchVideoById,
  fetchVideos,
  deleteSubscription,
  findUserByEmail,
  findUserById,
  findUserByUsername,
  initializeDatabase,
  insertComment,
  insertNewVideoNotifications,
  insertSubscription,
  insertVideoShare,
  insertVideo,
  insertUser,
  markNotificationAsRead,
};
