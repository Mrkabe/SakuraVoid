const express = require('express');
const path = require('path');
const routerApi = express.Router();
const routerUsers = require('./users');
const routerAnimes = require('./animes');
const routerEpisodes = require('./episodes');
routerApi.use('/users', routerUsers);
routerApi.use('/animes', routerAnimes);
routerApi.use('/episodes', routerEpisodes);


//Publico
routerApi.get('/login.html', (req, res) => 
    res.sendFile(path.resolve(__dirname + "/../../FRONTEND/views/login.html"))
);

routerApi.get('/home.html', (req, res) =>
  res.sendFile(path.resolve(__dirname + "/../../FRONTEND/views/home.html"))
);

routerApi.get('/', (req, res) =>
  res.sendFile(path.resolve(__dirname + "/../../FRONTEND/views/home.html"))
);


routerApi.get('/anime.html', (req, res) => 
  res.sendFile(path.resolve(__dirname + "/../../FRONTEND/views/anime.html"))
);

//Privado Falta verificar autenticación

routerApi.get('/upload.html', (req, res) => 
  res.sendFile(path.resolve(__dirname + "/../../FRONTEND/views/upload.html"))
);


routerApi.get('/perfil.html', (req, res) => 
  res.sendFile(path.resolve(__dirname + "/../../FRONTEND/views/perfil.html"))
);

routerApi.get('/favoritos.html', (req, res) => 
  res.sendFile(path.resolve(__dirname + "/../../FRONTEND/views/favoritos.html"))
);

module.exports = routerApi;