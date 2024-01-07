const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');

router.post('/upload', async (req, res) => {
  try {
    const { path } = req.body; // Espera que el cliente envíe la ruta del archivo en el cuerpo de la solicitud

    if (!fs.existsSync(path)) {
      return res.status(404).json({
        status: 404,
        result: { error: 'Archivo no encontrado' }
      });
    }

    const form = new FormData();
    form.append('file', fs.createReadStream(path));

    const response = await axios.post('https://telegra.ph/upload', form, {
      headers: form.getHeaders()
    });

    const telegraphURL = `https://telegra.ph${response.data[0].src}`;
    
    res.status(200).json({
      status: 200,
      result: { telegraphURL }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      result: { error: 'Error al procesar la solicitud de carga' }
    });
  }
});

module.exports = router;
