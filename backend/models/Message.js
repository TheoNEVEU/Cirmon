// models/Message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  type: { type: String, enum: ["DROP", "ALERT", "EVENT"], required: true },
  content: { type: String, required: true },
  timeType: { type: String, enum: ["CREATION", "EXPIRE"], required: true },
  timeValue: { type: Date, required: true, default: Date.now() }
});

module.exports = mongoose.model("Message", messageSchema);
