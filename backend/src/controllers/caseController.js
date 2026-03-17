const Case = require("../models/Case");
const { analyzeText } = require("../services/nlpEngine");

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
        const aiResult = analyzeText(description);
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
            severity: resolvedSeverity,
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

        let filter = {};

        // Student → Only own cases
        if (role === "student") {
            filter["victim.user"] = req.user.id;
        }

        if (status) filter.status = status;
        if (severity) filter.severity = severity;

        if (search) {
            filter.$or = [
                { caseNumber: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        const cases = await Case.find(filter)
            .populate("victim.user", "name email role")
            .populate("assignedTo.user", "name role")
            .sort({ createdAt: -1 });

        res.json(cases);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

/* ======================================================
   GET SINGLE CASE
====================================================== */

exports.getCaseById = async (req, res) => {
    try {
        const caseData = await Case.findById(req.params.id)
            .populate("victim.user", "name email role")
            .populate("assignedTo.user", "name role")
            .populate("notes.user", "name role");

        if (!caseData) {
            return res.status(404).json({ message: "Case not found" });
        }

        res.json(caseData);
    } catch (error) {
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

        res.json({ message: "Case assigned successfully" });
    } catch (error) {
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

        res.json({ subject, body });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};