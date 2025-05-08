const express = require('express');
const connectToMongo = require('./database/conection'); // <- ruta a tu archivo
const animeRoutes = require('./routes/animeRoutes');
const userRoutes = require('./routes/userRoutes');
const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a la base de datos
connectToMongo();

// Middleware
app.use(express.json());

// Rutas
app.use('/api/animes', animeRoutes);

app.use('/api/users', userRoutes);


app.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:$PORT}`);
});
