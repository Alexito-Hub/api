require('dotenv').config()
const { Router } = require('express');
const { Configuration, OpenAIApi } = require('openai'); // Asegúrate de tener instalado el paquete

const router =new Router();

router.get('/', async (req, res) => {
  const { query } = req.query

  try {
    const openAIKey = process.env.OPENAI_KEY; // Asegúrate de que OPENAI_KEY esté definida en tu archivo .env
    const configuration = new Configuration({
      apiKey: openAIKey,
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: query,
      temperature: 0.7,
      max_tokens: 500,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 1,
    });

    res.json({
      creator: 'TeamFX',
      status: 200,
      result: response.data.choices[0].text.trim()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      creator: 'TeamFX', 
      status: false, 
      message: 'Error al procesar la consulta.'
    });
  }
});

module.exports = router;
