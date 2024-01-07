const { Router } = require('express');
const fetch = require('node-fetch');
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

router.get("/pinterest", async (req, res) => {
    try {
        let url = req.query.url;
        if (url.match("pin.it")) {
            url = await expandURL(url);
        }

        const { hostname, pathname } = new URL(url);
        const path = pathname.replace("/sent/", "");
        const finalUrl = `https://${hostname}${path}`;
        const response = await fetch(finalUrl);

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}`);
        }

        const body = await response.text();
        let outUrl;
        let type = "video";

        try {
            const video = new JSDOM(body).window.document.getElementsByTagName("video")[0].src;
            outUrl = video.replace("/hls/", "/720p/").replace(".m3u8", ".mp4");
        } catch (_) {
            const imgTag = new JSDOM(body).window.document.getElementsByTagName("img")[0];
            outUrl = imgTag.src;
            type = imgTag.src.endsWith(".gif") ? "gif" : "image";
        }

        const title = new JSDOM(body).window.document.querySelector('div[data-test-id="pinTitle"] h1').innerHTML;

        let desc;
        try {
            desc = new JSDOM(body).window.document.querySelector('div[data-test-id="truncated-description"] div div span').innerHTML;
        } catch (_) {}

        res.status(200).send({
            url: outUrl,
            title: url.match("pin.it") ? "Pinterest shorten url" : "Pinterest full url",
            type: type,
            titleURL: title,
            decsURL: desc
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
