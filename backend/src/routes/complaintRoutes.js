const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { generateComplaint } = require("../controllers/complaintController");

router.post(
    "/college",
    upload.array("evidenceFiles", 10),
    generateComplaint
);

module.exports = router;