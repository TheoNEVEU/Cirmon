// models/Message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  type: { type: String, enum: ["ALERT", "EVENT", "SYSTEM"], required: true },
  content: { type: String, required: true },
  card: { type: mongoose.Schema.Types.ObjectId, ref: "Card" },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

module.exports = mongoose.model("Message", messageSchema);
