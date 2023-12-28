require('../config')
const express = require('express');
const morgan = require('morgan');
const app = express();

// settings
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2)

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// routes
// app.use(require('./routers'));
// app.use('/api/movies', require('./routes/movies'));
app.use('/api/@zioo', require('./routers/@zioo'));
app.use('/api/config', require('./routers/config'));

app.use((req, res) => {
  res.status(404).json({
    creator: global.name,
    status: 404,
    result: { error: 'Ruta no encontrada' }
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    creator: global.name,
    status: 500,
    result: { error: 'Algo salió mal' }
  });
  
});


// starting the server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});