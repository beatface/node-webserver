"use strict";

const express = require('express');
const path = require('path');
const app = express();
const { PORT } = process.env;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res) {
	res.render('index', { myTitle: 'super sick shit', myHeader: 'YO!'});
});



app.get('/hello', function (req, res) {

	console.log("PARAMS>>>>>>", req.query);
	const name = req.query.name;
	res.writeHead(PORT, {
    	"content-type": "text/html"
 	});
  	res.end(`Hello ${name}!`);
});

app.get('/random/:min/:max', (req, res) => {
	res.writeHead(PORT, {
    	"content-type": "text/html"
 	});
	const num = Math.random() * (parseInt(req.params.max) - parseInt(req.params.min)) + parseInt(req.params.min);
	res.end(`${num.toString()}`);
});


app.get('/cal', (req, res) => {
	res.writeHead(PORT, {
    	"content-type": "text/html"
 	});
	const month = require('node-cal/lib/month');
	const year = require('node-cal/lib/year');
	const params = req.query;
	if (!params.month && !params.year) {
		res.end('Please input a date query.');
	} else if (!params.month) {
		const pYear = parseInt(params.year);
		var headerYear = `${" ".repeat(29)}${pYear}`;
		// run getyearView
		var em = year.getEachMonth(pYear);
		// console.log("em", em);
		var as = year.addSpaces(em);
		// console.log("as", as);
		var sl = year.splitLines(as);
		// console.log("sl", sl);
		var cl = year.checkLength(sl)
		var mc = year.monthChunks(cl);
		console.log(mc);
		var output = year.outputYear(mc);

		console.log(output);
		let header = headerYear.replace(/ /g, '&nbsp');
		let replacedArray = output.replace(/ /g, '&nbsp').split('\n');
		const string = replacedArray.join('<br>');
		res.end(`<code>${header}<br>${string}</code>`);
	} else {
		const m = parseInt(params.month);
		const y = parseInt(params.year);
		const env = "darwin";
		if (m < 1 || y < 1753 || y > 9999 ) {
			res.end("invalid query!");
		} else {
			let fullString = `${month.headerLine(m, y, env)}\n${month.subheaderLine(m, y, env)}\n${month.numberLines(m, y, env)}`;
			let replacedArray = fullString.replace(/ /g, '&nbsp').split('\n');
			const string = replacedArray.join('<br>');
			res.end(`<code>${string}</code>`);
		}
	}

});



app.all('*', function (req, res) {
  	res.status(403);
  	res.send('Not allowed, bruh.');
});

app.listen(PORT, function () {
  console.log('Example app listening on port 3000!');
});
