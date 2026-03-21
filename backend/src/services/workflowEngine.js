const Case = require("../models/Case");
const WorkflowLog = require("../models/WorkflowLog");
const { logAction } = require("./auditService");
const { sendNotification } = require("./notificationService");

/**
 * Executes business rules for state transitions.
 * @param {string} caseId 
 * @param {string} currentStatus 
 * @param {string} event - E.g. "Severity Assessed", "Counselor Assigned", "Session Added", "Lawyer Assigned"
 * @param {object} reqUser - The user making the request (for audit logs)
 * @param {string} overrideSeverity - Optional, for when severity is assessed
 */
exports.checkStateTransitions = async (caseId, currentStatus, event, reqUser, overrideSeverity = null) => {
    try {
        const caseData = await Case.findById(caseId);
        if (!caseData) return;

        const severity = overrideSeverity || caseData.severity;
        let nextStatus = currentStatus;
        let actionTaken = "None";
        let reason = "";

        // Rules evaluation
        if (event === "Severity Assessed" && severity === "Critical") {
            nextStatus = "Escalated";
            reason = "Critical severity automatically escalates the case.";
            actionTaken = "Auto-Escalated";
        } 
        else if (event === "Counselor Assigned" && currentStatus === "New") {
            nextStatus = "Under Review";
            reason = "Counselor assigned to case.";
            actionTaken = "Status -> Under Review";
        }
        else if (event === "Session Added" && (currentStatus === "New" || currentStatus === "Under Review")) {
            nextStatus = "Under Review";
            reason = "A counselor session was logged.";
            actionTaken = "Status -> Under Review";
        }
        else if (event === "Lawyer Assigned" && currentStatus !== "Closed" && currentStatus !== "Resolved") {
            nextStatus = "Lawyer Review";
            reason = "Lawyer assigned to case.";
            actionTaken = "Status -> Lawyer Review";
        }

        // Apply transition
        if (nextStatus !== currentStatus) {
            caseData.status = nextStatus;
            caseData.timeline.push({
                action: "Status Auto-Updated",
                actor: "System Workflow",
                note: `Status changed to ${nextStatus} because: ${reason}`,
            });

            await caseData.save();

            // Log the automation
            await WorkflowLog.create({
                caseId,
                triggerCondition: `Event: ${event} | PrevState: ${currentStatus}`,
                actionTaken,
                status: "Success"
            });

            // Standard hooks
            await logAction({ id: reqUser.id, role: reqUser.role }, "System Auto-Update", caseId, null, `Workflow changed status to ${nextStatus}`);
            if (caseData.victim && caseData.victim.user) {
                await sendNotification(caseData.victim.user, `Workflow automatically updated your case status to ${nextStatus}`, "Info", caseId);
            }
        }
    } catch (error) {
        console.error("WorkflowEngine Error:", error);
    }
};
