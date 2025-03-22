const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        console.log(" Received Token:", token);  // Debugging log

        const tokenWithoutBearer = token.replace("Bearer ", "");
        const verified = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);

        console.log("Token Decoded:", verified); // Debugging log

        req.user = { userId: verified.id }; // Ensuring correct ID mapping to match BookingController

        next();
    } catch (error) {
        console.error("Token Verification Failed:", error.message); // Debugging log
        res.status(401).json({ message: 'Invalid or Expired Token' });
    }
};

module.exports = authenticateToken;
