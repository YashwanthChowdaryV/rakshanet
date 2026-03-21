const Case = require("../models/Case");
const CounselorSession = require("../models/CounselorSession");
const ReportLog = require("../models/ReportLog");
const { analyzeText } = require("../services/nlpEngine");
const { triggerWorkflow } = require("../services/workflowService");
const { checkStateTransitions } = require("../services/workflowEngine");
const { logAction } = require("../services/auditService");
const { sendNotification } = require("../services/notificationService");

/* ======================================================
   CREATE CASE (with NLP Auto Detection)
====================================================== */

exports.createCase = async (req, res) => {
    try {
        const {
            incidentDate,
            incidentTime,
            platform,
            description,
            multipleInputs,
            anonymous,
            department,
        } = req.body;

        // Extract platform from either platform or offenderPlatform
        const resolvedPlatform = platform || req.body.offenderPlatform || "Unknown";

        if (!description || !resolvedPlatform) {
            return res.status(400).json({
                message: "Description and platform are required",
            });
        }

        // Generate Case Number
        const caseNumber = `RK-${new Date().getFullYear()}-${Math.floor(
            1000 + Math.random() * 9000
        )}`;

        // 🔥 NLP Analysis
        const textToAnalyze = multipleInputs && multipleInputs.length > 0
            ? multipleInputs.join(". ")
            : description;

        const aiResult = analyzeText(textToAnalyze);
        const resolvedSeverity = aiResult.severityLabel || "Low";

        // Handle File Evidence
        const evidenceList = [];
        const crypto = require("crypto");
        const fs = require("fs");
        if (req.files && req.files.length > 0) {
            req.files.forEach((file) => {
                const fileBuffer = fs.readFileSync(file.path);
                const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");
                evidenceList.push({
                    fileName: file.originalname,
                    storedName: file.filename,
                    hash,
                    size: file.size,
                });
            });
        }

        const newCase = await Case.create({
            caseNumber,
            victim: {
                user: req.user.id,
                alias: anonymous ? `ANON-${Math.random().toString(36).slice(2, 6)}` : null,
                anonymous: anonymous || false,
                department,
            },
            incidentDate,
            incidentTime,
            platform: resolvedPlatform,
            description,
            multipleInputs: multipleInputs || [],
            severity: resolvedSeverity,
            severityColor: resolvedSeverity === "Critical" ? "#ef4444" : resolvedSeverity === "High" ? "#f97316" : resolvedSeverity === "Medium" ? "#eab308" : "#10b981",
            aiAnalysis: aiResult,
            evidence: evidenceList,
            timeline: [
                {
                    action: "Case Created",
                    actor: "Student",
                    note: "Case filed by user",
                },
                {
                    action: "AI Analysis Completed",
                    actor: "System",
                    note: `Severity: ${resolvedSeverity}`,
                },
            ],
        });

        // Add ReportLog
        await ReportLog.create({
            user: req.user.id,
            detectedKeywords: aiResult.allMatchedKeywords || [],
            severityScore: resolvedSeverity,
            status: "Logged",
            caseId: newCase._id
        });

        // Trigger Automation Workflow
        await triggerWorkflow(newCase._id, resolvedSeverity, req.user.id);
        await checkStateTransitions(newCase._id, "New", "Severity Assessed", req.user, resolvedSeverity);

        await logAction({ id: req.user.id, role: req.user.role }, "Case Created", newCase._id, null, `Filed under platform: ${resolvedPlatform}`);

        res.status(201).json({
            message: "Case created successfully",
            case: newCase,
        });
    } catch (error) {
        console.error("Create Case Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

/* ======================================================
   GET ALL CASES (Role-Based + Search + Filters)
====================================================== */

exports.getAllCases = async (req, res) => {
    try {
        const role = req.user.role;
        const { status, severity, search } = req.query;

        console.log("=== getAllCases DEBUG ===");
        console.log("ROLE:", role);
        console.log("USER ID:", req.user.id);

        let filter = {};
        const roleFilters = [];

        if (role === "student") {
            roleFilters.push({ "victim.user": req.user.id });
        } else if (role === "counselor") {
            const sessions = await CounselorSession.find({ counselor: req.user.id });
            const sessionCaseIds = sessions.map(s => s.caseId);
            console.log("Counselor session case IDs:", sessionCaseIds);
            roleFilters.push({
                $or: [
                    { "assignedTo.user": req.user.id },
                    { _id: { $in: sessionCaseIds } },
                    { status: "Under Review" },
                    { status: "Counselor Session" }
                ]
            });
        } else if (role === "lawyer") {
            roleFilters.push({
                $or: [
                    { "assignedTo.user": req.user.id },
                    { status: "Escalated" },
                    { status: "Lawyer Review" }
                ]
            });
        }
        // admin: no roleFilters → gets all cases

        if (status) filter.status = status;
        if (severity) filter.severity = severity;

        let queryAnd = [];
        if (Object.keys(filter).length > 0) queryAnd.push(filter);
        if (roleFilters.length > 0) queryAnd.push(...roleFilters);
        
        if (search) {
            queryAnd.push({
                $or: [
                    { caseNumber: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                    { platform: { $regex: search, $options: "i" } },
                ]
            });
        }

        const finalQuery = queryAnd.length > 0 ? { $and: queryAnd } : {};

        console.log("FINAL QUERY:", JSON.stringify(finalQuery, null, 2));

        const cases = await Case.find(finalQuery)
            .populate("victim.user", "name email role department")
            .populate("assignedTo.user", "name role email")
            .sort({ createdAt: -1 });

        console.log("Cases found:", cases.length);
        console.log("=== END DEBUG ===");

        res.json(cases);
    } catch (error) {
        console.error("Get All Cases Error: ", error);
        res.status(500).json({ message: "Server Error" });
    }
};

/* ======================================================
   GET SINGLE CASE
====================================================== */

exports.getCaseById = async (req, res) => {
    try {
        const role = req.user.role;
        const caseData = await Case.findById(req.params.id)
            .populate("victim.user", "name email role department")
            .populate("assignedTo.user", "name role email")
            .populate("notes.user", "name role");

        if (!caseData) {
            return res.status(404).json({ message: "Case not found" });
        }

        const sessions = await CounselorSession.find({ caseId: caseData._id }).populate("counselor", "name");
        const responseData = { ...caseData.toObject(), sessions };

        let hasAccess = false;
        if (role === "admin") {
            hasAccess = true;
        } else if (role === "student") {
            hasAccess = caseData.victim.user && caseData.victim.user._id.toString() === req.user.id;
        } else if (role === "lawyer") {
            const isAssigned = caseData.assignedTo && caseData.assignedTo.user && caseData.assignedTo.user._id.toString() === req.user.id;
            hasAccess = isAssigned || caseData.status === "Escalated" || caseData.status === "Lawyer Review";
        } else if (role === "counselor") {
            const isAssigned = caseData.assignedTo && caseData.assignedTo.user && caseData.assignedTo.user._id.toString() === req.user.id;
            const hasSession = sessions.some(s => s.counselor && s.counselor._id.toString() === req.user.id);
            const isRelevantStatus = caseData.status === "Under Review" || caseData.status === "Counselor Session";
            hasAccess = isAssigned || hasSession || isRelevantStatus;
        }

        if (!hasAccess) {
            return res.status(403).json({ message: "Access denied to view this case" });
        }

        res.json(responseData);
    } catch (error) {
        console.error("Get Case By Id Error: ", error);
        res.status(500).json({ message: "Server Error" });
    }
};

/* ======================================================
   UPDATE STATUS
====================================================== */

exports.updateCaseStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "New",
            "Under Review",
            "Escalated",
            "Resolved",
            "Closed",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const caseData = await Case.findById(req.params.id);
        if (!caseData)
            return res.status(404).json({ message: "Case not found" });

        caseData.status = status;

        caseData.timeline.push({
            action: "Status Updated",
            actor: req.user.role,
            note: `Status changed to ${status}`,
        });

        await caseData.save();

        await logAction({ id: req.user.id, role: req.user.role }, "Status Updated", caseData._id, null, `Changed status to ${status}`);
        
        if (caseData.victim && caseData.victim.user) {
            const vicId = caseData.victim.user._id || caseData.victim.user;
            await sendNotification(vicId, `Your case has been updated to ${status}`, "Info", caseData._id);
        }

        res.json({ message: "Status updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

/* ======================================================
   ASSIGN CASE
====================================================== */

exports.assignCase = async (req, res) => {
    try {
        const { userId, role } = req.body;

        const caseData = await Case.findById(req.params.id);
        if (!caseData)
            return res.status(404).json({ message: "Case not found" });

        caseData.assignedTo = {
            user: userId,
            role,
        };

        caseData.timeline.push({
            action: "Case Assigned",
            actor: req.user.role,
            note: `Assigned to ${role}`,
        });

        await caseData.save();

        await logAction({ id: req.user.id, role: req.user.role }, "Case Assigned", caseData._id, userId, `Assigned to ${role}`);
        await sendNotification(userId, `You have been assigned to a case`, "Alert", caseData._id);

        if (role === "lawyer") {
            await checkStateTransitions(caseData._id, caseData.status, "Lawyer Assigned", req.user);
        } else if (role === "counselor") {
            await checkStateTransitions(caseData._id, caseData.status, "Counselor Assigned", req.user);
        }
        
        res.json({ message: "Case assigned successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

/* ======================================================
   WITHDRAW CASE
====================================================== */

exports.withdrawCase = async (req, res) => {
    try {
        const caseData = await Case.findById(req.params.id).populate("assignedTo.user");
        if (!caseData) return res.status(404).json({ message: "Case not found" });

        if (caseData.victim.user.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Only the victim can withdraw this case" });
        }

        if (caseData.status === "Closed" || caseData.status === "Resolved") {
            return res.status(400).json({ message: "Cannot withdraw a resolved or closed case" });
        }

        caseData.status = "Closed";

        caseData.notes.push({
            user: req.user.id,
            role: req.user.role,
            text: "Withdrawn by student"
        });

        caseData.timeline.push({
            action: "Case Withdrawn",
            actor: req.user.role,
            note: "Student withdrew the case"
        });

        await caseData.save();

        await logAction({ id: req.user.id, role: req.user.role }, "Case Withdrawn", caseData._id, null, "Student withdrew the case");

        if (caseData.assignedTo && caseData.assignedTo.user) {
            const assignId = caseData.assignedTo.user._id || caseData.assignedTo.user;
            await sendNotification(assignId, `Case ${caseData.caseNumber} has been withdrawn by the student.`, "Alert", caseData._id);
        }

        res.json({ message: "Case withdrawn successfully", case: caseData });

    } catch (error) {
        console.error("Withdraw Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

/* ======================================================
   ADD NOTE
====================================================== */

exports.addNote = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ message: "Note text required" });
        }

        const caseData = await Case.findById(req.params.id);
        if (!caseData)
            return res.status(404).json({ message: "Case not found" });

        caseData.notes.push({
            user: req.user.id,
            role: req.user.role,
            text,
        });

        caseData.timeline.push({
            action: "Note Added",
            actor: req.user.role,
            note: text,
        });

        await caseData.save();

        await logAction({ id: req.user.id, role: req.user.role }, "Note Added", caseData._id, null, "Added note to case");
        
        // If victim is involved notify them
        if (caseData.victim && caseData.victim.user && req.user.role !== "student") {
            const vicId = caseData.victim.user._id || caseData.victim.user;
            await sendNotification(vicId, `A new note was added to your case`, "Info", caseData._id);
        }

        res.json({ message: "Note added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

/* ======================================================
   DELETE CASE (Admin Only)
====================================================== */

exports.deleteCase = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const caseData = await Case.findById(req.params.id);
        if (!caseData)
            return res.status(404).json({ message: "Case not found" });

        await caseData.deleteOne();

        res.json({ message: "Case deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

/* ======================================================
   GENERATE LINKEDIN MISCONDUCT REPORT
====================================================== */

exports.generateCorporateMisconductDraft = async (req, res) => {
    try {
        const { companyName } = req.query;

        const caseData = await Case.findById(req.params.id);

        if (!caseData) {
            return res.status(404).json({ message: "Case not found" });
        }

        const subject = `Professional Conduct Concern Regarding Employee Interaction`;

        const body = `
Dear ${companyName || "HR Team"},

I hope you are doing well.

I am writing to bring to your attention a professional conduct concern involving an individual who appears to be associated with your organization.

The interaction occurred via LinkedIn and involved repeated unsolicited personal messages directed toward a student. The communication was perceived as inappropriate and made the recipient uncomfortable.

Incident Summary:
- Platform: ${caseData.platform}
- Date: ${caseData.incidentDate}
- Severity Assessment: ${caseData.severity}

Description of Interaction:
${caseData.description}

This email is not intended as an accusation but as a request for your organization to review the matter internally under your professional conduct policies.

If required, supporting documentation can be provided upon request.

Thank you for your attention to this matter.

Sincerely,
[Your Name]
`;

        await logAction({ id: req.user.id, role: req.user.role }, "Draft Generated", caseData._id, null, "Generated Corporate Misconduct Draft");

        res.json({ subject, body });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

/* ======================================================
   GET CASE STATS
====================================================== */

exports.getCaseStats = async (req, res) => {
    try {
        const role = req.user.role;
        let matchQuery = {};

        if (role === "student") {
            matchQuery["victim.user"] = req.user.id;
        }

        const stats = await Case.aggregate([
            { $match: matchQuery },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const formattedStats = {
            totalCases: 0,
            new: 0,
            review: 0,
            resolved: 0,
            escalated: 0,
            closed: 0
        };

        stats.forEach(stat => {
            formattedStats.totalCases += stat.count;
            if (stat._id === "New") formattedStats.new = stat.count;
            if (stat._id === "Under Review") formattedStats.review = stat.count;
            if (stat._id === "Resolved") formattedStats.resolved = stat.count;
            if (stat._id === "Escalated") formattedStats.escalated = stat.count;
            if (stat._id === "Closed") formattedStats.closed = stat.count;
        });

        res.json(formattedStats);
    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

/* ======================================================
   GET USER EVIDENCE (Flattened list of all evidence files)
====================================================== */

exports.getUserEvidence = async (req, res) => {
    try {
        const role = req.user.role;
        let filter = {};

        if (role === "student") {
            filter["victim.user"] = req.user.id;
        }

        const cases = await Case.find(filter).select("evidence caseNumber createdAt platform");

        // Flatten evidence from all cases and add case correlation
        const allEvidence = [];
        cases.forEach(c => {
            if (c.evidence && c.evidence.length > 0) {
                c.evidence.forEach(e => {
                    allEvidence.push({
                        ...e.toObject(),
                        caseId: c._id,
                        caseNumber: c.caseNumber,
                        uploadedAt: c.createdAt,
                        platform: c.platform
                    });
                });
            }
        });

        // Sort by upload date (newest first)
        allEvidence.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

        res.json(allEvidence);
    } catch (error) {
        console.error("Get Evidence Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

/* ======================================================
   VERIFY EVIDENCE
====================================================== */

exports.verifyEvidence = async (req, res) => {
    try {
        const { id, fileName } = req.params;
        const caseData = await Case.findById(id);
        
        if (!caseData) return res.status(404).json({ message: "Case not found" });

        const evidence = caseData.evidence.find(e => e.fileName === fileName || e.storedName === fileName);
        if (!evidence) return res.status(404).json({ message: "Evidence not found" });

        const fs = require('fs');
        const crypto = require('crypto');
        const path = require('path');
        const filePath = path.join(__dirname, "../../uploads", evidence.storedName);
        
        if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File missing on server" });

        const fileBuffer = fs.readFileSync(filePath);
        const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

        res.json({
            valid: hash === evidence.hash,
            hash,
            storedHash: evidence.hash
        });
    } catch (error) {
        console.error("Verify Evidence Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
