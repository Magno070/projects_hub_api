const { ApiError } = require("../utils/apiError");
const errorMiddleware = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal server error";

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  res.status(statusCode).json({
    success: false,
    message: message,
    // stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};
module.exports = errorMiddleware;
