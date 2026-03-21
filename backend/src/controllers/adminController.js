const User = require("../models/User");
const Case = require("../models/Case");
const CounselorSession = require("../models/CounselorSession");
const Appointment = require("../models/Appointment");
const AuditLog = require("../models/AuditLog");

exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalCases = await Case.countDocuments();
        const criticalCases = await Case.countDocuments({ severity: "Critical" });
        const sessionsCount = await CounselorSession.countDocuments();
        const appointmentsCount = await Appointment.countDocuments();
        
        const recentLogs = await AuditLog.find()
            .populate("user", "name role")
            .sort({ timestamp: -1 })
            .limit(10);
            
        res.json({
            totalUsers,
            totalCases,
            criticalCases,
            sessionsCount,
            appointmentsCount,
            recentLogs
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        console.error("Get Users Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.updateUserStatus = async (req, res) => {
    try {
        const { id, isVerified } = req.body;
        await User.findByIdAndUpdate(id, { isVerified });
        res.json({ message: "User status updated" });
    } catch (error) {
        console.error("Update User Status Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

/* ======================================================
   GET USER DASHBOARD COUNTS + DATA
====================================================== */

exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password -passwordHash");
        if (!user) return res.status(404).json({ message: "User not found" });

        const casesCount = await Case.countDocuments({ "victim.user": user._id });
        const sessionsCount = await CounselorSession.countDocuments({
            $or: [{ counselor: user._id }, { student: user._id }]
        });
        const appointmentsCount = await Appointment.countDocuments({
            $or: [{ student: user._id }, { counselorId: user._id }]
        });

        res.json({ user, casesCount, sessionsCount, appointmentsCount });
    } catch (error) {
        console.error("Get User Details Error: ", error);
        res.status(500).json({ message: "Server Error" });
    }
};

/* ======================================================
   GET ALL SESSIONS (Admin Only)
====================================================== */

exports.getAllSessions = async (req, res) => {
    try {
        const sessions = await CounselorSession.find()
            .populate("counselor", "name email role")
            .populate("student", "name email role")
            .populate("caseId", "caseNumber title status")
            .sort({ sessionDate: -1 });
        res.json(sessions);
    } catch (error) {
        console.error("Get All Sessions Error: ", error);
        res.status(500).json({ message: "Server Error" });
    }
};

/* ======================================================
   GET ALL LOGS (Admin Only)
====================================================== */

exports.getAllLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find()
            .populate("user", "name role")
            .populate("caseId", "caseNumber title status")
            .populate("targetUser", "name role")
            .sort({ timestamp: -1 });
        res.json(logs);
    } catch (error) {
        console.error("Get All Logs Error: ", error);
        res.status(500).json({ message: "Server Error" });
    }
};
