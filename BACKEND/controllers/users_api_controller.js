const User = require('../models/user');
const Anime = require('../models/anime');
//autenticacion real
const jwt = require('jsonwebtoken');
const SECRET = 'tu_clave_secreta';
//---------------------------------------
// Crear usuario
exports.registerUser = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  const newUser = new User({ name, email, password, favoritos: [] });

  newUser.save()
    .then(user => res.status(201).json(user))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Error al crear usuario' });
    });
}

// Obtener todos los usuarios
exports.getAllUsers = (req, res) => {
  User.find()
    .populate('favoritos', 'title')
    .then(users => res.json(users))
    .catch(err => res.status(500).json({ error: 'Error al obtener usuarios' }));
}

// Obtener un usuario por ID con favoritos
exports.getUserById = (req, res) => {
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
exports.deleteUser = (req, res) => {
  const id = req.params.id;

  User.findByIdAndDelete(id)
    .then(user => {
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json({ message: 'Usuario eliminado' });
    })
    .catch(err => res.status(500).json({ error: 'Error al eliminar usuario' }));
}
//tambien agrega favoritos?
exports.addFavorite = async (req, res) => {
  const userId = req.params.id;
  const { animeId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user.favoritos.includes(animeId)) {
      user.favoritos.push(animeId);
      await user.save();
    }
    res.status(200).json({ message: 'Favorito agregado' });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo agregar favorito' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password }); // si implementas hash usa bcrypt
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

exports.toggleFavorite = async (req, res) => {
  const userId = req.user._id;
  const { animeId } = req.body;

  try {
    const user = await User.findById(userId);
    const index = user.favoritos.indexOf(animeId);

    if (index > -1) {
      user.favoritos.splice(index, 1); // eliminar
    } else {
      user.favoritos.push(animeId); // agregar
    }

    await user.save();
    res.json({ message: 'Favoritos actualizados', favoritos: user.favoritos });
  } catch (err) {
    res.status(500).json({ error: 'Error al modificar favoritos' });
  }
};

exports.toggleFollow = async (req, res) => {
  const userId = req.user._id;
  const { targetUserId } = req.body;

  try {
    const user = await User.findById(userId);
    const index = user.siguiendo.indexOf(targetUserId);

    if (index > -1) {
      user.siguiendo.splice(index, 1); // dejar de seguir
    } else {
      user.siguiendo.push(targetUserId); // seguir
    }

    await user.save();
    res.json({ message: 'Relación actualizada', siguiendo: user.siguiendo });
  } catch (err) {
    res.status(500).json({ error: 'Error al seguir/dejar de seguir usuario' });
  }
};
