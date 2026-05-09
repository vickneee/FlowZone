// Imports and port assignment
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5001;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
// "mypomodoro" is the database name
mongoose.connect('mongodb://localhost:27017/mypomodoro')
  // Options to handle deprecation warnings
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
