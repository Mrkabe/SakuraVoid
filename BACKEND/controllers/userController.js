const User = require('../models/User');
const Anime = require('../models/Anime');

// Crear usuario
function createUser(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  const newUser = new User({ name, email, passwo, favoritos: [] });

  newUser.save()
    .then(user => res.status(201).json(user))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Error al crear usuario' });
    });
}

// Obtener todos los usuarios
function getAllUsers(req, res) {
  User.find()
    .populate('favoritos', 'title')
    .then(users => res.json(users))
    .catch(err => res.status(500).json({ error: 'Error al obtener usuarios' }));
}

// Obtener un usuario por ID con favoritos
function getUserById(req, res) {
  const id = req.params.id;

  User.findById(id)
    .populate('favoritos', 'title episodes')
    .then(user => {
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json(user);
    })
    .catch(err => res.status(500).json({ error: 'Error al buscar usuario' }));
}

// Eliminar usuario
function deleteUser(req, res) {
  const id = req.params.id;

  User.findByIdAndDelete(id)
    .then(user => {
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json({ message: 'Usuario eliminado' });
    })
    .catch(err => res.status(500).json({ error: 'Error al eliminar usuario' }));
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  deleteUser
};
