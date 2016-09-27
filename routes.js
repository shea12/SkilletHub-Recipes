var usersRouter = require('express').Router();
var usersController = require('./controller.js');


usersRouter.route('/login').get(function(req, res) {
  usersController.login(req, function(error, data) {
  	if (error) {
  	  console.log('error in /user/login route');
  	  res.send(400);
  	} else {
  	  res.status(200).json(data);
  	}
  });
});

usersRouter.route('/logout').get(function(req, res) {
  usersController.logout(req, function(error, data) {
  	if (error) {
  	  console.log('error in /user/logout route');
  	  res.send(400);
  	} else {
  	  res.status(200).json(data);
  	}
  });
});

usersRouter.route('/signup').post(function(req, res) {
  usersController.signup(req, function(error, data) {
  	if (error) {
  	  console.log('error in /user/signup route');
  	  res.send(400);
  	} else {
  	  res.status(200).json(data);
  	}
  });
});


module.exports = usersRouter;