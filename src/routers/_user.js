const { Router } = require('express');
const router = new Router();
const parser = require('body-parser');
const resUser = require('../edit');

router.get('/', async (req, res) => {
  try {
    const users = await resUser.getUsers();
    res.json({
      creator: global.name,
      status: 200,
      result: { users }
    }, null, 2);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      creator: global.name,
      status: 500,
      result: { error: 'Error al obtener la información de usuarios' }
    }, null, 2);
  }
});

router.get('/:number', async (req, res) => {
  const userNumber = req.params.number;
  try {
    const user = await resUser.getUser(userNumber);
    if (user) {
      res.json({
        creator: global.name,
        status: 200,
        result: { user }
      }, null, 2);
    } else {
      res.status(404).json({
        creator: global.name,
        status: 404,
        result: { error: 'Usuario no encontrado' }
      }, null, 2);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      creator: global.name,
      status: 500,
      result: { error: 'Error al obtener el usuario' }
    }, null, 2);
  }
});

router.post('/', async (req, res) => {
  try {
    const { number, name, age, gender, email, premium = false, warning = 0, limit = 1000 } = req.body;
    if (!number || !name || !age || !gender || !email) {
      return res.status(400).json({
        creator: global.name,
        status: 400,
        result: { error: 'Todos los parámetros son requeridos' }
      });
    }
    const newUser = { number, name, age, gender, email, premium, warning, limit };
    await resUser.addUser(newUser);
    res.status(201).json({
      creator: global.name,
      status: 201,
      result: { message: 'Usuario agregado exitosamente' }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      creator: global.name,
      status: 500,
      result: { error: 'Error al agregar el usuario' }
    });
  }
});

router.put('/:number', async (req, res) => {
  const userNumber = req.params.number;
  try {
    const { name, age, gender, email, premium, warning, limit } = req.body;

    if (
      (premium !== undefined && typeof premium !== 'boolean') ||
      (warning !== undefined && typeof warning !== 'number') ||
      (limit !== undefined && typeof limit !== 'number')
    ) {
      return res.status(400).json({
        creator: global.name,
        status: 400,
        result: { error: 'Los tipos de datos de los parámetros no son correctos' }
      });
    }

    const existingUser = await resUser.getUser(userNumber);
    
    const updatedUser = {
      name: name || existingUser.name,
      age: age || existingUser.age,
      gender: gender || existingUser.gender,
      email: email || existingUser.email,
      premium: premium !== undefined ? premium : existingUser.premium,
      warning: warning !== undefined ? warning : existingUser.warning,
      limit: limit !== undefined ? limit : existingUser.limit
    };

    await resUser.updateUser(userNumber, updatedUser);
    res.status(200).json({
      creator: global.name,
      status: 200,
      result: { message: 'Usuario actualizado exitosamente' }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      creator: global.name,
      status: 500,
      result: { error: 'Error al actualizar el usuario' }
    });
  }
});


router.delete('/:number', async (req, res) => {
  const userNumber = req.params.number;
  try {
    await resUser.deleteUser(userNumber);
    res.status(200).json({
      creator: global.name,
      status: 200,
      result: { message: 'Usuario eliminado exitosamente' }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      creator: global.name,
      status: 500,
      result: { error: 'Error al eliminar el usuario' }
    });
  }
});

module.exports = router;
