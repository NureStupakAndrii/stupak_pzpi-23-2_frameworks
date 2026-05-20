const { HttpError } = require("../errors/http.error");
const {
  createVideoComment,
  listVideoComments,
} = require("../services/comment.service");

async function getVideoComments(req, res, next) {
  try {
    const comments = await listVideoComments(req.params.id);

    return res.json(comments);
  } catch (error) {
    next(error);
  }
}

async function createComment(req, res, next) {
  try {
    const content = typeof req.body.content === "string" ? req.body.content : "";

    if (content.trim() === "") {
      throw new HttpError(400, "Comment content is required");
    }

    const comment = await createVideoComment(
      req.params.id,
      req.session.userId,
      content,
    );

    return res.status(201).json({
      comment,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createComment,
  getVideoComments,
};
