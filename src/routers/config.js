require('../config')
const { Router } = require('express');
const fs = require('fs/promises');
const path = require('path');
const router = new Router();

const configFilePath = path.join(__dirname, '../json/config.json');

router.get('/', async (req, res) => {
  try {
    const configData = await fs.readFile(configFilePath, 'utf-8');
    const config = JSON.parse(configData);
    res.json({
      creator: global.name,
      status: 200,
      result: config
    });
  } catch (error) {
      
  }
});

/* router.put('/', async (req, res) => {
  try {
    const configData = await fs.readFile(configFilePath, 'utf-8');
    let config = JSON.parse(configData);
    config = { ...config, ...req.body };
    await fs.writeFile(configFilePath, JSON.stringify(config, null, 2), 'utf-8');
    res.json({
      creator: global.name,
      status: 200,
      result: { message: 'Configuración actualizada con éxito' }
    }, null, 2);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      creator: global.name,
      status: 500,
      result: { error: 'Error al actualizar la configuración' }
    }, null, 2);
  }
}) */

module.exports = router;
