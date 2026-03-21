const Case = require("../models/Case");
const CounselorSession = require("../models/CounselorSession");
const Appointment = require("../models/Appointment");

exports.getAnalyticsOverview = async (req, res) => {
    try {
        const totalCases = await Case.countDocuments();
        const criticalCases = await Case.countDocuments({ severity: "Critical" });
        const resolvedCases = await Case.countDocuments({ status: { $in: ["Resolved", "Closed"] } });

        const sessionsCount = await CounselorSession.countDocuments();
        const appointmentsCount = await Appointment.countDocuments();

        // Cases over time by month
        const monthlyAggregation = await Case.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const casesPerMonth = monthlyAggregation.map(item => ({
            name: months[item._id - 1] || "Unknown",
            cases: item.count
        }));

        // Severity stats
        const severityAggregation = await Case.aggregate([
            { $group: { _id: "$severity", value: { $sum: 1 } } }
        ]);

        const severityStats = severityAggregation.map(item => ({
            name: item._id || "Unrated",
            value: item.value
        }));

        // Status stats
        const statusAggregation = await Case.aggregate([
            { $group: { _id: "$status", value: { $sum: 1 } } }
        ]);
        const statusStats = statusAggregation.map(item => ({
            name: item._id || "Unknown",
            value: item.value
        }));

        res.json({
            overview: { totalCases, criticalCases, resolvedCases, sessionsCount, appointmentsCount },
            casesPerMonth,
            severityStats,
            statusStats
        });

    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
