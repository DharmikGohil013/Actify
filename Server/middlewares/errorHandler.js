const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    console.error(`[ERROR] ${req.method} ${req.originalUrl}`, err);
  }

  res.status(status).json({
    success: false,
    msg: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;
