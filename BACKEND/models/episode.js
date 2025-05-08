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
    ref: "Anime",
    required: true,
  },
});

// module.exports = mongoose.model("Episode", episodeSchema);
module.exports = episodeSchema;
