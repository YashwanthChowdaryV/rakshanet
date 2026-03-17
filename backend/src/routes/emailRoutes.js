const express = require("express");
const router = express.Router();

const { sendLinkedInComplaint, getMyEmailLogs } = require("../controllers/emailController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/linkedin-complaint", authMiddleware, sendLinkedInComplaint);
router.get("/logs", authMiddleware, getMyEmailLogs);

module.exports = router;