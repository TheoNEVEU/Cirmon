const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  idPokedex: Number,
  idcollection: Number,
  name: String,
  illustration: String,
  rarity: Number,
  type: String,
  hp: Number,
  attacks: [String],
  retreatCost: Number,
});

module.exports = mongoose.model('Card', CardSchema);
