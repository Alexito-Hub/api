const { Router } = require('express');
const axios = require('axios');

const router = new Router();

const _twitterapi = (id) => `https://info.tweeload.site/status/${id}.json`;

const getAuthorization = async () => {
  try {
    const { data } = await axios.get("https://pastebin.com/raw/SnCfd4ru");
    return data;
  } catch (error) {
    throw new Error('Error al obtener la autorización.');
  }
};

const TwitterDL = async (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const id = url.match(/\/([\d]+)/);
      if (!id)
        return resolve({
          status: "error",
          message:
            "There was an error getting twitter id. Make sure your twitter url is correct!",
        });

      const response = await axios(_twitterapi(id[1]), {
        method: "GET",
        headers: {
          Authorization: await getAuthorization(),
          "user-agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
        },
      });

      if (response.data.code !== 200) {
        return resolve({
          status: "error",
          message: "An error occurred while sending the request.",
        });
      }

      const author = {
        id: response.data.tweet.author.id,
        name: response.data.tweet.author.name,
        username: response.data.tweet.author.screen_name,
        avatar_url: response.data.tweet.author.avatar_url,
        banner_url: response.data.tweet.author.banner_url,
      };

      let media = [];
      let type;

      if (response.data.tweet?.media?.videos) {
        type = "video";
        response.data.tweet.media.videos.forEach((v) => {
          const resultVideo = [];
          v.video_urls.forEach((z) => {
            resultVideo.push({
              bitrate: z.bitrate,
              content_type: z.content_type,
              resolution: z.url.match(/([\d ]{2,5}[x][\d ]{2,5})/)[0],
              url: z.url,
            });
          });
          if (resultVideo.length !== 0) {
            media.push({
              type: v.type,
              duration: v.duration,
              thumbnail_url: v.thumbnail_url,
              result: v.type === "video" ? resultVideo : v.url,
            });
          }
        });
      } else {
        type = "photo";
        response.data.tweet.media.photos.forEach((v) => {
          media.push(v);
        });
      }

      resolve({
        status: "success",
        result: {
          id: response.data.tweet.id,
          caption: response.data.tweet.text,
          created_at: response.data.tweet.created_at,
          created_timestamp: response.data.tweet.created_timestamp,
          replies: response.data.tweet.replies,
          retweets: response.data.tweet.retweets,
          likes: response.data.tweet.likes,
          url: response.data.tweet.url,
          possibly_sensitive: response.data.tweet.possibly_sensitive,
          author,
          type,
          media: media.length !== 0 ? media : null,
        },
      });
    } catch (error) {
      reject(error);
    }
  });
};

router.get('/', async (req, res) => {
  try {
    const url = req.query.url;
    const twitterData = await TwitterDL(url);
    res.json(twitterData);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al procesar la solicitud de Twitter.",
    });
  }
});

module.exports = router;
