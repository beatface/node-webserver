"use strict";

const express = require('express');
const router = express.Router();
const multer = require('multer');
const imgur = require('imgur');
const fs = require('fs');
const crypto = require('crypto');


const api = require('./api');
const contact = require('./contact');
const photos = require('./photos');
const home = require('./home');

router.use(api);
router.use(contact);
router.use(photos);
router.use(home);


module.exports = router;
