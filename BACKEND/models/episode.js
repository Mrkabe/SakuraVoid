const mongoose = require("mongoose");

const episodeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  anime: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "anime",
    required: true,
  },
});

const Episode = mongoose.model('Episode', episodeSchema);
module.exports = Episode;
