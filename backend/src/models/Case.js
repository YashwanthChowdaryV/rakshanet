const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema(
    {
        caseNumber: { type: String, unique: true },

        victim: {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            alias: String,
            anonymous: { type: Boolean, default: false },
            department: String,
        },

        incidentDate: String,
        incidentTime: String,
        platform: String,

        description: String,
        multipleInputs: [String],

        severity: {
            type: String,
            enum: ["Critical", "High", "Medium", "Low"],
            default: "Low",
        },
        severityColor: {
            type: String,
            default: "#10b981", // default green for Low
        },

        status: {
            type: String,
            enum: ["New", "Under Review", "Escalated", "Lawyer Review", "Resolved", "Closed"],
            default: "New",
        },

        aiAnalysis: {
            detectedCategories: [String],
            confidence: Number,
            summary: String,
            keywords: [String],
        },

        assignedTo: {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            role: String,
        },

        evidence: [
            {
                fileName: String,
                storedName: String,
                hash: String,
                size: Number,
            },
        ],

        timeline: [
            {
                action: String,
                actor: String,
                note: String,
                date: { type: Date, default: Date.now },
            },
        ],

        notes: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                role: String,
                text: String,
                date: { type: Date, default: Date.now },
            },
        ],

        logs: [
            {
                action: String,
                timestamp: { type: Date, default: Date.now }
            }
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Case", caseSchema);