const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  label: { type: String, required: true },
  image: { type: String, required: true },
  // (optionnel) rarity, category, howToUnlock, ...
}, { timestamps: true });

module.exports = mongoose.model('Badge', BadgeSchema);