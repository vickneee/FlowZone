require('dotenv').config()
const express = require("express");
const cors = require("cors");

const app = express();

const userRouter = require("./routes/userRouter");
const taskRouter = require("./routes/taskRouter");

const { unknownEndpoint,errorHandler } = require("./middleware/customMiddleware");

// Middlewares
app.use(cors({
  origin: "https://flowzone-dr4.pages.dev",
  credentials: true
}))
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("OK");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Use the userRouter for all "/jobs" routes
app.use("/api/users", userRouter);
// Use the taskRouter for all "/tasks" routes
app.use("/api/tasks", taskRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
