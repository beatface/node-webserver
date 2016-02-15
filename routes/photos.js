"use strict";

const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');
const ctrl = require('../controllers/photos');

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

router.get('/send-photos', ctrl.index);

router.post('/send-photos', upload.single('photo'), ctrl.post);

module.exports = router;
