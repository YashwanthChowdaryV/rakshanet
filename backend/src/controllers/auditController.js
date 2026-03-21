const AuditLog = require("../models/AuditLog");

exports.getAllLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find()
            .populate("user", "name email role")
            .populate("targetUser", "name email role")
            .sort({ timestamp: -1 })
            .limit(500); // Prevent massive response

        res.json(logs);
    } catch (error) {
        console.error("Audit Fetch Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getLogsByCaseId = async (req, res) => {
    try {
        const { id } = req.params;
        const logs = await AuditLog.find({ caseId: id })
            .populate("user", "name email role")
            .populate("targetUser", "name email role")
            .sort({ timestamp: -1 });

        res.json(logs);
    } catch (error) {
        console.error("Audit Fetch by Case Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
