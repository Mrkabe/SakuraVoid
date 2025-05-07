const mongoose = require('mongoose');

const episodeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  number: {
    type: Number,
    required: true,
    min: 1
  }
}, { _id: false });

const animeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título del anime es obligatorio'],
    trim: true
  },
  episodes: {
    type: [episodeSchema],
    validate: [array => array.length > 0, 'Debe haber al menos un episodio']
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Debe indicar el usuario que sube el anime']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('anime', animeSchema);
