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

AWS.config.region = 'us-west-2';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: COGNITO_IDENTITY_POOL_ID
});

/***************    SIGN UP A NEW USER    *******************
************************************************************/
exports.signup = function(req, res) {
  console.log('req.body: ', req.body);
  res.send(200);

  // AWS.config.update({accessKeyId: 'anything', secretAccessKey: 'anything'})
  // var poolConfig = {
  //   UserPoolId: USER_POOL_ID,
  //   ClientId: USER_POOL_APP_CLIENT_ID
  // }

  // var userPool = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolConfig);
  // var attList = [];
  // var currentTime = Date.now().toString();

  // var prefusername = {Name: 'preferred_username', Value: req.body.username};
  // var firstname = {Name: 'given_name', Value: req.body.firstname};
  // var lastname = {Name: 'family_name', Value: req.body.lastname};
  // var email = {Name: 'email', Value: req.body.email};
  // var timestamp = {Name: 'updated_at', Value: currentTime };
  // // var userId = {Name: 'userId', Value: req.body.userId};;

  // var attPrefUsername = new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute(prefusername);
  // var attFirstname = new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute(firstname);
  // var attLastname = new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute(lastname);
  // var attEmail = new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute(email);
  // var attTimeStamp = new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute(timestamp);
  // // var attUserId = new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute(userId);

  // attList.push(attPrefUsername);
  // attList.push(attFirstname);
  // attList.push(attLastname);
  // attList.push(attEmail);
  // attList.push(attTimeStamp);
  // // attList.push(attUserId);

  // userPool.signUp(req.body.username, req.body.password, attList, null, function(error, result) {
  //   if (error) {
  //     console.log('Error signing up user: ', error);
  //     cb(error, null);
  //   } else {
  //     cognitoUser = result.user;
  //     // console.log('Sign up successful for user: ', cognitoUser);

  //     var authData = {
  //       Username: req.body.username,
  //       Password: req.body.password
  //     };
  //     var authDeets = new AWS.CognitoIdentityServiceProvider.AuthenticationDetails(authData);
  //     cognitoUser.authenticateUser(authDeets, {
  //       onSuccess: function (result) {
  //         console.log('access token + ' + result.getAccessToken().getJwtToken());
  //         AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  //           IdentityPoolId : COGNITO_IDENTITY_POOL_ID,
  //           Logins : {
  //             'cognito-idp.us-west-2.amazonaws.com/us-west-2_P8tGz1Tx6' : result.getIdToken().getJwtToken()
  //           }
  //         });
  //         cb(null, cognitoUser);
  //       },
  //       onFailure: function(err) {
  //         console.log('Error in login: ', err);
  //         cb(err);
  //       }
  //     });

  //   }
  // });

};



/**************    LOG IN EXISTING USER    ******************
************************************************************/
exports.login = function(req, cb) {
  var authData = {
    Username: req.body.username,
    Password: req.body.password
  }
  var authDeets = new AWS.CognitoIdentityServiceProvider.AuthenticationDetails(authData);
  var poolConfig = {
    UserPoolId: USER_POOL_ID,
    ClientId: USER_POOL_APP_CLIENT_ID
  }
  var userPool = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolConfig);
  var userData = {
      Username : req.body.username,
      Pool : userPool
  };
  var cognitoUser = new AWS.CognitoIdentityServiceProvider.CognitoUser(userData);

  cognitoUser.authenticateUser(authDeets, {
    onSuccess: function (result) {
      console.log('access token + ' + result.getAccessToken().getJwtToken());
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId : COGNITO_IDENTITY_POOL_ID,
        Logins : {
          'cognito-idp.us-west-2.amazonaws.com/us-west-2_P8tGz1Tx6' : result.getIdToken().getJwtToken()
        }
      });
      cb(null, cognitoUser);
    },
    onFailure: function(err) {
      console.log('Error in login: ', err);
      cb(err);
    }
  });

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
  var userPool = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
  var userData = {
    Username : req.body.username,
    Pool : userPool
  };
  var cognitoUser = new AWS.CognitoIdentityServiceProvider.CognitoUser(userData);

  cognitoUser.signOut();

  // Expecting res to contain:
  //   "logged out"
  cb(null, {message: 'logout response'});
};