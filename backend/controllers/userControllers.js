const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, {
    expiresIn: '3d',
  });
};

// @desc    Register new user
// @route   POST /api/users/signup
// @access  Public
const signupUser = async (req, res) => {
    const {
      email,
      password,
    } = req.body;
    try {
      if (
        !email ||
        !password
      ) {
        return res.status(400).json({error: 'Please add all fields'});
      }
      // Check if user exists
      const userExists = await User.findOne({ email });
      
      if (userExists) {
        return res.status(400).json({error: 'User already exists'});
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create user
      const user = await User.create({
        email,
        password: hashedPassword,
      });
      
      if (user) {
        // console.log(user._id);
        const token = generateToken(user._id);
        res.status(201).json({email: user.email, token});
      }
      else {
        return res.status(400).json({error: 'Invalid user data'});
      }
    } catch
      (error)
    {
      res.status(400).json({error: error.message});
    }
  }
;

// @desc    Authenticate a user
// @route   POST /api/users/signin
// @access  Public
const loginUser = async (req, res) => {
  const {email, password} = req.body;
  
  try {
    // Check for user email
    const user = await User.findOne({email});
    
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const match = await bcrypt.compare(password, user.password);
    
    if (!match) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = generateToken(user._id);
    
    res.status(200).json({ email: user.email, token });
    
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

module.exports = {
  signupUser,
  loginUser,
  getMe,
};
