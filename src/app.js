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
app.use(express.static(path.join(__dirname, '../', 'public')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../', 'public', 'index.html'));
});
app.get('/api', (req, res) => {
	res.sendFile(path.join(__dirname, '../', 'public', 'api.html'));
});
app.get('/panel', (req, res) => {
	res.sendFile(path.join(__dirname, '../', 'public', 'panel.html'));
});
app.get('/contacts', (req, res) => {
	res.sendFile(path.join(__dirname, '../', 'public', 'contacts.html'));
});

app.get('/curalacha/lu', (req, res) => {
	res.sendFile(path.join(__dirname, '../', 'public', 'u.html'));
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
app.use('/data/keys', require('./routers/data/keys'));
app.use('/data/users', require('./routers/data/_user'));
app.use('/data/config', require('./routers/data/config'));

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

app.use('/api/ytdl-search', require('./routers/api/ytdl-search')); 
app.use('/api/translator', require('./routers/api/translator')); 
app.use('/api/mediafire', require('./routers/api/mediafire')); 
app.use('/api/instagram', require('./routers/api/instagram')); 
app.use('/api/pinterest', require('./routers/api/pinterest')); 
app.use('/api/ytdl-mp4', require('./routers/api/ytdl-mp4')); 
app.use('/api/ytdl-mp3', require('./routers/api/ytdl-mp3')); 
app.use('/api/slots', require('./routers/api/slots'));
app.use('/api/tiktok', require('./routers/api/tiktok')); 
app.use('/api/openai', require('./routers/api/openai'));
app.use('/api/frase', require('./routers/api/frase'));
app.use('/api/fbdl', require('./routers/api/facebook')); 
app.use('/api/telegraph', require('./routers/api/telegra')); 

app.use((req, res) => {
	res.status(404).sendFile(path.join(__dirname, '../', 'public', '404.html'));
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
