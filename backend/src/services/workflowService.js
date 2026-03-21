const WorkflowLog = require("../models/WorkflowLog");
const Case = require("../models/Case");

exports.triggerWorkflow = async (caseId, severity, userId) => {
    try {
        let actionTaken = "None";
        let triggerCondition = `Severity: ${severity}`;

        if (severity === "Critical") {
            actionTaken = "Allowed HR Email & Suggested Legal Action";
            // In a real app, this might trigger an email immediately, or set flags on the Case
            await Case.findByIdAndUpdate(caseId, { 
                $push: { 
                    notes: { role: "System", text: "Critical severity detected. HR escalation enabled and Legal Action suggested." } 
                }
            });
        } else if (severity === "High") {
            actionTaken = "Suggested Legal Action";
            await Case.findByIdAndUpdate(caseId, { 
                $push: { 
                    notes: { role: "System", text: "High severity detected. Legal Action suggested." } 
                }
            });
        }

        // Check for repeated reports from the same user (simple heuristic)
        if (userId) {
            const userCases = await Case.countDocuments({ "victim.user": userId });
            if (userCases > 3) {
                triggerCondition += " | Repeated Report";
                actionTaken += " | Alerted Admin (Repeated Reporter)";
                await Case.findByIdAndUpdate(caseId, { 
                    $push: { 
                        notes: { role: "System", text: "User has filed more than 3 reports. Escalated for Admin review." } 
                    }
                });
            }
        }

        // Save Workflow Log
        if (actionTaken !== "None") {
            await WorkflowLog.create({
                caseId,
                triggerCondition,
                actionTaken,
                status: "Success"
            });
        }
    } catch (error) {
        console.error("Workflow Error:", error);
    }
};
