const mongoose = require("mongoose");

const nlpLogSchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
        language: { type: String, default: "English" },
        abusiveWords: [String],
        threatWords: [String],
        severityScore: { type: String, default: "Low" },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        timestamp: { type: Date, default: Date.now },
        sessionId: { type: String }
    },
    { timestamps: true }
);

module.exports = mongoose.model("NLPLog", nlpLogSchema);
