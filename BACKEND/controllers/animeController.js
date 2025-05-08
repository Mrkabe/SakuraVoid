const Anime = require('../models/anime');
const Episode = require('../models/episode');

// Crear un anime con episodios
function createAnime(req, res) {
  const { title, episodes, uploadedBy } = req.body;

  if (!title || !episodes || !uploadedBy) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  const newAnime = new Anime({
    title,
    uploadedBy,
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
function getAllAnimes(req, res) {
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
function getAnimeById(req, res) {
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
function deleteAnime(req, res) {
  const id = req.params.id;

  Anime.findById(id)
    .then(anime => {
      if (!anime) return res.status(404).json({ error: 'Anime no encontrado' });

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

module.exports = {
  createAnime,
  getAllAnimes,
  getAnimeById,
  deleteAnime
};
