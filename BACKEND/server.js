const express = require('express');
const app = express();
const path = require('path');
const conectToMongo = require('./database/conection')
const router = require('./routes/api');

app.use(express.json());

const port = 3000;

app.use('/storage/imgs', express.static(path.join(__dirname, 'libs', 'storage', 'imgs')));
app.use('/storage/videos', express.static(path.join(__dirname, 'libs', 'storage', 'videos')));
conectToMongo();
app.use('/api', router);

app.listen(port, () =>{
    console.log(`SakuraVoid Corriendo en el puerto ${port}!`);
})