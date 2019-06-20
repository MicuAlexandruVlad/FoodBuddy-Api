var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var UserSchema = new mongoose.Schema({
    email: { type: String, lowercase: true, unique: true, required: [true, "can't be blank"],
            match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
    password: { type: String, required: [true, "can't be blank"] },
    firstName: { type: String },
    lastName: { type: String },
    bio: { type: String },
    gender: { type: String },
    age: { type: Number },
    city: { type: String },
    country: { type: String },
    eatTimePeriods: { type: String },
    eatTimes: { type: Number },
    birthDate: { type: String },
    genderToMeet: { type: String },
    maxAge: { type: Number },
    minAge: { type: Number },
    profileSetupComplete: { type: Boolean },
    student: { type: Boolean },
    zodiac: { type: String },
    college: { type: String }

  }, {timestamps: true});

module.exports = mongoose.model('User', UserSchema);