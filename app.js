const express = require('express');
const app = express();
const mongoose = require('mongoose');
const serviceProviderRoutes = require('./routes/serviceProviderRoutes'); // Import your service provider routes

// Middleware to parse JSON request body
app.use(express.json());  // Replaces bodyParser.json() as it is included in Express now

// Use the service provider routes
app.use('/api/providers', serviceProviderRoutes);  // Mounting the routes under '/api/providers'

// Connect to MongoDB (replace with your connection string)
mongoose.connect('mongodb://localhost/fixup', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('Error connecting to MongoDB:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
