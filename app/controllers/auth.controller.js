const bcrypt = require('bcryptjs');
const { createToken } = require('../helpers/jwtHelper');
const { Users } = require('../models');

// Fungsi untuk login dan menghasilkan token JWT
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Cari user berdasarkan username
    const user = await Users.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Bandingkan password yang dikirimkan dengan password yang di-hash
    const isMatch = await user.password == password;

    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // Jika validasi berhasil, buat token JWT
    const token = createToken(user);

    return res.status(200).json({
      msg: 'Login successful',
      token,
    });
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error', error: error.message });
  }
};

module.exports = { login };
