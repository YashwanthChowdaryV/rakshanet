const express = require("express");
const router = express.Router();

const {
    requestConsultation,
    getMyConsultations,
} = require("../controllers/legalController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/request", authMiddleware, requestConsultation);
router.get("/my", authMiddleware, getMyConsultations);

module.exports = router;