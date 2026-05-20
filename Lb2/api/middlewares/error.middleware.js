const multer = require("multer");

const { HttpError } = require("../errors/http.error");

function handleErrors(error, req, res, next) {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      message: error.message,
    });
  }

  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    message: "Internal server error",
  });
}

module.exports = {
  handleErrors,
};
