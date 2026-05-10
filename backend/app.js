require('dotenv').config()
const express = require("express");
const app = express();
const userRouter = require("./routes/userRouter");
const taskRouter = require("./routes/taskRouter");
const { unknownEndpoint,errorHandler } = require("./middleware/customMiddleware");
const connectDB = require("./config/db");
const cors = require("cors");

// Middlewares
app.use(cors())
app.use(express.json());

connectDB().catch((err) => {
  console.error("Database connection failed:", err);
});

// Serve the static files from the React app (frontend) in the dist folder
app.use(express.static('view'))

// Use the userRouter for all "/jobs" routes
app.use("/api/users", userRouter);
// Use the taskRouter for all "/tasks" routes
app.use("/api/tasks", taskRouter);

// Path
app.get((req, res) => {
  res.sendFile(__dirname + '/view/index.html');
});

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
