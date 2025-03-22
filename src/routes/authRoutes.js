// authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController'); // Ensure these are correctly imported

// Routes for authentication
router.post('/signup', registerUser);
router.post('/login', loginUser);

module.exports = router;
