const { Router } = require('express');
const axios = require('axios');
const router = new Router();
const instagramDl = require("@sasmeee/igdl");

router.get('/', async (req, res) => {
  try {
    const { url } = req.query

    if (!url) {
      return res.status(400).json({
        creator: 'TeamFX',
        status: 400,
        message: 'La URL es requerida.'
      });
    }

    const dataList = await instagramDl(url);

    for (const result of dataList) {
      try {
        const response = await axios.get(result.download_link, { responseType: 'arraybuffer' });

        // Determinar el tipo de contenido a partir de las cabeceras HTTP
        const contentType = response.headers['content-type'];

        // Obtener la extensión de archivo basada en el tipo de contenido (MIME type)
        const fileExtension = getFileExtension(contentType);

        // Agregar la extensión al objeto result
        result.file_extension = fileExtension;
      } catch (error) {
        console.error('Error al obtener datos de descarga:', error);
        // Puedes manejar el error de manera más detallada si es necesario
      }
    }

    res.json({
      creator: 'TeamFX',
      status: 200,
      result: dataList
    });
  } catch (error) {
    console.error('Error al obtener los datos de Instagram:', error);
    res.status(500).json({ 
      creator: 'TeamFX', 
      status: false, 
      message: '[!] Error al obtener los datos de Instagram.' 
    });
  }
});

module.exports = router;

function getFileExtension(contentType) {
  switch (contentType) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/gif':
      return 'gif';
    case 'video/mp4':
      return 'mp4';
    default:
      return 'dat';
  }
}
