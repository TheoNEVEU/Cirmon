const mongoose = require('mongoose');

const RandomCardSchema = new mongoose.Schema({
});

module.exports = mongoose.model('RandomCard', RandomCardSchema);
