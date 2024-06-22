const express = require('express');
const URL = require('../models/urlModel');
const router = express.Router();
const validUrl = require('valid-url');
const shortid = require('shortid');
const dns = require('dns');
const urls = require('url');

router.post('/shorturl', async (req, res) => {
    const {url : original_url} = req.body;

    if (!validUrl.isWebUri(original_url)) {
      return res.json({ error: 'invalid url',data:original_url });
    }
  
    const hostname = urls.parse(original_url).hostname;
  
    dns.lookup(hostname, async (err) => {
      if (err) {
        return res.json({ error: 'invalid url' });
      }
  
      const shortUrl = shortid.generate();
      const newURL = new URL({ original_url: original_url, short_url: shortUrl });
  
      await newURL.save();
      res.json({ original_url: original_url, short_url: shortUrl });
    });
  });
  
  router.get('/shorturl/:short_url', async (req, res) => {
    const { short_url } = req.params;
    const urlData = await URL.findOne({ short_url });
  
    if (urlData) {
      res.redirect(urlData.original_url);
    } else {
      res.json({ error: 'No URL found' });
    }
  });
  
module.exports = router