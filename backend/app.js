require('dotenv').config()
const express = require("express");
const cors = require("cors");

const app = express();

const userRouter = require("./routes/userRouter");
const taskRouter = require("./routes/taskRouter");

const { unknownEndpoint,errorHandler } = require("./middleware/customMiddleware");
const connectDB = require("./config/db");

// Middlewares
app.use(cors())
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

// Use the userRouter for all "/jobs" routes
app.use("/api/users", userRouter);
// Use the taskRouter for all "/tasks" routes
app.use("/api/tasks", taskRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
