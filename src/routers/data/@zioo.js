require('../../data')
const { Router } = require('express');
const fs = require('fs/promises');
const path = require('path');
const router = new Router();

const configFilePath = path.join(__dirname, '../../json/@zioo.json');

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

module.exports = router;