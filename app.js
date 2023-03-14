const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const morganLogger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config()
const indexRouter = require('./routes/index');
const app = express();
app.use(cors())
app.use(morganLogger(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT ,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  next();
});
app.use('/api', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // render the error page
  if(!err.status || err.status.toString().startsWith('5')){
    console.error({
      message: err.message,
      err
    })
  }
  res.status(err.status || 500);
  res.send({
    message: err.message,
    code: err.status,
    data: err.data,
    error: true
  });
});


module.exports = app;
