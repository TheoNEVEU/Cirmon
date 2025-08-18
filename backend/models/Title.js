const mongoose = require('mongoose');

const TitleSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  text: { type: String, required: true },
  gradientDirection: { type: String, default: 'to right' },
  colors: { type: [String], default: ['black'] },
  isGradientActive: { type: Boolean, default: false },
  // (optionnel) meta: { description, howToUnlock, ... }
});

module.exports = mongoose.model('Title', TitleSchema);
