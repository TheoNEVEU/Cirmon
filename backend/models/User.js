const mongoose = require('mongoose');

const Title = require('./models/Title');
const Badge = require('./models/Badge');

const TitleEmbedded = new mongoose.Schema({
  text: { type: String, default: '' },
  gradientDirection: { type: String, default: 'to right' },
  colors: { type: [String], default: ['black'] },
  isGradientActive: { type: Boolean, default: false }
}, { _id: false });

const userSchema = new mongoose.Schema({
  // Infos générales
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  diamonds: { type: Number, required: true, default: 0 },

  // Actuellement équipés
  ppURL: { type: String, default: 'NoPP' },
  title: { type: TitleEmbedded, default: null },
  badgesEquipped: { 
    type: [Badge], 
    default: [{ _id: 'default', label: 'default', image: 'default' },{ _id: 'default', label: 'default', image: 'default' }] 
  },
  displayedCards: { type: [Number], default: [0, 0, 0, 0] },

  // Inventaire
  collectibles: { // Tous les collectibles débloqués
    titleIds: { type: [String], default: [] },
    badgeIds: { type: [String], default: [] }
  },

  cards: [{
    idPokedex: { type: Number, required: true },
    quantity: { type: Number, required: true }
  }],

  // Autres informations
  stats: { type: [Number], default: [0, 0, 0, 0, 0, 0] },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('User', userSchema);
