const { Router } = require('express');
const router = new Router();
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const upload = multer({ dest: 'uploads/' }); 

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { path } = req.file;

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

    fs.unlinkSync(path);

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
