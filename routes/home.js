"use strict";

const express = require('express');
const router = express.Router();


// calendar splash
router.get('/', function (req, res) {
	res.render('index', { myHeader: 'YO!'});
});

module.exports = router;
