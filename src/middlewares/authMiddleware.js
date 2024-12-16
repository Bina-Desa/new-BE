const { verifyToken } = require('../helpers/jwtHelper');

// Middleware untuk memverifikasi JWT
const authenticate = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(403).json({ msg: 'Access denied. No token provided.' });
  }

  const decoded = verifyToken(token.replace('Bearer ', ''));

  if (!decoded) {
    return res.status(401).json({ msg: 'Invalid token.' });
  }

  req.user = decoded; // Menyimpan informasi user dalam request untuk digunakan pada rute berikutnya
  next();
};

module.exports = { authenticate };
