const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../src/models/User");
const Case = require("../src/models/Case");
const CounselorSession = require("../src/models/CounselorSession");
const Appointment = require("../src/models/Appointment");
const Notification = require("../src/models/Notification");
const AuditLog = require("../src/models/AuditLog");

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/rakshanet";
        await mongoose.connect(uri);
        console.log("MongoDB Connected for Seeding to " + uri);
    } catch (error) {
        console.error("Database connection failed", error);
        process.exit(1);
    }
};

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const seedData = async () => {
    await connectDB();

    try {
        const password = await hashPassword("password123");

        // USERS
        const userCount = await User.countDocuments();
        let students = [], lawyers = [], counselors = [], admin = null;
        if (userCount === 0) {
            console.log("Seeding Users...");
            students = await User.insertMany(Array.from({ length: 10 }).map((_, i) => ({
                name: `Student ${i + 1}`, email: `student${i + 1}@test.com`, password, role: "student"
            })));
            lawyers = await User.insertMany(Array.from({ length: 3 }).map((_, i) => ({
                name: `Lawyer ${i + 1}`, email: `lawyer${i + 1}@test.com`, password, role: "lawyer"
            })));
            counselors = await User.insertMany(Array.from({ length: 2 }).map((_, i) => ({
                name: `Counselor ${i + 1}`, email: `counselor${i + 1}@test.com`, password, role: "counselor"
            })));
            admin = await User.create({ name: "Super Admin", email: "admin@test.com", password, role: "admin" });
        } else {
            console.log("Users exist. Loading existing users for reliable references...");
            students = await User.find({ role: "student" });
            lawyers = await User.find({ role: "lawyer" });
            counselors = await User.find({ role: "counselor" });
            admin = await User.findOne({ role: "admin" });
        }

        if(students.length === 0 || counselors.length === 0 || lawyers.length === 0 || !admin) {
            console.log("Not enough users to seed relationships reliably. Please clear DB entirely and re-run.");
            process.exit(1);
        }

        // CASES
        let testCase1, testCase2;
        if ((await Case.countDocuments()) === 0) {
            console.log("Seeding Cases...");
            testCase1 = await Case.create({
                caseNumber: "CASE-001",
                title: "Harassment Incident",
                description: "A student was repeatedly harassed.",
                severity: "Critical",
                status: "New",
                victim: { user: students[0]._id, name: students[0].name },
                assignedTo: { user: lawyers[0]._id, role: "lawyer" },
                incidentDate: new Date().toISOString().split("T")[0],
                timeline: [{ action: "Case Created", actor: "student", note: "Initial submission" }],
                aiAnalysis: { summary: "High risk of stalking", confidence: 0.9 }
            });

            testCase2 = await Case.create({
                caseNumber: "CASE-002",
                title: "Cyberbullying Online",
                description: "Fake accounts spreading rumors.",
                severity: "Moderate",
                status: "Under Review",
                victim: { user: students[1]._id, name: students[1].name },
                assignedTo: { user: counselors[0]._id, role: "counselor" },
                incidentDate: new Date().toISOString().split("T")[0],
                timeline: [
                    { action: "Case Created", actor: "student", note: "Submitted report" },
                    { action: "Assigned", actor: "admin", note: "Assigned to Counselor 1" }
                ],
                aiAnalysis: { summary: "Rumors detected", confidence: 0.82 }
            });
        }

        // COUNSELOR SESSIONS
        if ((await CounselorSession.countDocuments()) === 0 && testCase2) {
            console.log("Seeding Counselor Sessions...");
            await CounselorSession.create({
                counselor: counselors[0]._id,
                student: students[1]._id,
                caseId: testCase2._id,
                sessionDate: new Date(),
                notes: "Student is feeling stressed. Needs follow up.",
                status: "Completed"
            });
        }

        // APPOINTMENTS
        if ((await Appointment.countDocuments()) === 0) {
            console.log("Seeding Appointments...");
            await Appointment.create({
                student: students[0]._id,
                counselorName: counselors[0].name,
                counselorId: counselors[0]._id,
                date: new Date().toISOString().split("T")[0],
                time: "14:00",
                sessionType: "Video Call",
                reason: "Discussing recent incident.",
                status: "upcoming"
            });
            await Appointment.create({
                student: students[2]._id,
                counselorName: counselors[1].name,
                counselorId: counselors[1]._id,
                date: new Date().toISOString().split("T")[0],
                time: "16:00",
                sessionType: "In-Person",
                reason: "General counseling inquiry.",
                status: "completed"
            });
        }

        // NOTIFICATIONS
        if ((await Notification.countDocuments()) === 0 && testCase1 && testCase2) {
            console.log("Seeding Notifications...");
            await Notification.create([
                { userId: students[0]._id, message: "Your case CASE-001 has been received.", type: "Info", caseId: testCase1._id },
                { userId: counselors[0]._id, message: "You have been assigned to CASE-002.", type: "Alert", caseId: testCase2._id },
                { userId: lawyers[0]._id, message: "You have been assigned to CASE-001.", type: "Alert", caseId: testCase1._id },
                { userId: admin._id, message: "System Seeded Successfully.", type: "Info" }
            ]);
        }

        // AUDIT LOGS
        if ((await AuditLog.countDocuments()) === 0 && testCase1) {
            console.log("Seeding Audit Logs...");
            await AuditLog.create([
                { user: students[0]._id, role: "student", action: "Case Created", caseId: testCase1._id, details: "Submission created natively" },
                { user: admin._id, role: "admin", action: "System Action", details: "Sample data seeded." },
                { user: students[0]._id, role: "student", action: "Appointment Booked", targetUser: counselors[0]._id, details: "Attempted booking via automated seeder" }
            ]);
        }

        console.log("Seeding Completed Successfully! 🚀");
        process.exit(0);

    } catch (error) {
        console.error("Seeding Error:", error);
        process.exit(1);
    }
};

seedData();
