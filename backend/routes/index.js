var express = require('express');
var router = express.Router();
const validUrl = require("valid-url")
const { fetchURL, createTable } = require('../db/query');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/:code', async function (req, res, next) {
  try {
    const shortcode = req.params.code
    const url = await fetchURL(shortcode);
    // const result = await p
    if (url) {
      res.redirect(url);
    } else {
      res.redirect('/')
    }
  } catch (error) {
    console.error('Error fetching URL:', error);
    res.redirect('/');
  }
});


router.route('/upload').post(async function (req, res, next) {
  try {
    const url = req.body.longurl;
    if (!validUrl.isUri(url)) {
      res.status(500).send("url is not valid");
    }

    const result = await createTable(url);
    if (result) {
      res.render("show", { url: url, shorturl: result.shortUrl })
    } else {
      res.redirect('/upload')
    }
  } catch (error) {
    console.error("Error shortening url", error)
  }
})

module.exports = router;
