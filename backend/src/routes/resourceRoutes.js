const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getAcademicSupport, getAwarenessResources } = require("../controllers/resourceController");

router.get("/academic", auth, getAcademicSupport);
router.get("/awareness", auth, getAwarenessResources);

module.exports = router;
