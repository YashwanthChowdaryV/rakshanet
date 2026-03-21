const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const { 
    getDashboardStats, 
    getUsers, 
    updateUserStatus,
    getUserDetails,
    getAllSessions,
    getAllLogs
} = require("../controllers/adminController");

// Protect all admin routes
router.use(auth, allowRoles("admin"));

router.get("/dashboard-stats", getDashboardStats);
router.get("/users", getUsers);
router.get("/users/:id", getUserDetails);
router.put("/user-status", updateUserStatus);
router.get("/sessions", getAllSessions);
router.get("/logs", getAllLogs);

module.exports = router;
