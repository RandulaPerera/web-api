const mongoose = require('mongoose');

const ServiceProviderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    serviceType: { type: String, required: true },
    contactInfo: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    servicesOffered: { type: [String], required: true },
    password: { type: String, required: true },
    rating: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true }
});

const ServiceProvider = mongoose.model('ServiceProvider', ServiceProviderSchema);
module.exports = ServiceProvider;
