const axios = require('axios');
const cheerio = require('cheerio');

router.get('/', async (req, res, next) => {
  const {url} = req.query
  
  mediafiredl(url)
    .then(async (data) => {
      if (!data) return res.json(errorMessages.logHandle.noturl);
      res.json({
        creator: 'TeamFX',
        status: 200,
        result: data
      });
    })
    .catch(e => {
      res.json(errorMessages.logHandle.noturl);
    });
});

async function mediafiredl(url) {
  try {
    if (!/https?:\/\/(www\.)?mediafire\.com/.test(url)) return null;
    const { data } = await axios.get(url).catch((error) => {});
    if (!data) return null;

    const $ = cheerio.load(data);
    const Url = ($('#downloadButton').attr('href') || '').trim();
    const url2 = ($('#download_link > a.retry').attr('href') || '').trim();
    const $intro = $('div.dl-info > div.intro');
    const filename = $intro.find('div.filename').text().trim();
    const filetype = $intro.find('div.filetype > span').eq(0).text().trim();
    const ext = (/\(\.(.*?)\)/.exec($intro.find('div.filetype > span').eq(1).text()) || [])[1]?.trim() || 'bin';
    const $li = $('div.dl-info > ul.details > li');
    const uploadDate = $li.eq(1).find('span').text().trim();
    const fileSizeH = $li.eq(0).find('span').text().trim();

    const result = {
      url: Url || url2,
      url2,
      filename,
      filetype,
      ext,
      uploadDate,
      fileSizeH
    };

    return result;
  } catch (error) {
    throw new Error('Error al descargar desde Mediafire');
  }
}