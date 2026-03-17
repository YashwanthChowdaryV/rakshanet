const LegalConsultation = require("../models/LegalConsultation");
const EscalationReport = require("../models/EscalationReport");

exports.requestConsultation = async (req, res) => {
    try {
        // ✅ Safety checks
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized - No user found" });
        }

        if (!req.body) {
            return res.status(400).json({ message: "No form data received" });
        }

        const {
            lawyerName,
            caseNumber,
            consultationType,
            preferredDate,
            preferredTime,
            mode,
            description,
        } = req.body;

        // ✅ Basic validation
        if (!caseNumber) {
            return res.status(400).json({ message: "Case number is required" });
        }

        if (!lawyerName) {
            return res.status(400).json({ message: "Lawyer name is required" });
        }

        // ✅ Validate case exists (optional but recommended)
        const Case = require("../models/Case");
        const caseExists = await Case.findOne({ caseNumber });

        if (!caseExists) {
            return res.status(404).json({ message: "Invalid case selected. Case not found." });
        }

        // 🔒 Free consultation validation (1 per case per student)
        if (consultationType === "Free") {
            const existingFree = await LegalConsultation.findOne({
                student: req.user.id,
                caseNumber,
                consultationType: "Free",
            });

            if (existingFree) {
                return res.status(400).json({
                    message: "Free consultation already used for this case.",
                });
            }
        }

        // 📎 Process uploaded documents safely
        const documents = [];

        if (req.files && req.files.length > 0) {
            req.files.forEach((file) => {
                documents.push({
                    fileName: file.originalname,
                    storedName: file.filename,
                    size: file.size,
                });
            });
        }

        // ✅ Create consultation
        const consultation = await LegalConsultation.create({
            student: req.user.id,
            lawyerName,
            caseNumber,
            consultationType: consultationType || "Free",
            preferredDate,
            preferredTime,
            mode: mode || "Video Call",
            description,
            documents,
            status: "Pending",
        });

        return res.status(201).json({
            message: "Consultation request submitted successfully",
            consultation,
        });
    } catch (error) {
        console.error("Legal Consultation Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

exports.getMyConsultations = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const consultations = await LegalConsultation.find({
            student: req.user.id,
        })
            .sort({ createdAt: -1 });

        return res.status(200).json(consultations);
    } catch (error) {
        console.error("Fetch Consultations Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};