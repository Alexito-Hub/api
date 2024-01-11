// comments.js
const { Router } = require('express');
const router = new Router();
const fs = require('fs');
const path = require('path');
const commentsPath = path.join(__dirname, '../../json/comments.json');

// Middleware para obtener comentarios
router.get('/', (req, res) => {
  try {
    const comments = JSON.parse(fs.readFileSync(commentsPath, 'utf-8'));
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      creator: 'Zioo',
      status: 500,
      result: { error: 'Error al obtener comentarios' }
    });
  }
});

// Middleware para agregar comentarios
router.post('/', (req, res) => {
  try {
    const { name, body } = req.body;

    if (!name || !body) {
      return res.status(400).json({
        creator: 'Zioo',
        status: 400,
        result: { error: 'Nombre y cuerpo del comentario son obligatorios' }
      });
    }

    const newComment = { name, body };
    let existingComments = fs.readFileSync(commentsPath, 'utf-8');
    existingComments = existingComments ? JSON.parse(existingComments) : [];

    existingComments.push(newComment);
    fs.writeFileSync(commentsPath, JSON.stringify(existingComments, null, 2));

    res.status(201).json({
      creator: 'Zioo',
      status: 201,
      result: { message: 'Comentario agregado exitosamente' }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      creator: 'Zioo',
      status: 500,
      result: { error: 'Error al agregar comentario' }
    });
  }
});

module.exports = router;
