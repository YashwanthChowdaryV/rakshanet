const AuditLog = require("../models/AuditLog");

exports.logAction = async (userData, action, caseId = null, targetUserId = null, details = "") => {
    try {
        if (!userData || !userData.id || !userData.role) return;

        await AuditLog.create({
            user: userData.id,
            role: userData.role,
            action,
            caseId,
            targetUser: targetUserId,
            details,
        });
    } catch (error) {
        console.error("Audit Logging Error:", error);
    }
};
