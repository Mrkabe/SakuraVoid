/*
const express = require("express");
// const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const app = express();
const userRoutes = require("./routes/userRoutes");
const animeRoutes = require("./routes/animeRoutes");
const episodeRoutes = require("./routes/episodeRoutes");

const connectToMongo = require("./database/conection");
connectToMongo();


app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

//mongoose
  //.connect("mongodb+srv://admin:6fhB6jpDnDxrOGIy@cluster0.12kdlh1.mongodb.net/")
  //.then(() => console.log("Conectado a MongoDB Atlas"))
  //.catch((err) => console.error("Error de conexión:", err));

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/animes", animeRoutes);
app.use("/api/episodes", episodeRoutes);


const htmlPath = path.join(__dirname, '..', 'frontend', 'views');

app.get('/home', (req, res) => {
  res.sendFile(path.join(htmlPath, 'home.html'));
});

app.get('/favoritos', requireAuth, (req, res) => {
  res.sendFile(path.join(htmlPath, 'favoritos.html'));
});

app.get('/upload', requireAuth, (req, res) => {
  res.sendFile(path.join(htmlPath, 'upload.html'));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

// Exponer la carpeta de archivos publicos
app.use("/imgs", express.static(path.join(__dirname, "storage", "imgs")));
app.use("/videos", express.static(path.join(__dirname, "storage", "videos")));
*/

const express = require("express");
const cors = require("cors");
const path = require("path");

const userRoutes = require("./userRoutes");
const animeRoutes = require("./animeRoutes");
const episodeRoutes = require("./episodeRoutes");
const connectToMongo = require("../database/conection");
const { requireAuth } = require("../middlewares/auth");


const app = express();
connectToMongo();

// Middlewares
app.use(cors());
app.use(express.json());

// Archivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use("/imgs", express.static(path.join(__dirname, "storage", "imgs")));
app.use("/videos", express.static(path.join(__dirname, "storage", "videos")));

// Rutas API
app.use("/api/users", userRoutes);
app.use("/api/animes", animeRoutes);
app.use("/api/episodes", episodeRoutes);

// Rutas HTML
const htmlPath = path.join(__dirname, '..', 'frontend', 'views');

app.get('/home', (req, res) => {
  res.sendFile(path.join(htmlPath, 'home.html'));
});

app.get('/favoritos', requireAuth, (req, res) => {
  res.sendFile(path.join(htmlPath, 'favoritos.html'));
});

app.get('/upload', requireAuth, (req, res) => {
  res.sendFile(path.join(htmlPath, 'upload.html'));
});

// Exportar app para usarla en server.js
module.exports = app;
