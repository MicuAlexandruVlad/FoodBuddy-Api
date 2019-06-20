var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var UserImageSchema = new mongoose.Schema({

    userId: { type: String, unique: false, required: [true, "can't be blank"] },
    imageName: { type: String, unique: true, required: [true, "Can't be blank"] },
    isProfileImage: { type: Boolean, unique: false, required: [true, "can't be blank"] },
    normalProfileImagePath: { type: String, unique: false },
    smallProfileImagePath: { type: String, unique: false },
    galleryImagePath: { type: String, unique: false }
  }, {timestamps: true});

module.exports = mongoose.model('UserImage', UserImageSchema);