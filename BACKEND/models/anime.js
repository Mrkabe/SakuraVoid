const mongoose = require('mongoose');
const Episode = require("../models/episode"); 


const animeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título del anime es obligatorio'],
    trim: true
  },
  //lili
  description: String,
  imgUrl: {
    type: String,
    required: true
  },
  //fin
  episodes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Episode',
    //validate: [array => array.length > 0, 'Debe haber al menos un episodio']
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

const Anime = mongoose.model('anime', animeSchema);
module.exports = Anime;