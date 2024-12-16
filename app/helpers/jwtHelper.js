const jwt = require('jwt-simple');
const moment = require('moment');

const secretKey = 'your_secret_key'; // Ganti dengan secret key Anda

// Fungsi untuk membuat token
const createToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    exp: moment().add(24, 'hour').unix(), // Token akan kedaluwarsa dalam 1 jam
  };

  return jwt.encode(payload, secretKey);
};

// Fungsi untuk memverifikasi token
const verifyToken = (token) => {
  try {
    return jwt.decode(token, secretKey);
  } catch (error) {
    return null;
  }
};

module.exports = { createToken, verifyToken };
