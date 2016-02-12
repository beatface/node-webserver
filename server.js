"use strict";

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const imgur = require('imgur');
const fs = require('fs');
const crypto = require('crypto');
const request = require('request');
const _ = require('lodash');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

let db;

// Connection URL
const mongo_url = 'mongodb://localhost:27017/node-webserver';



var storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
  	crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) { return cb(err) }
      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
})

const upload = multer({ storage: storage });


const app = express();
const { PORT } = process.env;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.locals.title = 'super sick shit';

app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(bodyParser.json());

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// calendar splash
app.get('/', function (req, res) {
	res.render('index', { myHeader: 'YO!'});
});

// contact page
app.get('/contact', function(req, res) {
	res.render('contact');
});





const contactSchema = mongoose.Schema({
    name: String,
    email: String,
    message: String
});

const Contact = mongoose.model('shit', contactSchema);

app.post('/contact', (req, res) => {

	console.log(">>>>>>>>>>>>>>>>>>>", req.body);
	const obj = new Contact({
		name: req.body.name,
		email: req.body.email,
		message: req.body.message
	});

	obj.save((err, obj) => {
		if (err) throw err;
		console.log(obj);
		res.render('contacted', { name: req.body.name });
	});
});





app.get('/send-photos', (req, res) => {
	res.render('sendphoto');
});

app.post('/send-photos', upload.single('photo'), (req, res) => {
	console.log("REQ.FILE", req.file);
	var pic = '';
	// A single image
	imgur.uploadFile(req.file.path)
    .then(function (json) {
        console.log(json.data.link);
        fs.unlink(req.file.path, () => {
        	console.log("File successfully deleted locally!");
        });
		res.render('sent', { pic: json.data.link });
    })
    .catch(function (err) {
        console.error(err.message);
		res.send('<h1>you fucked it</h1>');
    });
});

// API route
app.get('/api', (req, res) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.send({hello: "world"});
});



app.post('/api', (req, res) => {
	console.log(req.body);
	const obj = _.mapValues(req.body, val => val.toUpperCase());

	db.collection('allcaps').insertOne(obj, (err, result) => {
		if (err) throw err;
		console.log(res);
		res.send(result.ops[0]);
	});

});




// API/WEATHER route
app.get('/api/weather', (req, res) => {
	const url = "https://api.forecast.io/forecast/46e68dca4c818903bec6865e4fa6e4c1/37.8267,-122.423";
	request.get(url, (err, response, body) => {
		if (err) throw err;
		res.header('Access-Control-Allow-Origin', '*');
		res.send(JSON.parse(body));
	});
});


app.get('/api/topnews', (req, res) => {
  db.collection('news').findOne({}, (err, doc) => {
  	if (err) throw err;
  	console.log(doc);
  	res.render('topnews', { news: doc.top[0].title, url: doc.top[0].url });
  });
});





const News = mongoose.model('news', mongoose.Schema({
  top: [{title: String, url: String}]
}));



// webscraping
app.get('/api/news', (req, res) => {
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

      // db.collection('news').insertOne({ top: news }, (err, result) => {
      //   if (err) throw err;

      //   res.send(news);
      // });
    });
  });
});

mongoose.connect(mongo_url);

const datab = mongoose.connection;
datab.on('open', function() {
	console.log("mongoose open!");
	// if(err) throw err;
	app.listen(PORT, function () {
	  console.log(`Example app listening on port ${PORT}!`);
	});
	// we're connected!
});






// // Use connect method to connect to the Server ----- THIS IS WITH MONGODB DRIVER!!!!! (not mongoose)
// MongoClient.connect(mongo_url, function(err, database) {
// 	if (err) throw err;
// 	console.log("Connected correctly to server", database);

// 	db = database;

// 	app.listen(PORT, function () {
// 	  console.log(`Example app listening on port ${PORT}!`);
// 	});
// 	// db.close();
// });






// app.get('/hello', function (req, res) {

// 	console.log("PARAMS>>>>>>", req.query);
// 	const name = req.query.name;
// 	res.writeHead(PORT, {
//     	"content-type": "text/html"
//  	});
//   	res.end(`Hello ${name}!`);
// });

// app.get('/random/:min/:max', (req, res) => {
// 	res.writeHead(PORT, {
//     	"content-type": "text/html"
//  	});
// 	const num = Math.random() * (parseInt(req.params.max) - parseInt(req.params.min)) + parseInt(req.params.min);
// 	res.end(`${num.toString()}`);
// });


// app.get('/cal', (req, res) => {
// 	res.writeHead(PORT, {
//     	"content-type": "text/html"
//  	});
// 	const month = require('node-cal/lib/month');
// 	const year = require('node-cal/lib/year');
// 	const params = req.query;
// 	if (!params.month && !params.year) {
// 		res.end('Please input a date query.');
// 	} else if (!params.month) {
// 		const pYear = parseInt(params.year);
// 		var headerYear = `${" ".repeat(29)}${pYear}`;
// 		// run getyearView
// 		var em = year.getEachMonth(pYear);
// 		// console.log("em", em);
// 		var as = year.addSpaces(em);
// 		// console.log("as", as);
// 		var sl = year.splitLines(as);
// 		// console.log("sl", sl);
// 		var cl = year.checkLength(sl)
// 		var mc = year.monthChunks(cl);
// 		console.log(mc);
// 		var output = year.outputYear(mc);

// 		console.log(output);
// 		let header = headerYear.replace(/ /g, '&nbsp');
// 		let replacedArray = output.replace(/ /g, '&nbsp').split('\n');
// 		const string = replacedArray.join('<br>');
// 		res.end(`<code>${header}<br>${string}</code>`);
// 	} else {
// 		const m = parseInt(params.month);
// 		const y = parseInt(params.year);
// 		const env = "darwin";
// 		if (m < 1 || y < 1753 || y > 9999 ) {
// 			res.end("invalid query!");
// 		} else {
// 			let fullString = `${month.headerLine(m, y, env)}\n${month.subheaderLine(m, y, env)}\n${month.numberLines(m, y, env)}`;
// 			let replacedArray = fullString.replace(/ /g, '&nbsp').split('\n');
// 			const string = replacedArray.join('<br>');
// 			res.end(`<code>${string}</code>`);
// 		}
// 	}

// });



// app.all('*', function (req, res) {
//   	res.status(403);
//   	res.send('Not allowed, bruh.');
// });

