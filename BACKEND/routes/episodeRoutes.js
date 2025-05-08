// routes/episodeRoutes.js
const express = require("express");
const router = express.Router();
const episodeController = require("../controllers/episodeController");
const { uploadVideo } = require("../storage");

// Crear episodio (sube video)
router.post("/", uploadVideo.single("video"), episodeController.createEpisode);

// Obtener episodios de un anime
router.get("/anime/:animeId", episodeController.getEpisodesByAnime);

// Eliminar episodio
router.delete("/:id", episodeController.deleteEpisode);

// Actualizar episodio (opcional con nuevo video)
router.put("/:id", uploadVideo.single("video"), episodeController.updateEpisode);

module.exports = router;
