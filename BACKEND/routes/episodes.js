const express = require('express');
const routerEpisodes = express.Router();
const episodesController = require('../controllers/episodes_api_controller');
const { uploadVideo } = require('../libs/storage');
const { requireAuth } = require('../middlewares/auth');

routerEpisodes.post('/', requireAuth, uploadVideo.single('file'), episodesController.createEpisode);
routerEpisodes.get('/anime/:animeId', episodesController.getEpisodesByAnime);
routerEpisodes.delete('/:id', requireAuth, episodesController.deleteEpisode);
routerEpisodes.put('/:id', requireAuth, uploadVideo.single('file'), episodesController.updateEpisode);

module.exports = routerEpisodes;