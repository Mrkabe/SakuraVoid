// controllers/episodeController.js
const path = require("path");
const Episode = require('../models/episode');
const Anime = require('../models/anime');

exports.createEpisode = async (req, res) => {
  try {
    const { title, number, anime } = req.body;

    //depurar 
    console.log("title:", title);
    console.log("number:", number);
    console.log("anime:", anime);


    if (!req.file) {
      return res.status(400).json({ message: "Debes subir un archivo de video." });
    }

    const animeDoc = await Anime.findById(anime);
    if (!animeDoc) return res.status(404).json({ message: "Anime no encontrado" });
    //depuracion errores
    console.log("animeDoc.uploadedBy:", animeDoc.uploadedBy);
    console.log("req.user:", req.user);

    if (!animeDoc.uploadedBy || !req.user || !animeDoc.uploadedBy.equals(req.user._id)) {
      return res.status(403).json({ message: "No puedes agregar episodios a un anime que no es tuyo" });
   }

    const videoUrl = `${req.protocol}://${req.get('host')}/storage/videos/${req.file.filename}`;

    const newEpisode = new Episode({
      title,
      number,
      anime,
      videoUrl
    });

    await newEpisode.save();

    // Agregar episodio al anime
    animeDoc.episodes.push(newEpisode._id);
    await animeDoc.save();

    res.status(201).json({ message: "Episodio creado correctamente", episode: newEpisode });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear episodio", error });
  }
};

exports.getEpisodesByAnime = async (req, res) => {
  try {
    const episodes = await Episode.find({ anime: req.params.animeId }).sort("number");
    res.status(200).json(episodes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener episodios", error });
  }
};

exports.deleteEpisode = async (req, res) => {
  try {
    const episode = await Episode.findById(req.params.id).populate('anime');
    if (!episode) return res.status(404).json({ message: "Episodio no encontrado" });

    // 🔒 Validar propiedad
    if (!episode.anime.uploadedBy.equals(req.user._id)) {
      return res.status(403).json({ message: "No tienes permiso para eliminar este episodio" });
    }

    await episode.deleteOne();

    // Eliminar el ID del episodio del array en el anime
    await episode.anime.updateOne({ $pull: { episodes: episode._id } });

res.status(200).json({ message: "Episodio eliminado correctamente" });

  } catch (error) {
    res.status(500).json({ message: "Error al eliminar episodio", error });
  }
};
exports.updateEpisode = async (req, res) => {
  try {
    const episode = await Episode.findById(req.params.id).populate('anime');
    if (!episode) return res.status(404).json({ message: "Episodio no encontrado" });

    // 🔒 Validar que el usuario es dueño del anime relacionado
    if (!episode.anime.uploadedBy.equals(req.user._id)) {
      return res.status(403).json({ message: "No tienes permiso para actualizar este episodio" });
    }

    // Crear objeto de actualización
    const updateData = {};
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.number) updateData.number = req.body.number;

    if (req.file) {
      updateData.videoUrl = `${req.protocol}://${req.get('host')}/storage/videos/${req.file.filename}`;
    }

    const updated = await Episode.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({ message: "Episodio actualizado", episode: updated });
  } catch (error) {
    console.error("❌ Error al actualizar episodio:", error);
    res.status(500).json({ message: "Error al actualizar episodio", error });
  }
};

