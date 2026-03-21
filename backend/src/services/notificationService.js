const Notification = require("../models/Notification");

exports.sendNotification = async (userId, message, type = "Info", caseId = null) => {
    try {
        if (!userId) return;

        await Notification.create({
            userId,
            message,
            type,
            caseId,
            read: false,
        });
    } catch (error) {
        console.error("Notification Sending Error:", error);
    }
};
