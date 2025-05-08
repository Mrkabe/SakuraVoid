const mongoose = require('mongoose');


const animeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título del anime es obligatorio'],
    trim: true
  },
  //lili
  description: String,
  imgUrl: String,
  genre: String,
  //fin
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


//lili
//animeSchema.methods.setImgUrl = function setImgUrl () {
// this.imgUrl = `localhost:3000/storage/imgs/${filename}`
//}

module.exports = mongoose.model('anime', animeSchema);
