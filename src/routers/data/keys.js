require('../../data')
const { Router } = require('express');
const router = new Router();
const parser = require('body-parser');
const resKey = require('../edit');
const fs = require('fs/promises');
const path = require('path');

const name = global.name
const configFilePath = path.join(__dirname, '../../json/keys.json');

router.get('/', async (req, res) => {
  try {
    const configData = await fs.readFile(configFilePath, 'utf-8');
    const config = JSON.parse(configData);
    res.json({
      creator: global.name,
      status: 200,
      result: config
    }, null, 2);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      creator: global.name,
      status: 500,
      result: { error: 'Error al obtener la configuración' }
    }, null, 2);
  }
});

router.get('/:key', async (req, res) => {
  try {
    const requestedKey = req.params.key;
    const keys = await resKey.getKeys();
    
    if (!keys || !Array.isArray(keys)) {
      return res.status(500).json({
        creator: name,
        status: 500,
        result: { error: 'Error al obtener las claves' }
      });
    }

    const keyObject = keys.find(key => key.key === requestedKey);

    res.status(200).json({
      creator: name,
      status: 200,
      result: keyObject
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      creator: name,
      status: 500,
      result: { error: 'Error al procesar la clave' }
    });
  }
});


router.post('/', async (req, res) => {
  try {
    const { key, limit, status } = req.body;
    const newKey = { key, limit, status };
    await resKey.addKey(newKey);
    res.status(201).json({
      creator: name,
      status: 201,
      result: { message: 'Clave agregada exitosamente' }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      creator: name,
      status: 500,
      result: { error: 'Error al agregar la clave' }
    });
  }
});

router.put('/:key', async (req, res) => {
  const requestedKey = req.params.key;
  const { limit, status } = req.body;

  try {
    const allowedFields = ['limit', 'status'];

    // Filtra solo los campos permitidos
    const updatedFields = Object.fromEntries(
      Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
    );

    // Si no hay campos permitidos en la solicitud, retorna un error
    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({
        creator: global.name,
        status: 400,
        result: { error: 'Debe proporcionar campos válidos para actualizar' }
      });
    }

    // Actualiza la clave con los campos proporcionados
    await resKey.updateKey(requestedKey, updatedFields);

    res.status(200).json({
      creator: global.name,
      status: 200,
      result: { message: 'Clave actualizada exitosamente' }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      creator: global.name,
      status: 500,
      result: { error: 'Error al actualizar la clave' }
    });
  }
});

router.delete('/', async (req, res) => {
  try {
    const { key } = req.body;
    await resKey.deleteKey({ key });
    res.status(200).json({
      creator: name,
      status: 200,
      result: { message: 'Clave eliminada exitosamente' }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      creator: name,
      status: 500,
      result: { error: 'Error al eliminar la clave' }
    });
  }
});

module.exports = router;
