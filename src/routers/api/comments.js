const { Router } = require('express');
const router = new Router();
const fs = require('fs');
const path = require('path');
const commentsPath = path.join(__dirname, '../../json/comments.json');

// Middleware para obtener comentarios
router.get('/', (req, res) => {
  try {
    // Lee el archivo de comentarios
    const comments = JSON.parse(fs.readFileSync(commentsPath, 'utf-8'));
    
    // Retorna los comentarios como respuesta JSON
    res.json({
      status: 200,
      comments: comments || [],
    });
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
        status: 400,
        error: 'Nombre y cuerpo del comentario son obligatorios',
      });
    }

    const newComment = { name, body };
    const existingComments = JSON.parse(fs.readFileSync(commentsPath, 'utf-8')) || [];

    // Agrega el nuevo comentario al arreglo existente
    existingComments.push(newComment);

    // Escribe el arreglo actualizado en el archivo
    fs.writeFileSync(commentsPath, JSON.stringify(existingComments, null, 2));

    // Retorna una respuesta JSON indicando el éxito
    res.status(201).json({
      status: 201,
      message: 'Comentario agregado exitosamente',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      error: 'Error al agregar comentario',
    });
  }
});

module.exports = router;
