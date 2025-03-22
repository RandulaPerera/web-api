const Notification = require('../models/notification');

//Send a notification
exports.sendNotification = async (req, res) => {
    try {

        console.log("Received request body:", req.body); // Debugging

        const { userId, title, message, type } = req.body;
        if (!userId || !title || !message || !type) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const notification = new Notification({ userId, title, message, type });
        await notification.save();

        res.status(201).json({ message: "Notification sent successfully", notification });
    } catch (error) {
        console.error("Error sending notification:", error);
        res.status(500).json({ message: "Error sending notification", error });
    }
};

//notifications for user
exports.getUserNotifications = async (req, res) => {
    try {
        const userId = req.params.userId;
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving notifications", error });
    }
};


//marking a notification as read
exports.markAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const notification = await Notification.findById(notificationId);
        
        
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        
        notification.status = 'read';
        await notification.save();


        res.status(200).json({ message: "Notification marked as read", notification });
    } catch (error) {
        res.status(500).json({ message: "Error updating notification", error: error.message});
    }
};



//delete a notification
exports.deleteNotification = async (req, res) => {
    try {
        const notificationId = req.params.id;
        await Notification.findByIdAndDelete(notificationId);

        
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }


        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting notification", error: error.message });
    }
};