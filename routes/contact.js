"use strict";

const express = require('express');
const router = express.Router();
const contact = require('../models/contacts');
const ctrl = require('../controllers/contact');

// contact page
router.get('/contact', ctrl.index);
router.post('/contact', ctrl.new);

module.exports = router;
