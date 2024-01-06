const { Router } = require('express');
const { translate } = require('@vitalets/google-translate-api'); // Asegúrate de tener instalado el paquete

const router = new Router();


router.get('/', async (req, res) => {
  try {
    const { text, lang } = req.query

    const translation = await translate(text, { to: lang });

    res.json({
      status: 200,
      creator: 'Zioo',
      result: translation.text
    });
  } catch (error) {
    res.json({
      creator: 'Zioo',
      status: false,
      message: '[!]' + error
    });
  }
});

module.exports = router;
