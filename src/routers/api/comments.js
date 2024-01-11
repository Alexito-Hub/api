const { Router } = require('express');
const router = new Router();
const fs = require('fs');
const path = require('path');
const commentsPath = path.join(__dirname, '../../json/comments.json');

router.get('/', (req, res) => {
  try {
    if (fs.existsSync(commentsPath)) {
      const commentsData = fs.readFileSync(commentsPath, 'utf-8');
      const comments = commentsData ? JSON.parse(commentsData) : [];
      res.json({
        status: 200,
        comments: comments,
      });
    } else {
      res.json({
        status: 200,
        comments: [], // Retorna un arreglo vacío si el archivo no existe
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      error: 'Error al obtener comentarios',
    });
  }
});


// Middleware para agregar comentarios
router.post('/', (req, res) => {
  try {
    const { name, body } = req.body;

    if (!name || !body) {
      return res.status(400).json({
        creator: name,
        status: 400,
        result: { error: 'Nombre y cuerpo del comentario son obligatorios' }
      });
    }

    // Intentar leer el archivo JSON existente
    let existingComments = [];
    try {
      existingComments = JSON.parse(fs.readFileSync(commentsPath, 'utf-8')) || [];
    } catch (readError) {
      console.error('Error al leer el archivo JSON:', readError);
    }

    const newComment = { name, body };
    existingComments.push(newComment);

    // Intentar escribir el archivo JSON actualizado
    try {
      fs.writeFileSync(commentsPath, JSON.stringify(existingComments, null, 2));
    } catch (writeError) {
      console.error('Error al escribir el archivo JSON:', writeError);
      return res.status(500).json({
        creator: name,
        status: 500,
        result: { error: 'Error al agregar comentario' }
      });
    }

    res.status(201).json({
      creator: name,
      status: 201,
      result: { message: 'Comentario agregado exitosamente' }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      creator: name,
      status: 500,
      result: { error: 'Error al agregar comentario' }
    });
  }
});



module.exports = router;
