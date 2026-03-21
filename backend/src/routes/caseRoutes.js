const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const {
    createCase,
    getAllCases,
    getCaseById,
    updateCaseStatus,
    assignCase,
    addNote,
    generateCorporateMisconductDraft,
    getCaseStats,
    getUserEvidence,
    verifyEvidence,
    withdrawCase
} = require("../controllers/caseController");

const { allowRoles } = require("../middleware/roleMiddleware");

router.post("/", auth, allowRoles("student"), upload.array("evidenceFiles", 10), createCase);
router.get("/", auth, getAllCases);
router.get("/stats", auth, getCaseStats);
router.get("/evidence", auth, getUserEvidence);
router.get("/:id/evidence/:fileName/verify", auth, verifyEvidence);
router.get("/:id", auth, getCaseById);
router.put("/:id/status", auth, updateCaseStatus);
router.put("/:id/withdraw", auth, allowRoles("student"), withdrawCase);
router.put("/:id/assign", auth, allowRoles("admin", "lawyer"), assignCase);
router.post("/:id/note", auth, addNote);
router.get("/:id/corporate-draft", auth, generateCorporateMisconductDraft);
module.exports = router;