const express = require("express");
const router = express.Router();

const { sendLinkedInComplaint, getMyEmailLogs, sendAlertEmail, retryFailedEmail } = require("../controllers/emailController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/linkedin-complaint", authMiddleware, sendLinkedInComplaint);
router.get("/logs", authMiddleware, getMyEmailLogs);

router.post("/alert", authMiddleware, sendAlertEmail);
router.post("/retry/:logId", authMiddleware, retryFailedEmail);

module.exports = router;