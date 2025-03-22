const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const ServiceProvider = require('../models/ServiceProvider');

const providerValidationRules = () => [
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('serviceType').notEmpty().withMessage('Service Type is required').trim(),
    body('contactInfo').notEmpty().withMessage('Contact Info is required')
        .isLength({ min: 10, max: 15 }).withMessage('Contact Info must be between 10 and 15 characters'),
    body('location').notEmpty().withMessage('Location is required').trim(),
    body('servicesOffered').isArray({ min: 1 }).withMessage('At least one service must be provided'),
    body('password').notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidationRules = () => [
    body('contactInfo').notEmpty().withMessage('Contact Info is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const createProvider = async (req, res) => {
    try {
        const { name, serviceType, contactInfo, location, servicesOffered, password } = req.body;
        
        const existingProvider = await ServiceProvider.findOne({ contactInfo });
        if (existingProvider) {
            return res.status(400).json({ message: "Provider already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newProvider = new ServiceProvider({ name, serviceType, contactInfo, location, servicesOffered, password: hashedPassword });
        await newProvider.save();

        res.status(201).json({ message: 'Service provider created successfully', newProvider });
    } catch (error) {
        res.status(500).json({ message: 'Error creating service provider', error: error.message });
    }
};

const loginProvider = async (req, res) => {
    try {
        const { contactInfo, password } = req.body;
        const provider = await ServiceProvider.findOne({ contactInfo });

        if (!provider || !(await bcrypt.compare(password, provider.password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: provider._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: "Login successful", token, provider });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getProviderProfile = async (req, res) => {
    try {
        console.log("📢 GET PROFILE REQUEST RECEIVED");
        console.log("🔎 Searching for Provider with ID:", req.user.userId);

        const provider = await ServiceProvider.findById(req.user.userId);

        if (!provider) {
            console.log("Provider not found in DB");
            return res.status(404).json({ message: "Provider not found" });
        }

        console.log(" Provider Found:", provider);
        res.json(provider);
    } catch (error) {
        console.error(" Error fetching profile:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateProviderProfile = async (req, res) => {
    try {
        const updatedProvider = await ServiceProvider.findByIdAndUpdate(req.user.userId, req.body, { new: true, runValidators: true });
        res.status(200).json(updatedProvider);
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};

const deleteProvider = async (req, res) => {
    try {
        await ServiceProvider.findByIdAndDelete(req.user.userId);
        res.status(200).json({ message: "Provider deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting provider", error: error.message });
    }
};

//  Get all service providers (Fixed incorrect model reference)
const getAllProviders = async (req, res) => {
    try {
        const providers = await ServiceProvider.find();
        res.status(200).json(providers);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

//  Get a provider by ID (Fixed incorrect model reference)
const getProviderById = async (req, res) => {
    try {
        const providerId = req.params.id.trim(); // Remove any extra spaces

        if (!mongoose.Types.ObjectId.isValid(providerId)) {
            return res.status(400).json({ message: "Invalid provider ID format" });
        }

        const provider = await ServiceProvider.findById(providerId);

        if (!provider) {
            return res.status(404).json({ message: "Provider not found" });
        }

        res.status(200).json(provider);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


const updateAvailability = async (req, res) => {
    try {
        const provider = await ServiceProvider.findById(req.user.userId);
        if (!provider) return res.status(404).json({ message: "Provider not found" });

        provider.availability = req.body.availability;
        await provider.save();
        res.status(200).json({ message: "Availability updated", provider });
    } catch (error) {
        res.status(500).json({ message: "Error updating availability", error: error.message });
    }
};

// ✅ Export all functions properly
module.exports = {
    createProvider,
    loginProvider,
    getProviderProfile,
    updateProviderProfile,
    deleteProvider,
    getAllProviders,
    providerValidationRules,
    handleValidationErrors,
    loginValidationRules,
    updateAvailability,
    getProviderById
};
