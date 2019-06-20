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
    var galleryImageData = req.body.galleryImageData;

    userImage.userId = userId;
    userImage.isProfileImage = isProfileImage;
    userImage.imageName = imageName;
    
    var dir = 'C:/Users/micua/Desktop/FoodBuddy/user_image_data/' + userId;
    if(!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    if (userImage.isProfileImage) {

      var smallProfilePath = dir + '/' + imageName + '_small';
      var normalProfilePath = dir + '/' + imageName + '_normal';
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

function writeImageDataToFile(path, data) {
  console.log(data);
  fs.writeFileSync(path, data, function(err) {
    if (err) {
      console.log('Error writing to file');
    }
    else {
      console.log('File written');
    }
  });
}

module.exports = router;