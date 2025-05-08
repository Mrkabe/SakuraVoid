const express = require('express');
const router = express.Router();
const animeController = require('../controllers/animeController');

const uploadImg = require('../libs/storage')

// Crear nuevo anime con episodios
animerouter.post('/', animeController.createAnime);


//lili
animerouter.post('/', uploadImg.single('avatar_anime') , animeController.createAnime);

// Obtener todos los animes
animerouter.get('/', animeController.getAllAnimes);

// Obtener un anime por ID
animerouter.get('/:id', animeController.getAnimeById);

// Eliminar anime por ID
animerouter.delete('/:id', animeController.deleteAnime);

module.exports = animerouter;
