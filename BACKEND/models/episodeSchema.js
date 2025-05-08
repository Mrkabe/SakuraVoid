const mongoose = require("mongoose");

const episodeSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  numero: { type: Number, required: true },
  url_video: { type: String, required: true }
});

module.exports = episodeSchema;
