const mongoose = require("mongoose");

const counselorSessionSchema = new mongoose.Schema(
    {
        caseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Case",
            required: true,
        },

        counselor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        notes: String,

        mood: {
            type: String,
            enum: ["Stable", "Anxious", "Distressed", "Critical"],
            default: "Stable",
        },

        riskLevel: {
            type: String,
            enum: ["Low", "Medium", "High", "Critical"],
            default: "Low",
        },

        recommendation: String,

        nextSessionDate: Date,

    },
    { timestamps: true }
);

module.exports = mongoose.model(
    "CounselorSession",
    counselorSessionSchema
);