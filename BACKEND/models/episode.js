const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título del episodio es obligatorio'],
    trim: true
  },
  number: {
    type: Number,
    required: [true, 'El número del episodio es obligatorio'],
    min: 1
  },
  anime: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Anime',
    required: true
  }
});

module.exports = mongoose.model('Episode', episodeSchema);
