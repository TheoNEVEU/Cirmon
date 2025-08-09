const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  diamonds: { type: Number, required: true, default: 0,},
  ppURL: { type: String, default: 'NoPP' },
  title: {
    text: { type: String, default: '' },
    gradientDirection: { type: String, default: 'to right' },
    colors: { type: [String], default: ['black'] },
    isGradientActive: { type: Boolean, default: false }
  },
  badgeURL: { type: [String], default: ['default', 'default'] },
  stats: { type: [Number], default: [0, 0, 0, 0, 0, 0] },
  cards: [{
    numPokedex: { type: Number, required: true },
    quantity: { type: Number, required: true }
  }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('User', userSchema);
