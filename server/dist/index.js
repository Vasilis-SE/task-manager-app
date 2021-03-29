"use strict";

var app = require('./app');

var port = process.env.PORT;
app.listen(port, function () {
  console.log("Server is up and running on port: " + port);
});