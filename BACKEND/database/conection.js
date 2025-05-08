const mongoose = require('mongoose');

function connectToMongo() {
  const uri = process.env.MONGO_URI || 'mongodb+srv://admin:6fhB6jpDnDxrOGIy@cluster0.12kdlh1.mongodb.net/';

  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch(err => console.error('Error al conectar a MongoDB', err));
}

module.exports = connectToMongo;
