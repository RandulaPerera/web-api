const express = require('express');
const router = express.Router();
const { createUser, getUserProfile, updateUserProfile } = require('../controllers/userController');
const authenticateToken = require('../middleware/authMiddleware'); // 


// Route to create a new user (signup)
router.post('/signup', createUser);

// Protected route to get user profile (requires authentication)
router.get('/profile', authenticateToken, getUserProfile);

//Update User Profile
router.put('/profile', authenticateToken, updateUserProfile);


module.exports = router;
