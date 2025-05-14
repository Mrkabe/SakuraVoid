const express = require('express');
const app = express();
const path = require('path');
const conectToMongo = require('./database/conection')
const router = require('./routes/api');
const routerApi = require('./routes/api');
app.use(express.json());

const port = 3000;
app.use(express.static('FRONTEND'));
app.use('/controlers', express.static('../FRONTEND/controllers'));
app.use('/views', express.static('../FORNTEND/views'));
app.use('/assets', express.static('../FORNTEND/assets'));
app.use(express.static(path.join(__dirname, '../FRONTEND')));
app.use('/storage/imgs', express.static(path.join(__dirname, 'libs', 'storage', 'imgs')));
app.use('/storage/videos', express.static(path.join(__dirname, 'libs', 'storage', 'videos')));
+
conectToMongo();


//app.use('/controllers', express.static(path.join(__dirname, 'FRONTEND/controllers')));

app.use(router);
app.use('/', routerApi);
app.listen(port, () =>{
    console.log(`SakuraVoid Corriendo en el puerto ${port}!`);
})