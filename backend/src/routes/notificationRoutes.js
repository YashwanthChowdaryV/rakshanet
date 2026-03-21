const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getUserNotifications, markAsRead, markAllAsRead } = require("../controllers/notificationController");

router.get("/", auth, getUserNotifications);
router.put("/read", auth, markAsRead);
router.put("/read-all", auth, markAllAsRead);

module.exports = router;
