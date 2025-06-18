// /middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  // Optionally, add logging here
  const status = err.statusCode || 500;
  res.status(status).json({
    msg: err.message || 'Internal Server Error',
    // Optionally, include stack trace in dev:
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;
