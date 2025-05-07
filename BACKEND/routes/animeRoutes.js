const express = require('express');
const router = express.Router();
const animeController = require('../controllers/animeController');

// Crear nuevo anime con episodios
router.post('/', animeController.createAnime);

// Obtener todos los animes
router.get('/', animeController.getAllAnimes);

// Obtener un anime por ID
router.get('/:id', animeController.getAnimeById);

// Eliminar anime por ID
router.delete('/:id', animeController.deleteAnime);

module.exports = router;
