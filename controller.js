/***************    MODULES AND CONFIGS    ******************
************************************************************/
var AWS = require('aws-sdk');
// var passport = require('passport');
// var session = require('express-session');
// var GoogleStrategy = require('passport-google-oauth2').Strategy;
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
var USER_POOL_APP_CLIENT_ID = 'fmh3mf2be83pf4igtu29fqhq3';
var USER_POOL_ID = 'us-west-2_P8tGz1Tx6';
var COGNITO_IDENTITY_POOL_ID = 'us-west-2:ea2abcb1-10a0-4964-8c13-97067e5b50bb';




/***************    SIGN UP A NEW USER    *******************
************************************************************/
exports.signup = function(req, cb) {
  // Expecting req.body to contain:
  //   username
  //   password
  //   firstName
  //   lastName
  //   email

  var poolConfig = {
    UserPoolId: USER_POOL_ID,
    ClientId: USER_POOL_APP_CLIENT_ID
  }

  var userPool = new AWS.AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolConfig);
  var attList = [];

  var username = {Name: 'username', Value: req.body.username};
  var firstname = {Name: 'firstname', Value: req.body.firstname};
  var lastname = {Name: 'lastname', Value: req.body.lastname};
  var email = {Name: 'email', Value: req.body.email};
  // var userId = {Name: 'userId', Value: req.body.userId};;

  var attUsername = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(username);
  var attFirstname = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(firstname);
  var attLastname = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(lastname);
  var attEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(email);
  // var attUserId = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(userId);

  attList.push(attUsername);
  attList.push(attFirstname);
  attList.push(attLastname);
  attList.push(attEmail);
  // attList.push(attUserId);

  userPool.signUp(req.body.username, req.body.password, attList, null, function(error, result) {
    if (error) {
      console.log('Error signing up user: ', error);
      cb(error, null);
    }
    cognitoUser = result.user;
    console.log('Sign up successful for user: ', cognitoUser.getUserName());
  });

  // Need to begin session

  // Expecting res to contain:
  //   userId
  //   session token
  cb(null, {message: 'signup response'});
};



/**************    LOG IN EXISTING USER    ******************
************************************************************/
exports.login = function(req, cb) {
  // Expecting req.body to contain:
  //   username
  //   password

  var authData = {
    Username: req.body.username,
    Password: req.body.password
  }

  var authDeets = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authData);
  var poolConfig = {
    UserPoolId: USER_POOL_ID,
    ClientId: USER_POOL_APP_CLIENT_ID
  }
  var userPool = new AWS.AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolConfig);
  var userData = {
      Username : req.body.username,
      Pool : userPool
  };
  var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

  cognitoUser.authenticateUser(authDeets, {
    onSuccess: function (result) {
      console.log('access token + ' + result.getAccessToken().getJwtToken());

      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId : COGNITO_IDENTITY_POOL_ID,
        Logins : {
          'cognito-idp.us-west-2.amazonaws.com/'+USER_POOL_ID : result.getIdToken().getJwtToken()
        }
      });

    // Instantiate aws sdk service objects now that the credentials have been updated.
    // example: var s3 = new AWS.S3();
    },
    onFailure: function(err) {
        alert(err);
    }
  });


  // Expecting res to contain:
  //   userId
  //   session token
  cb(null, {message: 'login response'});
};




/******************    LOG OUT USER    **********************
************************************************************/
exports.logout = function(req, cb) {
  // Expecting req.body to contain:
  //   username
  var poolData = { 
    UserPoolId: USER_POOL_ID,
    ClientId: USER_POOL_APP_CLIENT_ID
  };
  var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
  var userData = {
    Username : req.body.username,
    Pool : userPool
  };
  var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

  cognitoUser.signOut();

  // Expecting res to contain:
  //   "logged out"
  cb(null, {message: 'logout response'});
};