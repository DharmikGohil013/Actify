// middlewares/cache.js
const cache = (duration = 300) => { // Default 5 minutes
  return (req, res, next) => {
    // Set cache headers for GET requests
    if (req.method === 'GET') {
      res.set('Cache-Control', `public, max-age=${duration}`);
    }
    next();
  };
};

module.exports = cache;
