const express = require('express');
const routerUsers = express.Router();
const usersController = require('../controllers/users_api_controller');
const { requireAuth } = require('../middlewares/auth');


routerUsers.post('/', usersController.registerUser);

routerUsers.post('/login', usersController.login);

routerUsers.get('/', usersController.getAllUsers);


routerUsers.get('/:id', usersController.getUserById);


routerUsers.delete('/:id', requireAuth, usersController.deleteUser);
//es lo mismo??
routerUsers.patch('/:id/favoritos', requireAuth, usersController.addFavorite);
// Agregar o quitar favorito
routerUsers.patch('/favoritos', requireAuth, usersController.toggleFavorite);

// Seguir o dejar de seguir usuario
routerUsers.patch('/follow', requireAuth, usersController.toggleFollow);

module.exports = routerUsers;