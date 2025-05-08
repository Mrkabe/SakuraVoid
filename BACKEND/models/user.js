const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Formato de correo no válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [8, 'La contraseña debe tener al menos 8 caracteres']
  },
  favoritos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'anime'
  }],
  joined_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('user', userSchema);
