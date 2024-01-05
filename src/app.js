require('dotenv').config();
require('./data');
const express = require('express');
const morgan = require('morgan');
const path = require('path')
const app = express();
const resKey = require('./edit');
const name = global.name

app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res) => {
	res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const DateKey = (req, res, next) => {
  const providedKey = req.query.key;
  const apiKey = process.env.API_KEY;
  if (providedKey !== apiKey) {
    return res.status(401).json({
      creator: name,
      status: 401,
      result: { error: 'Clave única inválida' }
    });
  }

  next();
};


app.use('/data', DateKey);
app.use('/data/keys', require('../data/routers/keys'));
app.use('/data/users', require('../data/routers/_user'));
app.use('/data/config', require('../data/routers/config'));

app.use(async (req, res, next) => {
  try {
    const providedKey = req.query.key;

    const keys = await resKey.getKeys();
    
    if (!keys || !Array.isArray(keys)) {
      return res.status(500).json({
        creator: name,
        status: 500,
        result: { error: 'Error al obtener las claves' }
      });
    }
    const keyObject = keys.find(key => key.key === providedKey);
    if (!keyObject || !keyObject.status) {
      return res.status(401).json({
        creator: name,
        status: 401,
        result: { error: 'Clave inválida o desactivada' }
      });
    }

    if (keyObject.limit <= 0) {
      return res.status(403).json({
        creator: name,
        status: 403,
        result: { error: 'Límite de uso alcanzado para la clave' }
      });
    }
    next();

    if (res.statusCode === 200) {
      keyObject.limit--;
      await resKey.updateKey(keyObject);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      creator: name,
      status: 500,
      result: { error: 'Error al procesar la clave' }
    });
  }
});

app.use('/api/frase', require('../api/routers/frase'));
app.use('/api/ytdl-mp4', require('../api/routers/ytdl-mp4')); 
app.use('/api/ytdl-mp3', require('../api/routers/ytdl-mp3')); 
app.use('/api/ytdl-search', require('../api/routers/ytdl-search')); 

app.use((req, res) => {
  res.status(404).json({
    creator: name,
    status: 404,
    result: { error: 'Ruta no encontrada' }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    creator: name,
    status: 500,
    result: { error: 'Algo salió mal' }
  });
});

app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});
