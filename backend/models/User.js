const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Infos générales
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  diamonds: { type: Number, required: true, default: 0 },

  // Actuellement équipés
  profPicEquipped: { type: String, default: '68a3c55266fffb8ab45028d3' },
  titleEquipped: { type: String , default: '68a3c4da66fffb8ab45028cf' },
  badgesEquipped: {
    type: [{ id: String, level: Number }],
    default: [{ id: 'default', level: 0 }, { id: 'default', level: 0 }]
  },
  displayedCards: { type: [String], default: [0, 0, 0, 0] },

  // Inventaire
  collectibles: { // Tous les collectibles débloqués
    profPicIds: { type: [String], default: ['68a3c55266fffb8ab45028d3']},
    titleIds: { type: [String], default: ['68a3c4da66fffb8ab45028cf']},
    badges: {
      type: [{
        id: { type: String, default: '68a3c51666fffb8ab45028d1'},
        level: { type: Number, default: 0 }
      }], 
      default: [{ id: '68a3c51666fffb8ab45028d1', level: 0 }]}
  },

  cards: [{
    _id: { type: String, ref: "Card", required: true },
    quantity: { type: Number, required: true }
  }],

  // Autres informations
  stats: { type: [Number], default: [0, 0, 0, 0, 0, 0] },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('User', userSchema);
