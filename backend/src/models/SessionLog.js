const mongoose = require("mongoose");

const sessionLogSchema = new mongoose.Schema(
    {
        sessionId: { type: String, required: true, unique: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        inputs: [String],
        results: [
            {
                text: String,
                severity: String,
                abusiveWords: [String],
                threatWords: [String],
                language: String
            }
        ],
        totalSeverity: { type: String, default: "Low" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("SessionLog", sessionLogSchema);
