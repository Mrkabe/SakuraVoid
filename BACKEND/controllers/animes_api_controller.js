const Anime = require('../models/anime');
const Episode = require('../models/episode');
const path = require('path');


// Crear un anime con episodios
exports.createAnime = async (req, res) => {
  const { title, description } = req.body;
  let episodes;

  try {
    episodes = JSON.parse(req.body.episodes);
  } catch {
    return res.status(400).json({ error: 'Formato de episodios inválido' });
  }

  if (!title || !episodes || !req.file || !req.user) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  const imgUrl = `${req.protocol}://${req.get('host')}/storage/imgs/${req.file.filename}`;

  const newAnime = new Anime({
    title,
    description,
    uploadedBy: req.user._id,
    imgUrl,
    episodes: []
  });
  
  newAnime.save()
    .then(savedAnime => {
      const episodePromises = episodes.map(ep => {
        const newEp = new Episode({
          title: ep.title,
          number: ep.number,
          anime: savedAnime._id
        });
        return newEp.save();
      });

      Promise.all(episodePromises)
        .then(createdEpisodes => {
          const episodeIds = createdEpisodes.map(ep => ep._id);
          savedAnime.episodes = episodeIds;
          savedAnime.save()
            .then(updatedAnime => res.status(201).json(updatedAnime))
            .catch(err => {
              console.error(err);
              res.status(500).json({ error: 'Error al actualizar el anime con episodios' });
            });
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ error: 'Error al crear episodios' });
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Error al guardar el anime' });
    });
}

// Obtener todos los animes
exports.getAllAnimes = (req, res) => {
  Anime.find()
    .populate('uploadedBy', 'name email')
    .populate('episodes')
    .then(animes => res.json(animes))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener animes' });
    });
}

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

