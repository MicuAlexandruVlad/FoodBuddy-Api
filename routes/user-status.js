var express = require('express');
var router = express.Router();
var app = express();
var fs = require('fs');
var mongo = require('mongodb')
var mongoose = require('mongoose');
var UserStatus = require('../models/UserStatus')
var UserStatusModel = mongoose.model('UserStatusSchema', UserStatus.UserStatusSchema);
var httpStatus = require('http-status-codes');

router.post('/update-user-status', function(req, res, next) {
  var status = req.body.status;
  var userId = req.body.userId;
  UserStatusModel.updateOne({ referencedUserId: userId }).then(function(userRes) {
    console.log(userRes);
    if (userRes.length == 0) {
      res.json({ status: httpStatus.NOT_FOUND });
    }
    else {
      res.json({ status: httpStatus.OK });
    }
  }).catch(next);
});

router.get('/status-for-id', function(req, res, next) {
  var userId = req.query.userId;

  UserStatusModel.find({ referencedUserId: userId }).then(function(userArray) {
    if (userArray.length === 0) {
      res.send({ status: httpStatus.NO_CONTENT });
    }
    else {
      res.send({ status: httpStatus.OK, result: userArray });
    }
 });
});

module.exports = router;