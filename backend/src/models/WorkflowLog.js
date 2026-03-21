const mongoose = require("mongoose");

const workflowLogSchema = new mongoose.Schema(
    {
        caseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case" },
        triggerCondition: { type: String, required: true },
        actionTaken: { type: String, required: true },
        status: { type: String, default: "Success" },
        timestamp: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

module.exports = mongoose.model("WorkflowLog", workflowLogSchema);
