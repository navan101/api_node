// call the packages we need
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require("body-parser");
const path = require('path');
var mongoose = require("mongoose");
var config = require("./config");
var logger = require('./logger');
var _ = require('lodash');
var morgan = require('morgan');

//configuration
mongoose.connect(config.database); // connect to database
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  // we're connected!
});

// Enable logger (morgan) if enabled in the configuration file
if (_.has(config, 'log.format')) {
  app.use(morgan(logger.getLogFormat(), logger.getMorganOptions()));
}
app.use(morgan('dev'));


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    return res.status(200).json({});
  }
  next();
});

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
var user = require("./api/routes/user");
//var authenticate = require("./server/routes/authenticate");
var about = require("./api/routes/about");
var products = require('./api/routes/products');

app.use("/api", user);
//app.use("/api", authenticate);
app.use("/api", about);
app.use('/api', products);

// Send all other requests to the Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/main.bundle.js'));
});

//error handler
// Mount 404 handler as penultimate middleware
app.use(function (req, res, next) {
  var error = new Error('Not Found');
  error.status = 404;
  next(error);
});
// Mount 404 handler as penultimate middleware
app.use(function (req, res, next) {
  var error = new Error('Bab Request');
  error.status = 400;
  next(error);
});

//Final middleware is our catch-all error handler
app.use(function (error, req, res, next) {
  console.log(error.status)
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;