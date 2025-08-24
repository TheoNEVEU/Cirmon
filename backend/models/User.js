const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Infos générales
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  diamonds: { type: Number, required: true, default: 0 },

  // Actuellement équipés
  profPicEquipped: { type: String, default: '68a3c55266fffb8ab45028d3' },
  titleEquipped: { type: String , default: '68a3c4da66fffb8ab45028cf' },
  badgesEquipped: { type: [String], default: [{_id: 'default'},{_id: 'default'}] 
  },
  displayedCards: { type: [String], default: [0, 0, 0, 0] },

  // Inventaire
  collectibles: { // Tous les collectibles débloqués
    profPicIds: { type: [String], default: ['68a3c55266fffb8ab45028d3'] },
    titleIds: { type: [String], default: ['68a3c4da66fffb8ab45028cf'] },
    badgeIds: { type: [String], default: ['68a3c51666fffb8ab45028d1'] }
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
