// authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure you have this model in place for regular users
const { body, validationResult } = require('express-validator');

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password, contactInfo, location } = req.body;
        if (!name || !email || !password || !contactInfo || !location) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            contactInfo,
            location,
        });

       // Use await to save the user without a callback
       const savedUser = await newUser.save();

       console.log('User created:', savedUser); // Verify user creation
       res.status(201).json({ message: 'User created successfully', newUser: savedUser });
   } catch (error) {
       console.error("Error registering user:", error);
       res.status(500).json({ message: 'Error registering user', error: error.message });
   }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in user', error: error.message });
    }
};

// Validate login inputs
const loginValidationRules = () => {
  return [
    body('contactInfo').notEmpty().withMessage('Contact Info is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ];
};

module.exports = { registerUser, loginUser, loginValidationRules };
