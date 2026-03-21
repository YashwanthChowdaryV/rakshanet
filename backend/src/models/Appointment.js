const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        counselorName: {
            type: String,
            required: true,
        },

        counselorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        date: {
            type: String,
            required: true,
        },

        time: {
            type: String,
            required: true,
        },

        sessionType: {
            type: String,
            enum: ["In-Person", "Video Call", "Phone Call"],
            default: "In-Person",
        },

        reason: {
            type: String,
        },

        status: {
            type: String,
            enum: ["upcoming", "completed", "cancelled"],
            default: "upcoming",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);