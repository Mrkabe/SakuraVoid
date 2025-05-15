const express = require('express');
const routerUsers = express.Router();
const usersController = require('../controllers/users_api_controller');
const { requireAuth } = require('../middlewares/auth');


routerUsers.post('/', usersController.registerUser);

routerUsers.post('/login', usersController.login);

routerUsers.get('/', usersController.getAllUsers);


routerUsers.get('/:id', usersController.getUserById);


routerUsers.delete('/delete', requireAuth, usersController.deleteUser);

// Agregar o quitar favorito
routerUsers.patch('/favoritos', requireAuth, usersController.toggleFavorite);

// Seguir o dejar de seguir usuario
routerUsers.patch('/follow', requireAuth, usersController.toggleFollow);
//modificar usuarios
routerUsers.put('/update', requireAuth, usersController.updateProfile);

module.exports = routerUsers;