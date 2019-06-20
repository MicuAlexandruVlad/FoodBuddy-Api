var express = require('express');
var router = express.Router();
var app = express();
var mongo = require('mongodb')
var mongoose = require('mongoose');
var User = require('../models/User')
var UserModel = mongoose.model('User', User.UserSchema);
var httpStatus = require('http-status-codes');

/* GET users listing. */
router.post('/login-email', function(req, res, next) {

  UserModel.find({ email: req.body.email }).then(function(userRes) {
    console.log(userRes);
    if (userRes.length == 0) {
      res.json({ status: httpStatus.NOT_FOUND, user: {} });
    }
    else {
      console.log('New login from -> ' + userRes[0].email );
      console.log(userRes[0] instanceof UserModel);
      res.json({ status: httpStatus.OK, user: userRes });
    }
  }).catch(next);
});

router.post('/register-user-email', (req, res, next) => {
  var user = new UserModel();

  UserModel.find({ email: req.body.email }).then(function(userRes) {
    if (userRes.length == 0) {
      console.log('User not in db');
      user.email = req.body.email;
      user.password = req.body.password;
      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.bio = req.body.bio;
      user.gender = req.body.gender;
      user.age = req.body.age;
      user.city = req.body.city;
      user.country = req.body.country;
      user.eatTimePeriods = req.body.eatTimePeriods;
      user.eatTimes = req.body.eatTimes;
      user.birthDate = req.body.birthDate;
      user.genderToMeet = req.body.genderToMeet;
      user.maxAge = req.body.maxAge;
      user.minAge = req.body.minAge;
      user.profileSetupComplete = req.body.profileSetupComplete;
      user.student = req.body.student;
      user.zodiac = req.body.zodiac;
      user.college = req.body.college;

      user.save().then(function(user) {
        console.log('User saved with id ' + user.id);
        res.json({ status: httpStatus.CREATED, id: user.id });
      });
    }
    else {
      console.log('User in db');
       res.json({ status: httpStatus.CONFLICT });
    }
  });
});

router.post('/update-user-data', function(req, res, next) {
  UserModel.find({ _id: new mongo.ObjectID(req.body._id) }).then(function(userRes) {
    var user = userRes[0];
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.bio = req.body.bio;
    user.gender = req.body.gender;
    user.age = req.body.age;
    user.city = req.body.city;
    user.country = req.body.country;
    user.eatTimePeriods = req.body.eatTimePeriods;
    user.eatTimes = req.body.eatTimes;
    user.birthDate = req.body.birthDate;
    user.genderToMeet = req.body.genderToMeet;
    user.maxAge = req.body.maxAge;
    user.minAge = req.body.minAge;
    user.profileSetupComplete = req.body.profileSetupComplete;
    user.student = req.body.student;
    user.zodiac = req.body.zodiac;
    user.college = req.body.college;

    user.save().then(function(user) {
      console.log('User saved with id ' + user.id);
      res.json({ status: httpStatus.OK });
    });
  }).catch(next);
});

module.exports = router;
