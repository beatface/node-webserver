"use strict";

const express = require('express');
const router = express.Router();
const _ = require('lodash');
const cheerio = require('cheerio');
const request = require('request');
const Allcaps = require('../models/allcaps');
const News = require('../models/news');

// API route
router.get('/api', (req, res) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.send({hello: "world"});
});

router.post('/api', (req, res) => {
	console.log(req.body);
	const obj = new Allcaps(_.mapValues(req.body, val => val.toUpperCase()));

	obj.save((err, result) => {
		if (err) throw err;
		console.log(result);
		res.send(result);
	});

});

// API/WEATHER route
router.get('/api/weather', (req, res) => {
	const url = "https://api.forecast.io/forecast/46e68dca4c818903bec6865e4fa6e4c1/37.8267,-122.423";
	request.get(url, (err, response, body) => {
		if (err) throw err;
		res.header('Access-Control-Allow-Origin', '*');
		res.send(JSON.parse(body));
	});
});


router.get('/api/topnews', (req, res) => {
	News.findOne().sort('-_id').exec((err, doc) => {
	    if (err) throw err;

	    res.render('topnews', { news: doc.top[0].title, url: doc.top[0].url });
	});
});


// webscraping
router.get('/api/news', (req, res) => {
  News.findOne().sort('-_id').exec((err, doc) => {
    if (err) throw err;

    if (doc) {
      const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;
      const diff = new Date() - doc._id.getTimestamp() - FIFTEEN_MINUTES_IN_MS;
      const lessThan15MinutesAgo = diff < 0;

      if (lessThan15MinutesAgo) {
        res.send(doc);
        return;
      }
    }

    const url = 'http://cnn.com';

    request.get(url, (err, response, html) => {
      if (err) throw err;

      const news = [];
      const $ = cheerio.load(html);

      const $bannerText = $('.banner-text');

      news.push({
        title: $bannerText.text(),
        url: url + $bannerText.closest('a').attr('href')
      });

      const $cdHeadline = $('.cd__headline');

      _.range(1, 12).forEach(i => {
        const $headline = $cdHeadline.eq(i);

        news.push({
          title: $headline.text(),
          url: url + $headline.find('a').attr('href')
        });
      });
    const obj = new News({ top: news });
    obj.save((err, result) => {
        if (err) throw err;

        res.send(news);
     });

    });
  });
});

module.exports = router;
