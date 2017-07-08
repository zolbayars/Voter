'use strict'

var path = process.cwd();
var PollController = require(process.cwd() + "/app/controllers/pollController.server.js");

module.exports = function(app, passport){

  var pollController = new PollController();

  function isLoggedIn(req, res, next){

    if(req.isAuthenticated()){
      console.log("Authenticated");
      return next(); //pass control to the next handler in middleware
    }else{
      console.log("Not Authenticated");
      res.redirect('/login');
    }
  }

  app.route('/')
    .get(pollController.getPolls);

  app.route('/login')
    .get(function(req, res){
      res.sendFile(path + '/public/login.html');
    });

  app.route('/logout')
    .get(function(req, res){
      req.logout();
      res.redirect('/');
    });

  app.route('/auth/facebook')
    .get(passport.authenticate('facebook'));

  app.route('/auth/facebook/callback')
  	.get(passport.authenticate('facebook', {
  		successRedirect: '/',
  		failureRedirect: '/login'
  	}));

  app.route('/my-polls')
    .get(isLoggedIn,  pollController.getMyPolls);

  app.route('/poll-create')
    .get(isLoggedIn,  function(req, res){
      res.sendFile(path + '/public/poll_creation.html');
    })
    .post(isLoggedIn, pollController.createPoll);

  app.route('/poll-detail/:id')
    .get(pollController.getPollDetail);

  app.route('/poll/delete/:id')
    .delete(pollController.deletePoll);

  app.route('/api/polls/vote/:id')
    .post(pollController.voteToPoll);

  // When all users have profile
  // app.route('/api/profile/:id')
  //   .get(function(req, res){
  //     if(req.user){
  //       res.json(req.user.fb);
  //     }else{
  //       res.json(null);
  //     }
  //   });
}
