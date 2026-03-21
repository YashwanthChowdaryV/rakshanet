const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const {
    createSession,
    getSessions,
    getMySessions,
} = require("../controllers/counselorController");


// create session
router.post("/session", auth, allowRoles("counselor"), createSession);

// get sessions for case
router.get("/session/:caseId", auth, getSessions);

// get sessions for student
router.get("/session/student/my", auth, allowRoles("student"), getMySessions);

module.exports = router;