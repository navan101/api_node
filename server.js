// server.js

// START THE SERVER
// =============================================================================
var app = require('./app');
var port = process.env.PORT || 3000; // set our port

var server = app.listen(port, function() {
  console.log('Magic happens on port ' + port);
});
