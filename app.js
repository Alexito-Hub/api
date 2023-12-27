const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Rutas para cada sección
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // Reemplaza 'index.html' con el nombre de tu archivo HTML principal
});

app.get('/apis', (req, res) => {
  res.sendFile(__dirname + '/apis.html'); // Reemplaza 'apis.html' con el nombre de tu archivo HTML para la sección de APIs
});

app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/about.html'); // Reemplaza 'about.html' con el nombre de tu archivo HTML para la sección "Acerca de"
});

app.get('/contact', (req, res) => {
  res.sendFile(__dirname + '/contact.html'); // Reemplaza 'contact.html' con el nombre de tu archivo HTML para la sección de contacto
});

// Puedes agregar más rutas según sea necesario para otras secciones

app.listen(port, () => {
  console.log(`La API está escuchando en http://localhost:${port}`);
});
