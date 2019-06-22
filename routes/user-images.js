var express = require('express');
var router = express.Router();
var app = express();
var mongo = require('mongodb')
var mongoose = require('mongoose');
var Model = require('../models/UserImage')
var UserImageModel = mongoose.model('UserImage', Model.UserImageSchema);
var httpStatus = require('http-status-codes');
var fs = require('fs');
var atob = require('atob');


router.post('/upload-user-image', function(req, res, next) {
    var userImage = new UserImageModel();

    var userId = req.body.userId;
    var imageName = req.body.imageName;
    var isProfileImage = req.body.isProfileImage;
    var normalProfileImageData = req.body.normalProfileImageData;
    var smallProfileImageData = req.body.smallProfileImageData;

    userImage.userId = userId;
    userImage.isProfileImage = isProfileImage;
    userImage.imageName = imageName;
    
    var dir = 'C:/Users/micua/Desktop/FoodBuddy Image Data/user_image_data/' + userId;
    if(!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    if (userImage.isProfileImage) {

      var smallProfilePath = dir + '/' + imageName + '_small.jpg';
      var normalProfilePath = dir + '/' + imageName + '_normal.jpg';
      writeImageDataToFile(smallProfilePath, smallProfileImageData);
      writeImageDataToFile(normalProfilePath, normalProfileImageData);
      userImage.smallProfileImagePath = smallProfilePath;
      userImage.normalProfileImagePath = normalProfilePath;
      userImage.galleryImagePath = '';
      userImage.save().then(function(userImage) {
        console.log('User image saved with id ' + userImage.id);
        res.json({ status: httpStatus.CREATED });
      });
    }
});

router.get('/profile-small/:userId/images/:imageId/', function(req, res, next){
  console.log(req.params.userId);
  console.log(req.params.imageId);
  UserImageModel.findOne({ _id: new mongo.ObjectID(req.params.imageId) }, 
  { __v: 0, createdAt: 0, updatedAt: 0, galleryImagePath: 0 }).then(function(imageRes) {
      res.sendFile(imageRes.smallProfileImagePath);
  });
  
});

router.get('/profile-normal/:userId/images/:imageId/', function(req, res, next){
  console.log(req.params.userId);
  console.log(req.params.imageId);
  UserImageModel.findOne({ _id: new mongo.ObjectID(req.params.imageId) }, 
  { __v: 0, createdAt: 0, updatedAt: 0, galleryImagePath: 0 }).then(function(imageRes) {
      res.sendFile(imageRes.normalProfileImagePath);
  });
  
});

function writeImageDataToFile(path, data) {
  console.log(data);
  fs.writeFileSync(path, data, "base64", function(err) {
    if (err) {
      console.log('Error writing to file');
    }
    else {
      console.log('File written');
    }
  });
}

function readFromFile(path) {
  var text = fs.readFileSync(path, "base64");
  return text;
}

module.exports = router;