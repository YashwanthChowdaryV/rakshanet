const nodemailer = require("nodemailer");
const EmailLog = require("../models/EmailLog");

exports.sendLinkedInComplaint = async (req, res) => {
    try {
        const { companyName, hrEmail, offenderName, offenderProfile, evidenceText } = req.body;
        const studentId = req.user?.id;

        if (!studentId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        if (!companyName || !hrEmail || !offenderName || !offenderProfile) {
            return res.status(400).json({
                success: false,
                message: "Company name, HR email, offender name, and profile URL are required",
            });
        }

        // Prevent Duplicate Sending Strategy
        // If an email log was already sent for the same offender at the same company by this user
        // within the last 7 days, block it.
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const duplicateCheck = await EmailLog.findOne({
            sender: studentId,
            companyName: companyName,
            offenderProfile: offenderProfile,
            status: "Sent",
            createdAt: { $gte: sevenDaysAgo }
        });

        if (duplicateCheck) {
            return res.status(400).json({
                success: false,
                message: "A complaint has already been sent to this company for this individual recently.",
            });
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Professional complaint content
        const subject = `Formal Complaint Regarding Employee Misconduct on LinkedIn - ${offenderName}`;

        const text = `
Dear HR Team at ${companyName},

I am writing to formally report inappropriate professional conduct by one of your employees, ${offenderName}, whose LinkedIn profile is: ${offenderProfile}.

The individual has engaged in behavior that includes unsolicited messages, inappropriate communication, and harassment.

${evidenceText ? `Here are further details regarding the incident:\n${evidenceText}\n` : ""}
This conduct is highly unprofessional and creates an unsafe digital environment for individuals.

I request your organization to kindly investigate this matter and take appropriate action as per your company policies.

Please treat this matter with seriousness.

Thank you.

Sincerely,
Concerned Individual
`;

        // Attempt sending email
        let status = "Sent";
        let errorMessage = null;

        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: hrEmail,
                subject,
                text,
            });
        } catch (mailError) {
            console.error("Nodemailer Send Error:", mailError);
            status = "Failed";
            errorMessage = mailError.message;
        }

        // Save into EmailLog
        const newLog = await EmailLog.create({
            sender: studentId,
            companyName,
            hrEmail,
            recipient: hrEmail,
            subject,
            content: text,
            offenderName,
            offenderProfile,
            evidenceText,
            status,
            error: errorMessage
        });

        if (status === "Failed") {
            return res.status(500).json({
                success: false,
                message: "Failed to send email",
                error: errorMessage
            });
        }

        res.json({
            success: true,
            message: "Complaint email sent successfully",
            log: newLog
        });

    } catch (error) {
        console.error("Email API Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.getMyEmailLogs = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const logs = await EmailLog.find({ sender: req.user.id })
            .sort({ createdAt: -1 });

        return res.status(200).json(logs);
    } catch (error) {
        console.error("Fetch Email Logs Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.sendAlertEmail = async (req, res) => {
    try {
        const { recipient, subject, content, caseId } = req.body;
        const userId = req.user?.id;

        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
        if (!recipient || !subject || !content) {
            return res.status(400).json({ success: false, message: "Missing fields" });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        let status = "Sent";
        let errorMessage = null;

        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: recipient,
                subject,
                text: content,
            });
        } catch (mailError) {
            status = "Failed";
            errorMessage = mailError.message;
        }

        const newLog = await EmailLog.create({
            sender: userId,
            recipient,
            subject,
            content,
            status,
            error: errorMessage,
            caseId
        });

        if (status === "Failed") return res.status(500).json({ success: false, error: errorMessage });
        res.json({ success: true, message: "Alert email sent", log: newLog });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.retryFailedEmail = async (req, res) => {
    try {
        const { logId } = req.params;
        const log = await EmailLog.findById(logId);
        if (!log || log.status === "Sent") {
            return res.status(400).json({ success: false, message: "Invalid or already sent log" });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: log.recipient,
                subject: log.subject,
                text: log.content,
            });
            log.status = "Sent";
            log.error = null;
        } catch (err) {
            log.error = err.message;
        }
        
        log.retryCount += 1;
        await log.save();

        res.json({ success: log.status === "Sent", log });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};