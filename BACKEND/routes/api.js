const express = require("express");
// const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const animeRoutes = require("./routes/animeRoutes");
const episodeRoutes = require("./routes/episodeRoutes");

const connectToMongo = require("./database/conection");
connectToMongo();

const app = express();
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

// Exponer la carpeta de archivos publicos
app.use("/imgs", express.static(path.join(__dirname, "storage", "imgs")));
app.use("/videos", express.static(path.join(__dirname, "storage", "videos")));
