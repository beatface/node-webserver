"use strict";

const imgur = require('imgur');
const fs = require('fs');

module.exports.index = (req, res) => {
	res.render('sendphoto');
};

module.exports.post = (req, res) => {
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
};
