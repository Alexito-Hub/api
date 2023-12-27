const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Ruta de ejemplo
app.get('/api/hola', (req, res) => {
  res.json({ mensaje: '¡Hola desde tu API!' });
});

app.listen(port, () => {
  console.log(`La API está escuchando en http://localhost:${port}`);
});
