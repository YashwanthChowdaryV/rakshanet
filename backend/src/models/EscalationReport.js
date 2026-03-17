const mongoose = require("mongoose");

const EscalationReportSchema = new mongoose.Schema(
    {
        caseNumber: { type: String, required: true },
        category: String,
        incidentDate: String,
        incidentTime: String,
        location: String,
        description: String,

        complainant: {
            name: String,
            email: String,
            phone: String,
        },

        offender: {
            name: String,
            username: String,
            platform: String,
            profileUrl: String,
        },

        evidence: [
            {
                fileName: String,
                hash: String,
                size: Number,
            },
        ],

        pdfFileName: String,
        status: {
            type: String,
            enum: ["generated", "submitted", "closed"],
            default: "generated",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("EscalationReport", EscalationReportSchema);