// backend/src/services/emailService.js

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password
    },
});

exports.sendHREmail = async ({
    hrEmail,
    caseNumber,
    description,
    severity,
}) => {
    const mailOptions = {
        from: `"RakshaNet Escalation" <${process.env.EMAIL_USER}>`,
        to: hrEmail,
        subject: `Workplace Cyber Harassment Report - ${caseNumber}`,
        html: `
      <h3>Corporate Incident Notification</h3>
      <p><strong>Case Number:</strong> ${caseNumber}</p>
      <p><strong>Severity:</strong> ${severity}</p>
      <p><strong>Description:</strong></p>
      <p>${description}</p>
      <hr/>
      <p>This report was generated via RakshaNet AI Cyber Safety System.</p>
    `,
    };

    return transporter.sendMail(mailOptions);
};