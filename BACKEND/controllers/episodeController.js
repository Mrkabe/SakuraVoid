// controllers/episodeController.js
const path = require("path");

exports.createEpisode = async (req, res) => {
  try {
    const { title, number, anime } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Debes subir un archivo de video." });
    }

    const videoUrl = `/videos/${req.file.filename}`; // Desde carpeta pública

    const newEpisode = new Episode({
      title,
      number,
      anime,
      videoUrl
    });

    await newEpisode.save();
    res.status(201).json({ message: "Episodio creado correctamente", episode: newEpisode });

  } catch (error) {
    res.status(500).json({ message: "Error al crear episodio", error });
  }
};

exports.getEpisodesByAnime = async (req, res) => {
  try {
    const { animeId } = req.params;
    const episodes = await Episode.find({ anime: animeId }).sort("number");
    res.status(200).json(episodes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener episodios", error });
  }
};

exports.deleteEpisode = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Episode.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Episodio no encontrado" });
    res.status(200).json({ message: "Episodio eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar episodio", error });
  }
};

exports.updateEpisode = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      updateData.videoUrl = `/uploads/${req.file.filename}`;
    }

    const updated = await Episode.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "Episodio no encontrado" });

    res.status(200).json({ message: "Episodio actualizado", episode: updated });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar episodio", error });
  }
};
