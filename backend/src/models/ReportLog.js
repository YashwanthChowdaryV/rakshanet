const mongoose = require("mongoose");

const reportLogSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        time: { type: Date, default: Date.now },
        detectedKeywords: [String],
        severityScore: { type: String, default: "Low" },
        status: { type: String, default: "Logged" },
        caseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ReportLog", reportLogSchema);
