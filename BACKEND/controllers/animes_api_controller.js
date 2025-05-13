const Anime = require('../models/anime');
const Episode = require('../models/episode');
const path = require('path');


// Crear un anime 

exports.createAnime = async (req, res) => {
  const { title, description } = req.body;

  if (!title || !req.file || !req.user) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  const imgUrl = `${req.protocol}://${req.get('host')}/storage/imgs/${req.file.filename}`;

  try {
    const newAnime = new Anime({
      title,
      description,
      uploadedBy: req.user._id,
      imgUrl,
      episodes: [] // Inicialmente vacío
    });

    await newAnime.save();
    res.status(201).json(newAnime);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar el anime' });
  }
};

// Obtener todos los animes
exports.getAllAnimes = (req, res) => {
  Anime.find()
    .populate('uploadedBy', 'name email') // ← podría estar fallando aquí
    .populate('episodes')
    .then(animes => res.json(animes))
    .catch(err => {
      console.error("Error al obtener animes:", err); // 👈 IMPORTANTE para ver el error real
      res.status(500).json({ error: 'Error al obtener animes' });
    });
};



// Obtener un anime por ID
exports.getAnimeById = (req, res) => {
  const id = req.params.id;
  Anime.findById(id)
    .populate('uploadedBy', 'name')
    .populate('episodes')
    .then(anime => {
      if (!anime) return res.status(404).json({ error: 'Anime no encontrado' });
      res.json(anime);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Error al buscar anime' });
    });
}

// Eliminar anime y sus episodios
 exports.deleteAnime = (req, res) => {

  const id = req.params.id;

  Anime.findById(id)
    .then(anime => {
      if (!anime) return res.status(404).json({ error: 'Anime no encontrado' });

      if (!anime.uploadedBy.equals(req.user._id)) {
        return res.status(403).json({ error: 'No tienes permiso para eliminar este anime' });
      }

      Episode.deleteMany({ anime: anime._id })
        .then(() => {
          Anime.deleteOne({ _id: anime._id })
            .then(() => res.json({ message: 'Anime eliminado correctamente' }))
            .catch(err => {
              console.error(err);
              res.status(500).json({ error: 'Error al eliminar anime' });
            });
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ error: 'Error al eliminar episodios' });
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Error al buscar anime' });
    });
}

// Actualizar anime
exports.updateAnime = async (req, res) => {
  const animeId = req.params.id;
  const { title, description } = req.body;

  try {
    const anime = await Anime.findById(animeId);
    if (!anime) return res.status(404).json({ error: 'Anime no encontrado' });

    if (!anime.uploadedBy.equals(req.user._id)) {
      return res.status(403).json({ error: 'No autorizado para modificar este anime' });
    }

    if (title) anime.title = title;
    if (description) anime.description = description;

    await anime.save();
    res.status(200).json({ message: 'Anime actualizado correctamente', anime });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar anime' });
  }
};

