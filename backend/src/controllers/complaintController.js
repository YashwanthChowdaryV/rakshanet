const EscalationReport = require("../models/EscalationReport");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const mapLegalSections = (category) => {
    const mapping = {
        "Blackmail / Extortion": "IPC 384, IT Act 66D",
        "Cyber Bullying": "IPC 354D",
        "Identity Theft": "IT Act 66C",
        "Online Harassment": "IPC 354D, 509",
        "Phishing": "IT Act 66C, 66D",
    };

    return (
        mapping[category] ||
        "Relevant provisions under the IT Act 2000 and IPC may apply."
    );
};

exports.generateComplaint = async (req, res) => {
    try {
        const data = req.body;

        // ===== Generate Case Number =====
        const caseNumber = `RK-${new Date().getFullYear()}-${Math.floor(
            1000 + Math.random() * 9000
        )}`;

        // ===== Ensure Upload Directory Exists =====
        const uploadDir = path.join(__dirname, "../../uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const fileName = `Escalation_Report_${Date.now()}.pdf`;
        const filePath = path.join(uploadDir, fileName);

        // ===== Process Evidence Files =====
        const evidenceList = [];

        if (req.files && req.files.length > 0) {
            req.files.forEach((file) => {
                const fileBuffer = fs.readFileSync(file.path);

                const hash = crypto
                    .createHash("sha256")
                    .update(fileBuffer)
                    .digest("hex");

                evidenceList.push({
                    fileName: file.originalname,
                    storedName: file.filename,
                    hash,
                    size: file.size,
                });
            });
        }

        // ===== Create PDF =====
        const doc = new PDFDocument({ margin: 50 });
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // Cover Page
        doc.fontSize(22).text("RAKSHANET", { align: "center" });
        doc.moveDown();
        doc.fontSize(18).text("CYBER INCIDENT ESCALATION REPORT", {
            align: "center",
        });
        doc.moveDown(2);

        doc.fontSize(12);
        doc.text(`Case Number: ${caseNumber}`);
        doc.text(`Generated On: ${new Date().toLocaleDateString()}`);
        doc.moveDown(2);

        // Executive Summary
        doc.fontSize(16).text("1. Executive Summary");
        doc.moveDown();
        doc.fontSize(12).text(
            `This report documents a case categorized as "${data.category}". ` +
            `The reported incident occurred on ${data.incidentDate} at ${data.incidentTime}. ` +
            `This report is suitable for institutional review and escalation to cybercrime authorities if required.`
        );

        doc.moveDown(2);

        // Incident Details
        doc.fontSize(16).text("2. Incident Details");
        doc.moveDown();
        doc.fontSize(12).text(`Location: ${data.location}`);
        doc.moveDown();
        doc.text(`Description:\n${data.description}`);
        doc.moveDown(2);

        // Accused Information
        doc.fontSize(16).text("3. Accused Information");
        doc.moveDown();
        doc.fontSize(12).text(`Name: ${data.offenderName || "Not Provided"}`);
        doc.text(`Username/ID: ${data.offenderUsername || "Not Provided"}`);
        doc.text(`Platform: ${data.offenderPlatform || "Not Provided"}`);
        doc.text(`Profile URL: ${data.offenderUrl || "Not Provided"}`);
        doc.moveDown(2);

        // Evidence Section
        doc.fontSize(16).text("4. Evidence Annexure");
        doc.moveDown();

        if (evidenceList.length === 0) {
            doc.fontSize(12).text("No evidence files uploaded.");
        } else {
            evidenceList.forEach((ev, index) => {
                doc.fontSize(12).text(`Evidence ${index + 1}: ${ev.fileName}`);
                doc.text(`SHA256 Hash: ${ev.hash}`);
                doc.text(`Size: ${(ev.size / 1024).toFixed(2)} KB`);
                doc.moveDown();
            });
        }

        doc.moveDown(2);

        // Legal Provisions
        doc.fontSize(16).text("5. Potential Legal Provisions");
        doc.moveDown();
        doc.fontSize(12).text(mapLegalSections(data.category));
        doc.moveDown(2);

        // Declaration
        doc.fontSize(16).text("6. Declaration");
        doc.moveDown();
        doc.fontSize(12).text(
            "I hereby declare that the information provided in this report is true to the best of my knowledge."
        );

        doc.addPage();

        // Escalation Guide
        doc.fontSize(16).text("Escalation Instructions");
        doc.moveDown();
        doc.fontSize(12).text(
            "1. Visit https://cybercrime.gov.in\n" +
            "2. Select 'File a Complaint'\n" +
            "3. Upload this report and attach supporting evidence\n" +
            "4. Save the acknowledgement number\n" +
            "5. Follow up with the local cyber police station if required"
        );

        doc.end();

        // ===== Wait Until PDF Is Finished Writing =====
        await new Promise((resolve) => writeStream.on("finish", resolve));

        // ===== Save To MongoDB =====
        const report = await EscalationReport.create({
            caseNumber,
            category: data.category,
            incidentDate: data.incidentDate,
            incidentTime: data.incidentTime,
            location: data.location,
            description: data.description,

            complainant: {
                name: data.name,
                email: data.email,
                phone: data.phone,
            },

            offender: {
                name: data.offenderName,
                username: data.offenderUsername,
                platform: data.offenderPlatform,
                profileUrl: data.offenderUrl,
            },

            evidence: evidenceList,
            pdfFileName: fileName,
            status: "generated",
        });

        console.log("Saved Report:", report);

        res.status(201).json({
            message: "Escalation-Ready Report Generated & Saved Successfully",
            caseNumber,
            reportId: report._id,
            downloadUrl: `http://localhost:5000/uploads/${fileName}`,
        });
    } catch (error) {
        console.error("Complaint Generation Error:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};