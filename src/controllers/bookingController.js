const Booking = require('../models/Booking');
const Notification = require('../models/notification'); 

// Create new booking
const createBooking = async (req, res) => {
    console.log("Booking route reached");
    console.log("Received Data:", req.body);
    try {
        const { user, serviceProvider, serviceType, bookingDate, additionalDetails,address, totalAmount, paymentMethod } = req.body;

        if (!user || !serviceProvider || !serviceType || !bookingDate || !address || !totalAmount || !paymentMethod) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newBooking = new Booking({
            user,
            serviceProvider,
            serviceType,
            bookingDate,
            additionalDetails,
            address,
            totalAmount,
            paymentMethod,
            status: "pending", // Set default status
            paymentStatus: "pending" // Set default payment status
        });

        await newBooking.save();
        res.status(201).json({ message: 'Booking created successfully', newBooking });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
};

// booking ID
const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('user serviceProvider')
            .exec(); // Ensure proper execution

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(booking);
    } catch (error) {
        console.error("Error getting booking:", error);
        res.status(500).json({ message: 'Error getting booking', error });
    }
};



// Update booking status (pending to confirmed)
const updateBookingStatus = async (req, res) => {
    try {
        const { status, paymentStatus } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.bookingId,
            { status, paymentStatus },
            { new: true }
        ).populate('user'); // Populate user details 

        if (!updatedBooking) return res.status(404).json({ message: 'Booking not found' });
        
        // Determine notification message and type
        let notificationMessage = "";
        let notificationType = "";
 
        switch (status) {
            case "confirmed":
                notificationMessage = `Your booking #${updatedBooking._id} has been confirmed.`;
                notificationType = "order_accepted";
                break;
            case "ongoing":
                notificationMessage = `Your service is in progress.`;
                notificationType = "order_ongoing";
                break;
            case "completed":
                notificationMessage = `Your booking #${updatedBooking._id} has been completed.`;
                notificationType = "order_completed";
                break;
            case "cancelled":
                notificationMessage = `Your booking #${updatedBooking._id} has been cancelled.`;
                notificationType = "order_cancelled";
                break;
        }


        
       // Send notification to the user
       if (notificationMessage) {
        await new Notification({
            userId: updatedBooking.user._id,
            title: "Booking Update",
            message: notificationMessage,
            type: notificationType
        }).save();
    }

    console.log("[BookingController] Booking Status Updated Successfully");
    res.status(200).json({ message: 'Booking status updated successfully', updatedBooking });
} catch (error) {
    console.error("[BookingController] Error updating booking:", error);
    res.status(500).json({ message: 'Error updating booking', error: error.message });
}
};

        

 // Get all bookings for a specific user
const getBookingsForUser = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.params.userId }).populate('serviceProvider');
        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found for this user' });
        }
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({ message: 'Error fetching user bookings', error: error.message });
    }
};



// Get all bookings for a specific service provider
const getBookingsForServiceProvider = async (req, res) => {
    try {
        const bookings = await Booking.find({ serviceProvider: req.params.providerId }).populate('user').exec();
        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found for this provider' });
        }
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching provider bookings:", error);
        res.status(500).json({ message: 'Error fetching provider bookings', error: error.message });
    }
};



// Get all bookings
const getAllBookings = async (req, res) => {
    console.log("[BookingController] Fetching All Bookings");
    try {
        const bookings = await Booking.find().populate('user serviceProvider');
        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: 'No bookings found' });
        }
        res.status(200).json(bookings);
    } catch (error) {
        console.error("[BookingController] Error fetching bookings:", error);
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
};

// Export the functions
module.exports = {
    createBooking,
    getBookingById,
    updateBookingStatus,
    getBookingsForUser,
    getBookingsForServiceProvider,
    getAllBookings
};
