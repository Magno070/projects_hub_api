const { ApiError } = require("../utils/apiError");
const errorMiddleware = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal server error";

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found with id of " + err.value;
  }
  if (statusCode === 500 && process.env.NODE_ENV === "production") {
    message = "Internal server error";
  } else if (statusCode === 500) {
    message = err.message;
  }
  res.status(statusCode).json({
    success: false,
    message: message,
    // stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};
module.exports = errorMiddleware;
