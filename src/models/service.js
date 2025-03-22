const mongoose = require("mongoose");

// Define the service schema
const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

// Create and export the model
const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;
