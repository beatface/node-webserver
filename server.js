"use strict";

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const routes = require('./routes/');
const api = require('./routes/api');

let db;

// Connection URL
if (process.env.NODE_ENV === "production") {
	var mongo_url = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PW}@${process.env.MONGODB_URL}:${process.env.MONGODB_PORT}/node-webserver-emma`;
} else {
	var mongo_url = 'mongodb://localhost:27017/node-webserver';
}
const PORT = process.env.port || 3000;
const app = express();

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
app.use(routes);
app.use(api);

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
