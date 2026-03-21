const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const { getAllLogs, getLogsByCaseId } = require("../controllers/auditController");

// Admin only access
router.get("/", auth, allowRoles("admin"), getAllLogs);
router.get("/case/:id", auth, allowRoles("admin"), getLogsByCaseId);

module.exports = router;
