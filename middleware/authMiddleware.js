const jwt = require('jsonwebtoken');

// Middleware function to verify the JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, 'your-secret-key', (error, decoded) => {
    if (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Attach the user ID to the request object for further use
    req.userId = decoded.userId;
    next();
  });
};

module.exports = { verifyToken };
