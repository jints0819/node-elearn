var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
//async = require('async');


var { mongodbURI } = require('./config/database');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var session = require('express-session');
var expressValidator = require('express-validator');
var passport = require('passport');
var localStrategy = require('passport-local');
var flash = require('connect-flash');
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;


mongoose.connect(mongodbURI).then((db) => {
    console.log('Mongodb connected');
}).catch((err) => {
    console.log('DB error:'+ err);
    });


var db = mongoose.connection;

var index = require('./routes/index');
var users = require('./routes/users');
var classes = require('./routes/classes');
var students = require('./routes/students');
var instructors = require('./routes/instructors');


var app = express();


const { equals, equalt } = require('./helpers/handlebar-helpers');
//const { equalt } = require('./helpers/handlebar-helpers');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'layout', helpers: { equals: equals, equalt: equalt } }));
app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Connect-Flash
app.use(flash());


// Makes the user object global in all views
app.get('*', function (req, res, next) {
    // put user into res.locals for easy access from templates
    res.locals.user = req.user || null;
    if (req.user) {
        res.locals.type = req.user.type;
    }
    next();
});


// Global Vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


app.use('/', index);
app.use('/users', users);
app.use('/classes', classes);
app.use('/students', students);
app.use('/instructors', instructors);


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
