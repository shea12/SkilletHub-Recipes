/***************    MODULES AND CONFIGS    ******************
************************************************************/
var AWS = require('aws-sdk');
// var passport = require('passport');
// var session = require('express-session');
// var GoogleStrategy = require('passport-google-oauth2').Strategy;
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
var USER_POOL_APP_CLIENT_ID = '3998t3ftof3q7k5f0cqn260smk';
var USER_POOL_ID = 'us-west-2_P8tGz1Tx6';
var COGNITO_IDENTITY_POOL_ID = 'us-west-2:ea2abcb1-10a0-4964-8c13-97067e5b50bb';


/**************     AUTH HELPER FUNCTION    *****************
************************************************************/
var authorizeUser = function(authDeets, cognitoUser, callback) {
  cognitoUser.authenticateUser(authDeets, {
    onSuccess: function (result) {
      var token = result.getAccessToken().getJwtToken();
      // console.log('access token + ' + token); 
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId : COGNITO_IDENTITY_POOL_ID,
        Logins : {
          'cognito-idp.us-west-2.amazonaws.com/us-west-2_P8tGz1Tx6' : token
        }
      });
      callback(null, token);
    },
    onFailure: function(err) {
      console.log('Error in auth: ', err);
      callback(err);
    }
  });
}



/***************    SIGN UP A NEW USER    *******************
************************************************************/
exports.signup = function(req, cb) {
  AWS.config.region = 'us-west-2';
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: COGNITO_IDENTITY_POOL_ID
  });
  // AWS.config.update({accessKeyId: 'anything', secretAccessKey: 'anything'})
  var poolConfig = {
    UserPoolId: USER_POOL_ID,
    ClientId: USER_POOL_APP_CLIENT_ID
  }

  var userPool = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolConfig);
  var attList = [];
  var currentTime = Date.now().toString();

  var prefusername = {Name: 'preferred_username', Value: req.body.username};
  var firstname = {Name: 'given_name', Value: req.body.firstname};
  var lastname = {Name: 'family_name', Value: req.body.lastname};
  var email = {Name: 'email', Value: req.body.email};
  var timestamp = {Name: 'updated_at', Value: currentTime };

  var attPrefUsername = new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute(prefusername);
  var attFirstname = new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute(firstname);
  var attLastname = new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute(lastname);
  var attEmail = new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute(email);
  var attTimeStamp = new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute(timestamp);

  attList.push(attPrefUsername);
  attList.push(attFirstname);
  attList.push(attLastname);
  attList.push(attEmail);
  attList.push(attTimeStamp);

  userPool.signUp(req.body.username, req.body.password, attList, null, function(error, result) {
    if (error) {
      console.log('Error signing up user: ', error);
      cb(error, null);
    } else {
      cognitoUser = result.user;

      var authData = {
        Username: req.body.username,
        Password: req.body.password
      };
      var authDeets = new AWS.CognitoIdentityServiceProvider.AuthenticationDetails(authData);
      
      authorizeUser(authDeets, cognitoUser, function(err, token) {
        if (err) {
          console.log('Error authorizing, getting token', err);
        } else {
          cb(null, cognitoUser, token);    
        }
      });
    }
  });

};



/**************    LOG IN EXISTING USER    ******************
************************************************************/
exports.login = function(req, cb) {
  var userData = {
    Username : req.body.username,
    Pool : userPool
  };
  var cognitoUser = new AWS.CognitoIdentityServiceProvider.CognitoUser(userData);
  
  var poolConfig = {
    UserPoolId: USER_POOL_ID,
    ClientId: USER_POOL_APP_CLIENT_ID
  };
  var userPool = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolConfig);

  var authData = {
    Username: req.body.username,
    Password: req.body.password
  };
  var authDeets = new AWS.CognitoIdentityServiceProvider.AuthenticationDetails(authData);

  authorizeUser(authDeets, cognitoUser, function(err, token) {
    if (err) {
      console.log('Error authorizing, getting token', err);
    } else {
      cb(null, cognitoUser, token);    
    }
  });
};




/******************    LOG OUT USER    **********************
************************************************************/
exports.logout = function(req, cb) {
  var poolData = { 
    UserPoolId: USER_POOL_ID,
    ClientId: USER_POOL_APP_CLIENT_ID
  };
  var userPool = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
  var userData = {
    Username : req.body.username,
    Pool : userPool
  };
  var cognitoUser = new AWS.CognitoIdentityServiceProvider.CognitoUser(userData);

  cognitoUser.signOut();

  cb(null, {message: 'logout response'});
};