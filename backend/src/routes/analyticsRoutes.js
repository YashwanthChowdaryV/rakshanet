const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const { getAnalyticsOverview } = require("../controllers/analyticsController");

router.get("/overview", auth, allowRoles("admin"), getAnalyticsOverview);

module.exports = router;
