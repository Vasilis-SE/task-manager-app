const express = require("express");
require('./database/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

// Parse incoming json to access on event handlers.
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;