const mongoose = require("mongoose");

const systemLogSchema = new mongoose.Schema(
    {
        level: { type: String, enum: ["info", "warn", "error"], default: "info" },
        type: { type: String, enum: ["REQUEST", "ERROR", "ACTION"], required: true },
        message: { type: String, required: true },
        meta: { type: mongoose.Schema.Types.Mixed },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        timestamp: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

module.exports = mongoose.model("SystemLog", systemLogSchema);
