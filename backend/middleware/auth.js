const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function auth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ success: false, message: 'Token manquant' });

  const token = authHeader.split(' ')[1]; // format: "Bearer <token>"
  if (!token) return res.status(401).json({ success: false, message: 'Token manquant' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ success: false, message: 'Utilisateur introuvable' });

    req.user = { id: user._id, username: user.username }; // tu peux ajouter d'autres infos si besoin
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token invalide' });
  }
};
