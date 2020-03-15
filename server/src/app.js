const express = require("express");
const cors = require("cors");
require('./database/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const groupRouter = require('./routers/group');

const app = express();

// Parse incoming json to access on event handlers.
app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(taskRouter);
app.use(groupRouter);

module.exports = app;