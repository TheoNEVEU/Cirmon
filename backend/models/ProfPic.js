const mongoose = require('mongoose');

const ProfPicSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  label: { type: String, required: true },
  image: { type: String, required: true },
  // (optionnel) rarity, category, howToUnlock, ...
});

module.exports = mongoose.model('ProfPic', ProfPicSchema);