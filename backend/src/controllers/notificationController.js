const Notification = require("../models/Notification");

exports.getUserNotifications = async (req, res) => {
    try {
        const role = req.user.role;
        let filter = {};

        // For simplicity, we filter by userId as notifications will be explicitly targeted
        
        // Final Polish: Every role, including Admin, should only see targeted notifications.
        filter.userId = req.user.id;

        const notifications = await Notification.find(filter)
            .populate("caseId", "caseNumber")
            .sort({ createdAt: -1 })
            .limit(100);

        res.json(notifications);
    } catch (error) {
        console.error("Fetch Notifications Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.body; // or req.params if we do /read/:id
        
        if (id) {
            await Notification.findByIdAndUpdate(id, { read: true });
        }
        res.json({ message: "Notification marked as read" });
    } catch (error) {
        console.error("Mark Notification Read Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.user.id, read: false }, { read: true });
        res.json({ message: "All notifications marked as read" });
    } catch (error) {
        console.error("Mark All Read Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
