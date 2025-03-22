const bcrypt = require('bcrypt');
const User = require('../models/User');

// Function to create a user
const createUser = async (req, res) => {
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

        const newUser = new User({ name, email, password: hashedPassword, contactInfo, location });
        await newUser.save();

        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};







// Function to get user profile (protected route)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password'); // Exclude password from response
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user profile", error: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId; // Extract user ID from the token

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: req.body }, // Update only the fields provided
            { new: true, runValidators: true } // Return updated user & validate input
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};


module.exports = { createUser, getUserProfile, updateUserProfile,  };
