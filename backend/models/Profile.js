const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  title: { type: String, default: 'default' },
  ppURL: { type: String, default: 'default' },
  badgeURL: { type: [String], default: ['default', 'default'] },
  stats: { type: [Number], default: [0, 0, 0, 0, 0, 0] },
  cards: { type: [Number], default: [] },
});

module.exports = mongoose.model('User', userSchema);
