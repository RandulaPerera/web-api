const mongoose = require('mongoose');

// Define the booking schema
const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Assuming you have a User model
        required: true
    },

    serviceProvider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceProvider',
        required: true
    },

    serviceType: {
        type: String,
        required: true
    },

    bookingDate: {
        type: Date,
        required: true
    },

    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },

    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },

    additionalDetails: String,
    address: {
        type: String,
        required: true
    },

    totalAmount: {
        type: Number,
        required: true
    },

    paymentMethod: {
        type: String,
        enum: ['cash', 'card' , 'stripe'],
        required: true
    }
}, { timestamps: true });

// Create the Booking model
module.exports = mongoose.model('Booking', bookingSchema);
