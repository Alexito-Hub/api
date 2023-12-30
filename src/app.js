require('dotenv').config();
require('./data');
const express = require('express');
const morgan = require('morgan');
const app = express();
const resKey = require('./edit');

const name = global.name

app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/api/keys', (req, res, next) => {
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
});
app.use('/api/keys', require('./routers/keys'))

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

app.use('/api/@zioo', require('./routers/@zioo'));
app.use('/api/config', require('./routers/config'));
app.use('/api/life', require('./routers/life'));

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
