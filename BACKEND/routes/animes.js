const express = require('express');
const routerAnimes = express.Router();
const animesController = require('../controllers/animes_api_controller');   
const { uploadImage } = require('../libs/storage');
const { requireAuth } = require('../middlewares/auth');


routerAnimes.post('/', requireAuth, uploadImage.single('file'), animesController.createAnime);
routerAnimes.get('/', animesController.getAllAnimes);
routerAnimes.get('/:id', animesController.getAnimeById);
routerAnimes.delete('/:id', requireAuth, animesController.deleteAnime);
routerAnimes.put('/:id', requireAuth, uploadImage.single('file'), animesController.updateAnime);

module.exports = routerAnimes;