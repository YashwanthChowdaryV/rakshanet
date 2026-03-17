require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const therapyRoutes = require("./routes/therapyRoutes");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const path = require("path");
const emailRoutes = require("./routes/emailRoutes");
// Initialize Express App
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
    cors({
        origin: "http://localhost:5173", // frontend URL
        credentials: true,
    })
);




app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/v1/therapy", therapyRoutes);
// Routes
const legalRoutes = require("./routes/legalRoutes");
app.use("/api/v1/auth", authRoutes);
const caseRoutes = require("./routes/caseRoutes");
app.use("/api/v1/cases", caseRoutes);
app.use("/api/v1/complaints", complaintRoutes);
app.use("/api/v1/legal", legalRoutes);
app.use("/api/v1/email", emailRoutes);
// Base Route
app.get("/", (req, res) => {
    res.json({ message: "🛡️ RakshaNet API Running" });
});

// Global Error Handler (Optional but recommended)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});