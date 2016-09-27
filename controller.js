var AWS = require('aws-sdk');
var passport = require('passport');
var session = require('express-session');
var GoogleStrategy = require('passport-google-oauth2').Strategy;

var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;


exports.login = function (cb) {



  //cb takes (err, data)
  cb(null, {message: 'login response'});
};

exports.logout = function (cb) {
  //cb takes (err, data)
  cb(null, {message: 'logout response'});
};

exports.signup = function (cb) {
  //cb takes (err, data)
  cb(null, {message: 'signup response'});
};