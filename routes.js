var usersRouter = require('express').Router();
var usersController = require('./controller.js');

usersRouter.route('/signup').post(function(req, res) {
  usersController.signup(req, function(error, userData, token) {
  	if (error) {
  	  console.log('error in /user/signup route');
  	  res.send(400);
  	} else {
  	  console.log('token: ', token);
  	  res.status(200).json(userData);
  	}
  });
});

usersRouter.route('/login').post(function(req, res) {
  usersController.login(req, function(error, userData, token) {
  	if (error) {
  	  console.log('error in /user/login route');
  	  res.send(400);
  	} else {
  	  console.log('token: ', token);
  	  res.status(200).json(userData);
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



module.exports = usersRouter;