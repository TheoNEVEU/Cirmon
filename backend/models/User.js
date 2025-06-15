const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  title: {
    text: { type: String, default: 'default' },
    gradientDirection: { type: String, default: 'to right' },
    colors: { type: [String], default: ['black'] },
    isGradientActive: { type: Boolean, default: false }
  },
  ppURL: { type: String, default: 'default' },
  badgeURL: { type: [String], default: ['default', 'default'] },
  stats: { type: [Number], default: [0, 0, 0, 0, 0, 0] },
  cards: [{
  numPokedex: { type: Number, required: true },
  quantity: { type: Number, required: true }
  }]
});

module.exports = mongoose.model('User', userSchema);
