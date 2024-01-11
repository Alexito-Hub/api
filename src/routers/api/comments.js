// comments.js
const { Router } = require('express');
const { format } = require('date-fns');
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

router.get('/:id', (req, res) => {
  const { id } = req.params;
  try {
    const comments = JSON.parse(fs.readFileSync(commentsPath, 'utf-8'));
    const comment = comments.find(c => c.id === parseInt(id));
    if (comment) {
      res.json(comment);
    } else {
      res.status(404).json({
        creator: 'Zioo',
        status: 404,
        result: { error: 'Comentario no encontrado' }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      creator: 'Zioo',
      status: 500,
      result: { error: 'Error al obtener comentario' }
    });
  }
});
// Middleware para agregar comentarios
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

    const existingComments = JSON.parse(fs.readFileSync(commentsPath, 'utf-8')) || [];
    const newId = existingComments.length > 0 ? existingComments[existingComments.length - 1].id + 1 : 1;
    
    // Obtén la fecha y hora en formato local
    const localDateTime = new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' });

    // Formatea el nuevo comentario con la hora local
    const newComment = { id: newId, date: localDateTime, name, body, like: 0 };

    existingComments.push(newComment);
    fs.writeFileSync(commentsPath, JSON.stringify(existingComments, null, 2));

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


// Middleware para agregar reacción a un comentario
router.post('/react', (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        creator: name,
        status: 400,
        result: { error: 'ID del comentario requerido para reaccionar' }
      });
    }

    const existingComments = JSON.parse(fs.readFileSync(commentsPath, 'utf-8')) || [];
    const commentToUpdate = existingComments.find(comment => comment.id === id);

    if (!commentToUpdate) {
      return res.status(404).json({
        creator: name,
        status: 404,
        result: { error: 'Comentario no encontrado' }
      });
    }

    // Incrementar el contador de likes
    commentToUpdate.like = (commentToUpdate.like || 0) + 1;

    fs.writeFileSync(commentsPath, JSON.stringify(existingComments, null, 2));

    res.status(200).json({
      creator: name,
      status: 200,
      result: { message: 'Reacción agregada exitosamente' }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      creator: name,
      status: 500,
      result: { error: 'Error al agregar reacción al comentario' }
    });
  }
});

// ... (Tu código existente)


router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, body, like } = req.body;
    if (!name || !body) {
      return res.status(400).json({
        creator: 'Zioo',
        status: 400,
        result: { error: 'Nombre y cuerpo del comentario son obligatorios' }
      });
    }
    const comments = JSON.parse(fs.readFileSync(commentsPath, 'utf-8'));
    const commentIndex = comments.findIndex(comment => comment.id === id);
    if (commentIndex === -1) {
      return res.status(404).json({
        creator: 'Zioo',
        status: 404,
        result: { error: 'Comentario no encontrado' }
      });
    }
    comments[commentIndex].name = name;
    comments[commentIndex].body = body;
    comments[commentIndex].like = like;
    fs.writeFileSync(commentsPath, JSON.stringify(comments, null, 2));
    res.status(200).json({
      creator: 'Zioo',
      status: 200,
      result: { message: 'Comentario actualizado exitosamente' }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      creator: 'Zioo',
      status: 500,
      result: { error: 'Error al actualizar comentario' }
    });
  }
});

module.exports = router;
