require('../data')
const { Router } = require('express');
const router = new Router();
const parser = require('body-parser');
const resKey = require('../edit');
const fs = require('fs/promises');
const path = require('path');

const name = global.name
const configFilePath = path.join(__dirname, '../json/@zioo.json');

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

router.put('/', async (req, res) => {
  try {
    const { key, limit, status } = req.body;
    const updatedKey = { key, limit, status };
    await resKey.updateKey(updatedKey);
    res.status(200).json({
      creator: name,
      status: 200,
      result: { message: 'Clave actualizada exitosamente' }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      creator: name,
      status: 500,
      result: { error: 'Error al actualizar la clave' }
    });
  }
});

// Eliminar una clave
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
