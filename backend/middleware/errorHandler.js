const errorHandler = (err, req, res, next) => {
  // Express error handlers must have 4 parameters
  // Even if we don't use 'next', it must be present
  
  console.error("Error:", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Server Error";

  // Handle mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found";
  }

  // Handle duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";
  }

  // Handle validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(", ");
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;
