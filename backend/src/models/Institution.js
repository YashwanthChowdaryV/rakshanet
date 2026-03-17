const mongoose = require("mongoose");

const institutionSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        domain: { type: String, required: true, unique: true },
        contactEmail: String,
        contactPhone: String,
        subscriptionPlan: {
            type: String,
            enum: ["free", "premium"],
            default: "free",
        },
        settings: {
            allowAnonymousReporting: { type: Boolean, default: true },
            twilioEnabled: { type: Boolean, default: false },
            autoWarning: { type: Boolean, default: false },
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Institution", institutionSchema);