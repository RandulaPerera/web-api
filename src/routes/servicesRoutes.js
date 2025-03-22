const express = require("express");
const router = express.Router();
const { createService, getAllServices } = require("../controllers/servicesController");

// Routes
router.post("/", createService); // Create a service
router.get("/", getAllServices); // Get all services

module.exports = router;
