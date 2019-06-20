var express = require('express');
var router = express.Router();
var app = express();
var fs = require('fs');
var mongo = require('mongodb')
var mongoose = require('mongoose');
var User = require('../models/User')
var UserModel = mongoose.model('User', User.UserSchema);
var UserImage = require('../models/UserImage')
var UserImageModel = mongoose.model('UserImage', UserImage.UserImageSchema);
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

router.get('/users-discover-5', function(req, res, next) {
  var city = req.query.userCity;
  var country = req.query.userCountry;
  var preferredGender = req.query.userPreferredGender;
  var minAge = req.query.userMinAge;
  var maxAge = req.query.userMaxAge;
  var limit = parseInt(req.query.limit);

  UserModel.find({ $and: [ { city: city, country: country, gender: preferredGender,
    age: { $gte: minAge, $lte: maxAge } } ] }, { password: 0 }).limit(limit).then(function(userArray) {
       if (userArray.length === 0) {
        res.json({ status: httpStatus.NO_CONTENT, users: userArray });
       }
       else {
        
        var ids = []
        for (let index = 0; index < userArray.length; index++) {
          const user = userArray[index];
          ids[index] = user._id;
        }
        UserImageModel.find({ userId: { $in: ids } }).then(function(userImageArray) {
          console.log(userImageArray.length);  
          var imageDataArray = []
          for (let index = 0; index < userImageArray.length; index++) {
            const image = userImageArray[index];
            var smallImagePath = image.smallProfileImagePath;
            userImageArray[index].smallProfileImagePath = readFromFile(smallImagePath);            
            userImageArray[index].normalProfileImagePath = '';
            userImageArray[index].galleryImagePath = '';
          }
          res.json({ status: httpStatus.OK, users: userArray, userImages: userImageArray });
        });
       }
    });
});

function readFromFile(path) {
  var text = fs.readFileSync(path, "utf-8");
  return text;
}

module.exports = router;
