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

    if (fs.existsSync(commentsPath)) {
      const existingComments = JSON.parse(fs.readFileSync(commentsPath, 'utf-8')) || [];
      existingComments.push(newComment);
      fs.writeFileSync(commentsPath, JSON.stringify(existingComments, null, 2));
    } else {
      fs.writeFileSync(commentsPath, JSON.stringify([newComment], null, 2));
    }

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
