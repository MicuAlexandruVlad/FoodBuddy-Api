var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var MongoClient = require('mongodb').MongoClient
var logger = require('morgan');
var admin = require('firebase-admin');
var gson = require('gson');


const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userImagesRouter = require('./routes/user-images');

var app = express();
var server = app.listen(4000);
var io = require('socket.io').listen(server);

var serviceAccount = require("./foodbuddy-9d4a9-firebase-adminsdk-9vuuo-8036f05386.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://foodbuddy-9d4a9.firebaseio.com"
});

var defaultMessaging = admin.messaging();

mongoose.connect('mongodb://:@localhost:27017/FoodBuddy', { useNewUrlParser: true });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/user-images', userImagesRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

io.on('connection', function(socket) {
  console.log('User connected -> ' + socket.id);
  socket.on('chat', function(message) {
    if (message.type == 1) {
      // text message
      console.log(message);
      var payload = {
        data: {
          data: gson.stringify(message)
        },
        topic: message.conversationId,
      };

      defaultMessaging.send(payload)
        .then((response) => {
          // Response is a message ID string.
          console.log('Successfully sent message:', response);
        })
        .catch((error) => {
          console.log('Error sending message:', error);
        });
    }

  });
});

module.exports = app;
