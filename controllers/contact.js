"use strict";

const Contact = require('../models/contacts');

module.exports.index = (req, res) => {
	res.render('contact');
};

module.exports.new = (req, res) => {

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
};
