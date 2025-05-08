const express = require('express');
const router = express.Router();
const animeController = require('../controllers/animeController');

const uploadImg = require('../libs/storage')

// Crear nuevo anime con episodios
router.post('/', animeController.createAnime);


//lili
router.post('/', uploadImg.single('avatar_anime') , animeController.createAnime);

// Obtener todos los animes
router.get('/', animeController.getAllAnimes);

// Obtener un anime por ID
router.get('/:id', animeController.getAnimeById);

// Eliminar anime por ID
router.delete('/:id', animeController.deleteAnime);

module.exports = router;
