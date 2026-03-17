const Appointment = require("../models/Appointment");

exports.bookAppointment = async (req, res) => {
    try {
        const { counselorName, date, time, sessionType, reason } = req.body;

        const appointment = await Appointment.create({
            student: req.user.id, // from auth middleware
            counselorName,
            date,
            time,
            sessionType,
            reason,
        });

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