import jwt from 'jsonwebtoken';

export default function (req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    console.log('[AUTH] No token provided');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('[AUTH] Invalid token:', err.message);
    return res.status(401).json({ message: 'Token is not valid' });
  }
}
