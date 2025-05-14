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
    .populate({
      path: 'favoritos',
      populate: {
        path: 'uploadedBy',
        select: 'name'
      }
    })
      .populate('siguiendo', 'name') // ✅ AÑADE ESTO
      .populate('followers', 'name')

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
/*tambien agrega favoritos?
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
}; */

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
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const index = user.favoritos.indexOf(animeId);

    if (index > -1) {
      user.favoritos.splice(index, 1); // Quitar de favoritos
    } else {
      user.favoritos.push(animeId); // Agregar a favoritos
    }

    await user.save();
    res.status(200).json({
      message: 'Favoritos actualizados',
      favoritos: user.favoritos
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al modificar favoritos' });
  }
};

exports.toggleFollow = async (req, res) => {
  const userId = req.user._id;
  const { targetUserId } = req.body;

  if (userId.equals(targetUserId)) {
    return res.status(400).json({ error: "No puedes seguirte a ti mismo" });
  }

  try {
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ error: "Usuario a seguir no encontrado" });
    }

    // Asegurar arrays inicializados
    user.siguiendo ||= [];
    targetUser.followers ||= [];

    let following = false;

    const indexInFollowing = user.siguiendo.indexOf(targetUserId);
    const indexInFollowers = targetUser.followers.indexOf(userId);

    if (indexInFollowing > -1) {
      user.siguiendo.splice(indexInFollowing, 1);
      if (indexInFollowers > -1) {
        targetUser.followers.splice(indexInFollowers, 1);
      }
    } else {
      user.siguiendo.push(targetUserId);
      targetUser.followers.push(userId);
      following = true;
    }

    await user.save();
    await targetUser.save();

    res.status(200).json({
      message: "Relación actualizada",
      following
    });
  } catch (err) {
    console.error("❌ toggleFollow error:", err);
    res.status(500).json({ error: 'Error al seguir/dejar de seguir usuario' });
  }
};


