const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  diamonds: { type: Number, required: true, default: 0,},
  cards: [{
    idPokedex: { type: Number, required: true },
    quantity: { type: Number, required: true }
  }],
  ppURL: { type: String, default: 'NoPP' },
  collectibles: {
    type: { type: String, required: true },
    name: { type: String, required: true },
    equipped: {type: Boolean, required: true, default: false},
  },
  stats: { type: [Number], default: [0, 0, 0, 0, 0, 0] },
  displayedCards: { type: [Number], default: [null, null, null, null] },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('User', userSchema);
