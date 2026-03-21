const Appointment = require("../models/Appointment");
const User = require("../models/User");
const { logAction } = require("../services/auditService");
const { sendNotification } = require("../services/notificationService");

exports.getCounselors = async (req, res) => {
    try {
        const counselors = await User.find({ role: "counselor" }).select("-passwordHash -refreshToken");
        res.json(counselors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getAssignedAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ counselorId: req.user.id })
            .populate("student", "name email profile")
            .sort({ date: 1 });
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.bookAppointment = async (req, res) => {
    try {
        const { counselorName, counselorId, date, time, sessionType, reason } = req.body;

        const appointment = await Appointment.create({
            student: req.user.id, // from auth middleware
            counselorName,
            counselorId,
            date,
            time,
            sessionType,
            reason,
        });

        await logAction({ id: req.user.id, role: req.user.role }, "Appointment Booked", null, counselorId, `Booked ${sessionType} session with ${counselorName}`);
        await sendNotification(counselorId, "A student has booked a new appointment with you", "Alert");

        res.status(201).json({
            message: "Appointment Booked Successfully",
            appointment,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({
            student: req.user.id,
        }).sort({ date: 1 });

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.cancelAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: "Appointment not found" });

        const isStudentOwner = appointment.student.toString() === req.user.id;
        const isAssignedDelegate = appointment.counselorId && appointment.counselorId.toString() === req.user.id;
        const isAdmin = req.user.role === "admin";

        if (!isStudentOwner && !isAssignedDelegate && !isAdmin) {
            return res.status(403).json({ message: "Not authorized to cancel this appointment" });
        }

        if (appointment.status === "cancelled" || appointment.status === "completed") {
            return res.status(400).json({ message: "Cannot cancel a completed or already cancelled appointment" });
        }

        appointment.status = "cancelled";
        await appointment.save();

        const Case = require("../models/Case");
        const studentCase = await Case.findOne({ "victim.user": appointment.student }).sort({ createdAt: -1 });
        if (studentCase) {
            studentCase.timeline.push({
                action: "Appointment Cancelled",
                actor: req.user.role,
                note: `Appointment for ${appointment.date} cancelled.`
            });
            await studentCase.save();
        }

        await logAction({ id: req.user.id, role: req.user.role }, "Appointment Cancelled", null, appointment.student, `Appointment cancelled by ${req.user.role}`);

        let notifyUserId = null;
        if (isStudentOwner && appointment.counselorId) {
            notifyUserId = appointment.counselorId;
        } else if (isAssignedDelegate || isAdmin) {
            notifyUserId = appointment.student;
        }

        if (notifyUserId) {
            await sendNotification(notifyUserId, `An appointment scheduled for ${appointment.date} has been cancelled.`, "Alert");
        }

        res.json({ message: "Appointment cancelled successfully", appointment });

    } catch (error) {
        console.error("Cancel Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};