"use strict";

const express = require('express');
const router = express.Router();
const contact = require('../models/contacts');

// contact page
router.get('/contact', function(req, res) {
	res.render('contact');
});

router.post('/contact', (req, res) => {

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

module.exports = router;
