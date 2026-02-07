const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // slug/key
  label: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, required: true },
  rarity: { type: String, default: 'common' },
  baseLevel: { type: Number, default: 0 },
  maxLevel: { type: Number, default: 5 },
  // Upgrade costs per level: [{ level: Number, cost: Number, currency: String }]
  upgradeCosts: { type: Array, default: [] },

  // Conditions to unlock this badge (catalog-level rules)
  unlockConditions: {
    // Example: { type: 'stat', statIndex:0, min: 100 }
    type: { type: String },
    params: { type: Object, default: {} }
  },

  // Conditions to level up (per-badge rules)
  levelUpConditions: { type: Array, default: [] },

  metadata: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Badge', BadgeSchema);