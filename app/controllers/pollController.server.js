'use strict'

var Polls = require('../models/polls.js');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

function PollController(){

  this.getPolls = function(req, res){
    Polls
      .find({}, {})
      .exec(function(err, result){
        if(err){  throw err; }

        res.render("home", {
          pollList: result,
          user: req.user !== undefined ? req.user.fb : null,
        });
      });
  }

  this.getMyPolls = function(req, res){
    Polls
      .find({'userId': req.user.fb.id}, {})
      .exec(function(err, result){
        if(err){  throw err; }

        res.render("user_polls", {
          pollList: result,
          user: req.user !== undefined ? req.user.fb : null,
        });
      });
  }

  this.getPollDetail = function(req, res){

    var pollId = req.params.id;
    var requestedUrl = req.protocol + '://' + req.get('Host') + req.url;

    if(pollId !== ':id'){
      getPollById(pollId, function(error, pollResult){
        if(error){
          throw error;
        }

        res.render("poll_detail", {
            user: req.user !== undefined ? req.user.fb : null,
            poll: pollResult,
            url: requestedUrl
        });

      });
    }
  }

  this.deletePoll = function(req, res){

    var pollId = req.params.id;

    if(pollId !== ':id'){
      getPollById(pollId, function(error, pollResult){
        if(error){
          throw error;
        }

        var user = req.user !== undefined ? req.user.fb : null;
        if(user != null && user.id === pollResult.userId){

          Polls
          .findOneAndRemove({'_id': pollId}, {}, function(error, deleteResult){
            if(error){
              throw error;
            }

            if(deleteResult != null){

              res.json({
                user: user,
                display_msg: "You've successfully deleted your poll.",
                display_msg_type: "alert-success"
              });
            }else{
              res.json({
                user: user,
                display_msg: "Could not delete the poll. Try again later.",
                display_msg_type: "alert-danger"
              });
            }
          });
        }else{
          res.json({
            display_msg: "The user is not the creator of this poll!",
            display_msg_type: "alert-warning"
          });
        }

      });

    }
  }

  this.voteToPoll = function(req, res){
    console.log("vote to poll!");
    console.log(req.body);
    console.log(req.params);

    var userId = "";
    if(req.user){
      userId = req.user.fb.id;
    }else{
      var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      userId = ip;
    }


    var updatedObj = {
      voters: {
        id: userId,
        option: req.body['selected-option']
      }
    }

    if(req.body.newVoteOption){
      updatedObj = {
        voters: {
          id: userId,
          option: req.body.newVoteOption
        }
      }
      updatedObj.options = {
        userId: userId,
        option: req.body.newVoteOption
      }
    }

    var update = {
      $addToSet: updatedObj
    }

    Polls
      .findOneAndUpdate({'_id': req.params.id}, update, {'voters' : 1, new : true})
      .exec(function (err, result){
        if(err){ throw err; }

        res.json(result);
      });
  }

  this.createPoll = function(req, res){

    req.checkBody('pollTitleInput', 'Poll title required').notEmpty();
    req.sanitize('pollTitleInput').escape();
    req.sanitize('pollTitleInput').trim();

    req.checkBody('pollOptionsInput', 'Poll options required').notEmpty();
    req.sanitize('pollOptionsInput').escape();
    req.sanitize('pollOptionsInput').trim();

    var errors = req.validationErrors();

    var options = req.body.pollOptionsInput.split(/\r?\n/);
    var optionsArray = [];

    options.forEach(function(element){
      optionsArray.push({userId: req.user.fb.id, option: element});
    });

    var poll = new Polls({
      userId: req.user.fb.id,
      username: req.user.fb.displayName,
      question: req.body.pollTitleInput,
      options: optionsArray
    });

    poll.save(function (err) {
       if (err) { return next(err); }
       //Genre saved. Redirect to genre detail page
       res.redirect('/');
     });
  }

  function getPollById(id, callback){
    Polls
    .findOne({'_id': id}, {}, function(error, result){
        callback(error, result);
    });
  }

}

module.exports = PollController;
