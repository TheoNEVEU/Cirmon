const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  label: { type: String, required: true },
  image: { type: String, required: true },
  // (optionnel) rarity, category, howToUnlock, ...
});

module.exports = mongoose.model('Badge', BadgeSchema);