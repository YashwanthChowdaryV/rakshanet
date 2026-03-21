const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
    caseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Case",
        required: false,
    },
    targetUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    details: {
        type: String,
        required: false,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("AuditLog", auditLogSchema);
