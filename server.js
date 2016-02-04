"use strict";

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const imgur = require('imgur');
const fs = require('fs');
const crypto = require('crypto');

var storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
  	crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) { return cb(err) }
      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })

    // cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage });


const app = express();
const { PORT } = process.env;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.locals.title = 'super sick shit';

// app.use(bodyParser.urlencoded({
// 	extended: false
// }));

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

app.post('/contact', (req, res) => {
	res.render('contacted', { name: req.body.name });
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

app.listen(PORT, function () {
  console.log('Example app listening on port 3000!');
});
