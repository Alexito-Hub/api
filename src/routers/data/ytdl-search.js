const { Router } = require('express');
const ytSearch = require('yt-search');
const router = new Router();
const resKey = require('../edit'); 

router.get('/', async (req, res) => {
  try {
    const { q, key } = req.query;
    
    if (!q) {
      return res.status(400).json({
        creator: 'Ziooo',
        status: 400,
        result: { error: 'El parámetro q (consulta de búsqueda) es requerido' }
      });
    }
    
    const searchResults = await ytSearch(q);
    
    const formattedResults = searchResults.videos.map(item => ({
      type: 'video',
      title: item.title,
      url: `https://www.youtube.com/watch?v=${item.videoId}`,
      Thumbnail: item.image,
      author: { name: item.author.name, url: item.author.url },
      description: item.description,
      views: item.views,
      duration: item.duration,
      date: item.ago
    }));

    res.status(200).json({
      creator: 'Ziooo',
      status: 200,
      result: formattedResults
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      creator: 'Ziooo',
      status: 500,
      result: { error: 'Error al procesar la solicitud de búsqueda' }
    });
  }
});

module.exports = router;
