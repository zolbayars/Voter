'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Poll = new Schema({
  userId: String,
  username: String,
  question: String,
  voters: [{
    id: String,
    option: String
  }],
  options: [{
    userId: String,
    option: String
  }]
});

module.exports = mongoose.model('Poll', Poll);
