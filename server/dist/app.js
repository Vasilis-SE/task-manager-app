"use strict";

var express = require("express");

var cors = require("cors");

require('./database/mongoose');

var userRouter = require('./routers/user');

var taskRouter = require('./routers/task');

var groupRouter = require('./routers/group');

var app = express(); // Parse incoming json to access on event handlers.

app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(taskRouter);
app.use(groupRouter);
module.exports = app;