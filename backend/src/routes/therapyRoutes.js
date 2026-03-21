const express = require("express");
const router = express.Router();
const {
    bookAppointment,
    getMyAppointments,
    getCounselors,
    getAssignedAppointments,
    cancelAppointment,
} = require("../controllers/therapyController");

const authMiddleware = require("../middleware/authMiddleware");

const { allowRoles } = require("../middleware/roleMiddleware");

router.get("/counselors", authMiddleware, getCounselors);
router.get("/assigned", authMiddleware, allowRoles("counselor", "lawyer"), getAssignedAppointments);
router.post("/book", authMiddleware, allowRoles("student"), bookAppointment);
router.get("/my", authMiddleware, allowRoles("student"), getMyAppointments);
router.put("/appointments/:id/cancel", authMiddleware, cancelAppointment);

module.exports = router;