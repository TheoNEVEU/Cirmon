const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  idPokedex: Number,
  collection: Number,
  name: String,
  illustration: String,
  rarity: Number,
  type: String,
  hp: Number,
  attacks: [String],
  retreatCost: Number,
});

module.exports = mongoose.model('Card', CardSchema);
