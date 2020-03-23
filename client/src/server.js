// const express = require("express");
// const cors = require("cors");

// const app = express();

// // Parse incoming json to access on event handlers.
// app.use(express.json());
// app.use(cors());

// const port = process.env.PORT;
// app.listen(port, () => {
// 	console.log("Server is up and running on port: " + port);
// });


var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');
var app = express();

var port = process.env.PORT
app.listen(port);

console.log('starting project at ' + port);
app.engine('pug', require('pug').__express);
app.set('views', '/');
app.set('view engine', 'pug');

//Look for statics first
app.use(serveStatic(path.join(__dirname, '/')));

//Return the index for any other GET request
app.get('/*', function (req, res) {
    res.sendFile('/public/index.html', {root: path.join(__dirname, '../')});
});