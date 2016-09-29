var router = require('express').Router();
var users = require('./controller.js');

router.route('/signup').post(users.signup);
router.route('/login').post(users.login);
router.route('/logout').post(users.logout);

module.exports = router;
