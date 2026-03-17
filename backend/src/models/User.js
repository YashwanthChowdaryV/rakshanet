const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        institutionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institution",
            required: false,
        },
        email: { type: String, required: true },
        passwordHash: { type: String, required: true },
        name: { type: String, required: true },
        role: {
            type: String,
            enum: ["student", "counselor", "hr", "lawyer", "admin"],
            required: true,
        },
        profile: {
            phone: String,
            department: String,
            year: Number,
            employeeId: String,
        },
        isActive: { type: Boolean, default: true },
        lastLogin: Date,
        refreshToken: String,
    },
    { timestamps: true }
);

userSchema.index({ email: 1, institutionId: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);