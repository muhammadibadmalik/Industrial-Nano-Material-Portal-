const jwt   = require('jsonwebtoken');
const Admin = require('../models/Admin');

// POST /api/auth/login
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ success: false, message: 'Username and password required' });

  try {
    const admin = await Admin.findOne({ username });
    if (!admin || !(await admin.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { login };
