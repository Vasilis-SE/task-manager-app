const express = require("express");
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

// app.use(express.static(__dirname + "/dist"));
app.use(express.static(path.dirname(__dirname) + "/dist"));
app.get(/.*./, function (req, res) {
    res.sendFile(__dirname + "/dist/index.html");
});

app.listen(port, () => {
	// console.log(path.dirname(__dirname) + "/dist/index.html");
	// console.log(__dirname + "/dist/index.html");
	console.log(path.dirname(__dirname));
	console.log("Server is up and running on port: " + port);
});
