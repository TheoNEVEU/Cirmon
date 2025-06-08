const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  idPokedex: Number,
  type: String,
  name: String,
  hp: Number,
  attacks: [String],
  retreatCost: Number,
  imageUrl: String,
  quantity: Number,
  isShiny: Boolean,
  isRainbow: Boolean,
});

module.exports = mongoose.model('Card', CardSchema);
