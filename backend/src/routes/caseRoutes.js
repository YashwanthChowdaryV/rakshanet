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
    generateCorporateMisconductDraft
} = require("../controllers/caseController");

router.post("/", auth, upload.array("evidenceFiles", 10), createCase);
router.get("/", auth, getAllCases);
router.get("/:id", auth, getCaseById);
router.put("/:id/status", auth, updateCaseStatus);
router.put("/:id/assign", auth, assignCase);
router.post("/:id/note", auth, addNote);
router.get("/:id/corporate-draft", auth, generateCorporateMisconductDraft);
module.exports = router;