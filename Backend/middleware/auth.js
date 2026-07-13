const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }

  try {
    const token = auth.split(' ')[1];
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

module.exports = protect;
