const express = require("express");
const router = express.Router();
const episodeController = require("../controllers/episodeController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.get("/anime/:animeId", episodeController.getEpisodesByAnime);
router.post("/", upload.single("video"), episodeController.createEpisode);
// También puedes agregar PUT y DELETE si lo necesitas

module.exports = router;
