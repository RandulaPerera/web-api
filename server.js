
require("dotenv").config();
const http = require('http');  //  Fix: Import the HTTP module
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const mongoose = require('mongoose');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
console.log("stripe Key:", process.env.STRIPE_SECRET_KEY);



const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

const corsConfig={
    origin:"*",
    credentials:true,
    methods:["GET","POST"]
}
// Middleware
app.use(cors(corsConfig));
app.use(express.json()); // Middleware to parse JSON requests


// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const serviceProviderRoutes = require('./src/routes/serviceProviderRoutes'); // Ensure correct path
const bookingRoutes = require('./src/routes/bookingRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const servicesRoutes = require("./src/routes/servicesRoutes");

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/providers', serviceProviderRoutes); //
app.use('/api/bookings', bookingRoutes);
console.log("Booking routes loaded");

app.use('/api/notifications', notificationRoutes);
app.use("/api/services", servicesRoutes);


// Test route to check if the server is running


app.get('/', (req, res) => {
    res.json({ message: 'API is running...' });
});




// Create a route to generate Payment Intent
app.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body; // The amount for payment (in smallest currency unit, e.g., cents)

    try {
        // Create the payment intent using Stripe API
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,  // Amount in smallest unit (e.g., 1000 = $10)
            currency: 'usd',  // Currency type (change to the currency you're using)
            payment_method_types: ['card'],  // Accept only card payments
        });

        // Send the client secret back to the frontend
        res.status(200).send({
            clientSecret: paymentIntent.client_secret,  // Client secret used for confirming the payment on the frontend
        });
    } catch (error) {
        // Handle any error that occurred during Payment Intent creation
        res.status(500).send({ error: error.message });
    }
});


// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
