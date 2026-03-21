const express = require("express");
const router = express.Router();

const {
    requestConsultation,
    getMyConsultations,
    getLawyers,
    getAssignedConsultations,
} = require("../controllers/legalController");

const authMiddleware = require("../middleware/authMiddleware");

const { allowRoles } = require("../middleware/roleMiddleware");

router.get("/lawyers", authMiddleware, getLawyers);
router.get("/assigned", authMiddleware, allowRoles("lawyer"), getAssignedConsultations);
router.post("/request", authMiddleware, allowRoles("student"), requestConsultation);
router.get("/my", authMiddleware, allowRoles("student"), getMyConsultations);

module.exports = router;