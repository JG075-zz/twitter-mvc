// ODM With Mongoose
var mongoose = require('mongoose');
// Modules to store session
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
// Import Passport and Warning Flash modules
var passport = require('passport');
var flash = require('connect-flash');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index  = require('./server/routes/index');
var users = require('./server/routes/users');

// Import comments controller
var comments = require('./server/controllers/comments');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'server/views/pages'));
app.set('view engine', 'ejs');

// Database configuration
var config = require('./server/config/config.js');
// connect to our databse
mongoose.connect(config.url);
// Check if MongoDB is running
mongoose.connection.on('error', function(){
  console.log('MongoDB Connection Error. Make sure MongoDB is running');
});

// Passport Configuration
require('./server/config/passport')(passport);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
// secret for session
app.use(session({
  secret: 'sometextgohere',
  saveUninitialized: true,
  resave: true,
  // store session on MongoDB using express-session + connect-mongo
  store: new MongoStore({
    url: config.url,
    collection: 'sessions'
  })
}));

// Init passport authentication
app.use(passport.initialize());
// persistent login sessions
app.use(passport.sessions());
// flash message
app.use(flash());

app.use('/', index);
app.use('/users', users);

// Setup routes for comments
app.get('/comments', comments.hasAuthorization, comments.list);
app.post('/comments', comments.hasAuthorization, comments.create);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;

app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' +
  server.address().port);
});
