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

        severity: {
            type: String,
            enum: ["Critical", "High", "Medium", "Low"],
            default: "Low",
        },

        status: {
            type: String,
            enum: ["New", "Under Review", "Escalated", "Resolved", "Closed"],
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
    },
    { timestamps: true }
);

module.exports = mongoose.model("Case", caseSchema);