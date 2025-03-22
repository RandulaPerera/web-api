const Service = require("../models/service"); // Ensure the correct path

// Create a new service
exports.createService = async (req, res) => {
    try {
        const { name, description, price } = req.body;

        if (!name || !description || !price) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newService = new Service({ name, description, price });

        await newService.save();
        res.status(201).json({ message: "Service added successfully", service: newService });
    } catch (error) {
        res.status(500).json({ message: "Error adding service", error: error.message });
    }
};

// Get all services
exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving services", error: error.message });
    }
};
