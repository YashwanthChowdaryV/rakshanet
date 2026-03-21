const mongoose = require("mongoose");

const legalConsultationSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        lawyerName: {
            type: String,
            required: true,
        },

        lawyerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        caseNumber: {
            type: String,
            required: true,
        },

        consultationType: {
            type: String,
            enum: ["Free", "Paid"],
            default: "Free",
        },

        preferredDate: String,
        preferredTime: String,

        mode: {
            type: String,
            enum: ["Video Call", "Phone Call", "In-Person"],
            default: "Video Call",
        },

        description: String,

        documents: [
            {
                fileName: String,
                storedName: String,
                size: Number,
            },
        ],

        status: {
            type: String,
            enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("LegalConsultation", legalConsultationSchema);