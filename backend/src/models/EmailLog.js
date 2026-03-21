const mongoose = require("mongoose");

const emailLogSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        companyName: {
            type: String,
        },
        hrEmail: {
            type: String,
        },
        recipient: {
            type: String, // generalized to recipient
            required: true,
        },
        caseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Case"
        },
        retryCount: {
            type: Number,
            default: 0
        },
        subject: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        offenderName: {
            type: String,
            required: true,
        },
        offenderProfile: {
            type: String,
        },
        evidenceText: {
            type: String,
        },
        status: {
            type: String,
            enum: ["Sent", "Failed", "Pending"],
            default: "Sent",
        },
        error: {
            type: String,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("EmailLog", emailLogSchema);
