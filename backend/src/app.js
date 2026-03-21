require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const emailRoutes = require("./routes/emailRoutes");
const therapyRoutes = require("./routes/therapyRoutes");
const legalRoutes = require("./routes/legalRoutes");
const caseRoutes = require("./routes/caseRoutes");
const nlpRoutes = require("./routes/nlpRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const counselorRoutes = require("./routes/counselorRoutes");
const auditRoutes = require("./routes/auditRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

// Logger
const { requestLogger, errorLogger } = require("./utils/logger");

// Initialize app
const app = express();


// =============================
// ✅ Connect Database
// =============================
connectDB();


// =============================
// ✅ Middleware
// =============================

// CORS
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

// Security
app.use(helmet());

// Logging
app.use(morgan("dev"));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom request logger
app.use(requestLogger);


// =============================
// ✅ Static Folder
// =============================
app.use(
    "/uploads",
    express.static(path.join(__dirname, "../uploads"))
);


// =============================
// ✅ API Routes
// =============================

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/complaints", complaintRoutes);

app.use("/api/v1/email", emailRoutes);

app.use("/api/v1/therapy", therapyRoutes);

app.use("/api/v1/legal", legalRoutes);

app.use("/api/v1/cases", caseRoutes);

app.use("/api/v1/nlp", nlpRoutes);

app.use("/api/v1/resources", resourceRoutes);

app.use("/api/v1/counselor", counselorRoutes);

app.use("/api/v1/audit", auditRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
// =============================
// ✅ Base Route
// =============================
app.get("/", (req, res) => {
    res.json({
        message: "🛡️ RakshaNet API Running",
    });
});


// =============================
// ✅ Error Logger
// =============================
app.use(errorLogger);


// =============================
// ✅ Global Error Handler
// =============================
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
});


// =============================
// ✅ Start Server
// =============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});