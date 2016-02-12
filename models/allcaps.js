"use strict";
const mongoose = require('mongoose');


module.exports = mongoose.model('allcaps', mongoose.Schema({}, {strict: false}));
