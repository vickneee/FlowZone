const express = require("express");
const router = express.Router();

const { loginUser, signupUser } = require("../controllers/userControllers");

// login route
router.post("/signin", loginUser);

// signup route
router.post("/signup", signupUser);

module.exports = router;
