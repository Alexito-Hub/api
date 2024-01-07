const { Router } = require('express');
const { JSDOM } = require('jsdom');
const router = new Router();

async function expandURL(shortenURL) {
  const uri = new URL(shortenURL);
  const path = uri.pathname;
  const finalUrl = `https://api.pinterest.com/url_shortener${path}/redirect/`;
  try {
    let response = await fetch(finalUrl, {
      method: "HEAD",
      redirect: "manual",
    });
    let location = response.headers.get("location");
    return location;
  } catch (error) {
    console.error(error);
    return null;
  }
}


router.get("/", async (req, res) => {
    var { url } = req.query
    try {
        if (url.match("pin.it")) url = await expandURL(url);

        const { hostname, pathname } = new URL(url);
        const path = pathname.replace("/sent/", "");
        const finalUrl = `https://${hostname}${path}`;
        const response = await fetch(finalUrl);
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        const body = await response.text();
        let outUrl;
        let type = "video";
        try {
            const video = new JSDOM(body).window.document.getElementsByTagName(
                "video"
            )[0].src;
            outUrl = video.replace("/hls/", "/720p/").replace(".m3u8", ".mp4");
        } catch (_) {
            const imgTag = new JSDOM(body).window.document.getElementsByTagName("img")[0];
            outUrl = imgTag.src;
            type = imgTag.src.endsWith(".gif") ? "gif" : "image";
        }

        const title = new JSDOM(body).window.document.querySelector('div[data-test-id="pinTitle"] h1').innerHTML;
        var desc;
        try {
            // Description may not be available
            desc = new JSDOM(body).window.document.querySelector('div[data-test-id="truncated-description"] div div span').innerHTML;
        } catch (_) {}

        console.log(outUrl);
        
        const pin = 
        res.status(200).send({
            creator: 'Zioo',
            status: 200,
            result: {
                url: outUrl,
                title: url.match("pin.it") ? "Pinterest shorten url" : "Pinterest full url",
                type: type,
                titleURL: title,
                decsURL: desc
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            creator: 'Zioo',
            status: 500,
            message: '[!] Hubo un error inesperado.'
        });
    }
});

/* router.get('/:q', async (req, res) => {
    const q = req.params.q
    try {
        const pinterestData = await pinterest(q);
        res.json({
            creator: 'Zioo',
            status: 500,
            result: pinterestData
        });
    } catch (error) {
        res.status(500).json({
            creator: 'Zioo',
            status: 500,
            message: 'Error al procesar la solicitud'
        });
    }
})

async function pinterest(query) {
  try {
    const { data } = await axios.get('https://id.pinterest.com/api/search/pins/?autologin=true&q=' + query, {
      headers: {
        "cookie" : "=; _ir=0"
      }
    });

    const $ = cheerio.load(data);
    const result = [];
    const hasil = [];

    $('div > a').get().map(b => {
      const link = $(b).find('img').attr('src');
      result.push(link);
    });

    result.forEach(v => {
      if (v == undefined) return;
      hasil.push(v.replace(/236/g, '736'));
    });

    hasil.shift();
    return hasil;
  } catch (error) {
    throw error;
  }
} */

module.exports = router;