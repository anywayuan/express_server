var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// const formidable = require('express-formidable');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const process = require('process');
var cors = require("cors");

// 路由
const usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog');
const homeRouter = require('./routes/index');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(formidable())
app.use(cors()); // CORS handle
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session存储到redis
const redisClient = require('./db/redis')
const sessionStore = new RedisStore({
  client: redisClient
});
app.use(session({
  secret: 'Yuankissing715#',
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },
  store: sessionStore
}));

// 处理路由
app.use('/', homeRouter);
app.use('/api/users', usersRouter);
app.use('/api/blog', blogRouter);

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
