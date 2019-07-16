var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var UserStatusSchema = new mongoose.Schema({
    referencedUserId: { type: String, unique: true, required: [true, "can't be blank"], index: true },
    status: { type: Number,  },
    changedAt: { type: String }

  }, {timestamps: true});

module.exports = mongoose.model('UserStatusSchema', UserStatusSchema);