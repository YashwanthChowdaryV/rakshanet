const CounselorSession = require("../models/CounselorSession");
const Case = require("../models/Case");
const { logAction } = require("../services/auditService");
const { sendNotification } = require("../services/notificationService");
const { checkStateTransitions } = require("../services/workflowEngine");


// =========================
// CREATE SESSION
// =========================

exports.createSession = async (req, res) => {
    try {

        const { caseId, notes, mood, riskLevel, recommendation, nextSessionDate } =
            req.body;

        const caseData = await Case.findById(caseId);

        const session = await CounselorSession.create({
            caseId,
            counselor: req.user.id,
            student: caseData && caseData.victim ? caseData.victim.user : null,
            notes,
            mood,
            riskLevel,
            recommendation,
            nextSessionDate,
        });

        // push timeline

        if (caseData) {
            caseData.timeline.push({
                action: "Counselor Session",
                actor: req.user.role,
                note: mood + " / " + riskLevel,
            });

            await caseData.save();
        }

        await logAction({ id: req.user.id, role: req.user.role }, "Session Created", caseId, session.student, "Counselor added session notes");
        if (session.student) {
            await sendNotification(session.student, "Your counselor added a new session summary", "Info", caseId);
        }

        if (caseData) {
            await checkStateTransitions(caseId, caseData.status, "Session Added", req.user);
        }

        res.json(session);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Session error" });
    }
};


// =========================
// GET SESSIONS BY CASE
// =========================

exports.getSessions = async (req, res) => {
    try {

        const sessions = await CounselorSession.find({
            caseId: req.params.caseId,
        }).sort({ createdAt: -1 });

        res.json(sessions);

    } catch (err) {
        res.status(500).json({ message: "Error" });
    }
};

// =========================
// GET SESSIONS FOR STUDENT
// =========================
exports.getMySessions = async (req, res) => {
    try {
        const sessions = await CounselorSession.find({
            student: req.user.id,
        })
        .populate("counselor", "name")
        .sort({ createdAt: -1 });

        res.json(sessions);
    } catch (err) {
        res.status(500).json({ message: "Error" });
    }
};