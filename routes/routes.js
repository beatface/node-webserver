"use strict";

const express = require('express');
const app = express.Router();
const multer = require('multer');
const imgur = require('imgur');
const fs = require('fs');
const crypto = require('crypto');

const Contact = require('../models/contacts');

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


// calendar splash
app.get('/', function (req, res) {
	res.render('index', { myHeader: 'YO!'});
});

// contact page
app.get('/contact', function(req, res) {
	res.render('contact');
});

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




module.exports = app;
