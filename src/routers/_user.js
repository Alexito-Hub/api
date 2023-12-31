const { Router } = require('express');
const router = new Router();
const fs = require('fs/promises');
const path = require('path');

const usersFilePath = path.join(__dirname, '../json/_user.json');

router.get('/', async (req, res) => {
  try {
    const usersData = await fs.readFile(usersFilePath, 'utf-8');
    const users = JSON.parse(usersData);

    res.json({
      creator: global.name,
      status: 200,
      result: users
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      creator: global.name,
      status: 500,
      result: { error: 'Error al obtener usuarios' }
    });
  }
});


router.post('/', async (req, res) => {
  try {
    const { number, name, gender, age, email } = req.body;
    
    const newUser = {
      number,
      name,
      gender,
      age,
      email,
      warning: 0,
      limit: 100,
    };

    const usersData = await fs.readFile(usersFilePath, 'utf-8');
    const users = JSON.parse(usersData);

    users.push(newUser);

    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));

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
      result: { error: 'Error al agregar usuario' }
    });
  }
});

router.get('/:number', async (req, res) => {
  try {
    const userNumber = req.params.number;

    const usersData = await fs.readFile(usersFilePath, 'utf-8');
    const users = JSON.parse(usersData);

    const user = users.find(user => user.number === userNumber);

    if (user) {
      res.json({
        creator: global.name,
        status: 200,
        result: user
      });
    } else {
      res.status(404).json({
        creator: global.name,
        status: 404,
        result: { error: 'Usuario no encontrado' }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      creator: global.name,
      status: 500,
      result: { error: 'Error al obtener usuario' }
    });
  }
});

router.put('/:number', async (req, res) => {
  try {
    const userNumber = req.params.number;
    const { name, gender, age, email, warning, limit } = req.body;

    const usersData = await fs.readFile(usersFilePath, 'utf-8');
    const users = JSON.parse(usersData);

    const userIndex = users.findIndex(user => user.number === userNumber);

    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        name,
        gender,
        age,
        email,
        advertencia: warning !== undefined ? warning : users[userIndex].advertencia,
        limit: limit !== undefined ? limit : users[userIndex].limit,
      };

      await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));

      res.json({
        creator: global.name,
        status: 200,
        result: { message: 'Usuario actualizado exitosamente' }
      });
    } else {
      res.status(404).json({
        creator: global.name,
        status: 404,
        result: { error: 'Usuario no encontrado' }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      creator: global.name,
      status: 500,
      result: { error: 'Error al actualizar usuario' }
    });
  }
});

router.delete('/:number', async (req, res) => {
  try {
    const userNumber = req.params.number;

    const usersData = await fs.readFile(usersFilePath, 'utf-8');
    const users = JSON.parse(usersData);

    const updatedUsers = users.filter(user => user.number !== userNumber);

    if (users.length !== updatedUsers.length) {
      await fs.writeFile(usersFilePath, JSON.stringify(updatedUsers, null, 2));

      res.json({
        creator: global.name,
        status: 200,
        result: { message: 'Usuario eliminado exitosamente' }
      });
    } else {
      res.status(404).json({
        creator: global.name,
        status: 404,
        result: { error: 'Usuario no encontrado' }
      });
    }
  } catch (error) {
    console.error(error);

    res.status(500).json({
      creator: global.name,
      status: 500,
      result: { error: 'Error al eliminar usuario' }
    });
  }
});


module.exports = router;

