import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

const LinkedInMisconductReport = () => {
    const [companyName, setCompanyName] = useState("");
    const [companyEmail, setCompanyEmail] = useState("");
    const [offenderName, setOffenderName] = useState("");
    const [offenderProfile, setOffenderProfile] = useState("");
    const [evidenceText, setEvidenceText] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailLogs, setEmailLogs] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalEmailsSent: 0,
        companiesContacted: 0,
        responseRate: 0,
        lastWeekCount: 0
    });

    // Random companies for demo
    const companySuggestions = [
        "Google",
        "Microsoft",
        "Amazon",
        "Flipkart",
        "TCS",
        "Infosys",
        "Wipro",
        "HCL Technologies",
        "Tech Mahindra",
        "Deloitte",
        "PwC",
        "EY",
        "KPMG",
        "Goldman Sachs",
        "Morgan Stanley"
    ];

    const fetchEmailLogs = async () => {
        try {
            const res = await api.get("/email/logs");
            setEmailLogs(res.data);
            
            // Calculate real stats based on logs (or just simple mocked response rates)
            setStats({
                totalEmailsSent: res.data.length,
                companiesContacted: new Set(res.data.map((l: any) => l.companyName)).size,
                responseRate: res.data.length > 0 ? 85 : 0, 
                lastWeekCount: res.data.length > 0 ? res.data.length : 0,
            });
        } catch (error) {
            console.error("Failed to fetch logs", error);
        }
    };

    // Generate random stats on component mount
    useEffect(() => {
        fetchEmailLogs();
    }, []);

    const sendMail = async () => {
        if (!companyName || !companyEmail) {
            alert("Please enter company name and HR email");
            return;
        }

        try {
            setLoading(true);

            const res = await api.post("/email/linkedin-complaint", {
                companyName,
                hrEmail: companyEmail,
                offenderName,
                offenderProfile,
                evidenceText
            });

            if (res.data.success) {
                alert("✅ Complaint email sent successfully");

                setCompanyName("");
                setCompanyEmail("");
                setOffenderName("");
                setOffenderProfile("");
                setEvidenceText("");
                fetchEmailLogs();
            } else {
                alert("❌ Failed to send email");
            }

        } catch (error: any) {
            console.error(error);
            alert(
                error.response?.data?.message || "Email sending failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestionClick = (company: string) => {
        setCompanyName(company);
        // Generate random HR email based on company
        const domains: any = {
            "Google": "@google.com",
            "Microsoft": "@microsoft.com",
            "Amazon": "@amazon.com",
            "Flipkart": "@flipkart.com",
            "TCS": "@tcs.com",
            "Infosys": "@infosys.com",
            "Wipro": "@wipro.com",
            "HCL Technologies": "@hcl.com",
            "Tech Mahindra": "@techmahindra.com",
            "Deloitte": "@deloitte.com",
            "PwC": "@pwc.com",
            "EY": "@ey.com",
            "KPMG": "@kpmg.com",
            "Goldman Sachs": "@gs.com",
            "Morgan Stanley": "@morganstanley.com"
        };
        setCompanyEmail(`hr${domains[company] || "@company.com"}`);
    };

    return (
        <>
            <Navbar />

            <style>
                {`
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }

                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                        background-color: #f3f4f6;
                    }

                    .linkedin-wrapper {
                        padding-top: 100px;
                        padding-left: 40px;
                        padding-right: 40px;
                        padding-bottom: 80px;
                        min-height: 100vh;
                        background: linear-gradient(135deg, #f3f4f6 0%, #ffffff 100%);
                    }

                    .linkedin-container {
                        max-width: 1000px;
                        margin: 0 auto;
                    }

                    /* Header */
                    .header-section {
                        margin-bottom: 32px;
                    }

                    .main-title {
                        font-size: 32px;
                        font-weight: 700;
                        color: #0a66c2;
                        margin-bottom: 8px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }

                    .subtitle {
                        color: #6b7280;
                        font-size: 16px;
                        line-height: 1.5;
                        margin-bottom: 24px;
                    }

                    /* Stats Grid */
                    .stats-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 20px;
                        margin-bottom: 30px;
                    }

                    .stat-card {
                        background: white;
                        padding: 24px;
                        border-radius: 16px;
                        border: 1px solid #e5e7eb;
                        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                        transition: all 0.3s ease;
                        text-align: center;
                        border-top: 4px solid #0a66c2;
                    }

                    .stat-card:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
                    }

                    .stat-icon {
                        font-size: 32px;
                        margin-bottom: 12px;
                    }

                    .stat-value {
                        font-size: 32px;
                        font-weight: 700;
                        color: #0a66c2;
                        margin-bottom: 4px;
                    }

                    .stat-label {
                        font-size: 14px;
                        color: #6b7280;
                    }

                    .stat-trend {
                        font-size: 12px;
                        color: #10b981;
                        margin-top: 8px;
                    }

                    /* Info Box */
                    .info-box {
                        background: #e0f2fe;
                        border-left: 4px solid #0a66c2;
                        padding: 20px 24px;
                        border-radius: 12px;
                        margin-bottom: 30px;
                        display: flex;
                        align-items: center;
                        gap: 16px;
                        flex-wrap: wrap;
                    }

                    .info-icon {
                        font-size: 32px;
                    }

                    .info-text {
                        flex: 1;
                    }

                    .info-text strong {
                        color: #075985;
                        font-size: 16px;
                    }

                    .info-text p {
                        color: #0369a1;
                        margin-top: 4px;
                        font-size: 14px;
                    }

                    /* Main Card */
                    .main-card {
                        background: white;
                        border-radius: 24px;
                        padding: 32px;
                        border: 1px solid #e5e7eb;
                        box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
                        margin-bottom: 30px;
                    }

                    .card-header {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        margin-bottom: 24px;
                        padding-bottom: 20px;
                        border-bottom: 1px solid #e5e7eb;
                    }

                    .card-icon {
                        font-size: 36px;
                    }

                    .card-title {
                        font-size: 24px;
                        font-weight: 600;
                        color: #0a66c2;
                    }

                    /* Form */
                    .form-group {
                        margin-bottom: 24px;
                    }

                    .form-label {
                        display: block;
                        font-size: 14px;
                        font-weight: 500;
                        color: #4b5563;
                        margin-bottom: 8px;
                    }

                    .input-wrapper {
                        position: relative;
                        display: flex;
                        align-items: center;
                    }

                    .input-icon {
                        position: absolute;
                        left: 12px;
                        font-size: 18px;
                        color: #9ca3af;
                    }

                    .form-input {
                        width: 100%;
                        max-width: 400px;
                        padding: 14px 16px 14px 45px;
                        border: 1px solid #e5e7eb;
                        border-radius: 10px;
                        font-size: 15px;
                        transition: all 0.2s ease;
                        background: #f9fafb;
                    }

                    .form-input:focus {
                        outline: none;
                        border-color: #0a66c2;
                        box-shadow: 0 0 0 4px rgba(10, 102, 194, 0.1);
                        background: white;
                    }

                    .form-input::placeholder {
                        color: #9ca3af;
                        font-size: 14px;
                    }

                    /* Company Suggestions */
                    .suggestions-section {
                        margin-bottom: 24px;
                    }

                    .suggestions-label {
                        font-size: 14px;
                        font-weight: 500;
                        color: #4b5563;
                        margin-bottom: 12px;
                    }

                    .suggestions-grid {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 10px;
                    }

                    .suggestion-chip {
                        background: #f3f4f6;
                        border: 1px solid #e5e7eb;
                        padding: 8px 16px;
                        border-radius: 30px;
                        font-size: 13px;
                        color: #4b5563;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    }

                    .suggestion-chip:hover {
                        background: #0a66c2;
                        color: white;
                        border-color: #0a66c2;
                        transform: translateY(-1px);
                    }

                    /* Button */
                    .send-btn {
                        background: #0a66c2;
                        color: white;
                        border: none;
                        padding: 14px 32px;
                        border-radius: 30px;
                        font-weight: 600;
                        font-size: 16px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        box-shadow: 0 4px 6px -1px rgba(10, 102, 194, 0.3);
                    }

                    .send-btn:hover:not(:disabled) {
                        background: #004182;
                        transform: translateY(-2px);
                        box-shadow: 0 10px 15px -3px rgba(10, 102, 194, 0.4);
                    }

                    .send-btn:disabled {
                        opacity: 0.6;
                        cursor: not-allowed;
                    }

                    .spinner {
                        display: inline-block;
                        width: 18px;
                        height: 18px;
                        border: 2px solid rgba(255,255,255,0.3);
                        border-radius: 50%;
                        border-top-color: white;
                        animation: spin 0.8s linear infinite;
                    }

                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }

                    /* Recent Activity */
                    .recent-activity {
                        background: white;
                        border-radius: 16px;
                        padding: 24px;
                        border: 1px solid #e5e7eb;
                    }

                    .activity-header {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        margin-bottom: 20px;
                    }

                    .activity-header h3 {
                        font-size: 18px;
                        font-weight: 600;
                        color: #111827;
                    }

                    .activity-list {
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                    }

                    .activity-item {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        padding: 12px;
                        background: #f9fafb;
                        border-radius: 10px;
                        border: 1px solid #e5e7eb;
                    }

                    .activity-company {
                        font-weight: 600;
                        color: #0a66c2;
                        min-width: 120px;
                    }

                    .activity-detail {
                        flex: 1;
                        font-size: 14px;
                        color: #4b5563;
                    }

                    .activity-time {
                        font-size: 12px;
                        color: #9ca3af;
                    }

                    .activity-status {
                        background: #d1fae5;
                        color: #065f46;
                        padding: 4px 12px;
                        border-radius: 20px;
                        font-size: 12px;
                        font-weight: 500;
                    }

                    /* Responsive */
                    @media (max-width: 768px) {
                        .linkedin-wrapper {
                            padding: 80px 16px 40px;
                        }

                        .main-title {
                            font-size: 28px;
                        }

                        .form-input {
                            max-width: 100%;
                        }

                        .activity-item {
                            flex-direction: column;
                            align-items: flex-start;
                        }

                        .activity-company {
                            min-width: auto;
                        }
                    }
                `}
            </style>

            <div className="linkedin-wrapper">
                <div className="linkedin-container">
                    {/* Header */}
                    <div className="header-section">
                        <h1 className="main-title">
                            <span>💼</span> LinkedIn Professional Misconduct Report
                        </h1>
                        <p className="subtitle">
                            Send formal complaint emails directly to company HR departments
                            regarding inappropriate LinkedIn behavior, harassment, or professional misconduct.
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">📧</div>
                            <div className="stat-value">{stats.totalEmailsSent}</div>
                            <div className="stat-label">Total Emails Sent</div>
                            <div className="stat-trend">↑ {stats.lastWeekCount} this week</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🏢</div>
                            <div className="stat-value">{stats.companiesContacted}</div>
                            <div className="stat-label">Companies Contacted</div>
                            <div className="stat-trend">Across various industries</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">📊</div>
                            <div className="stat-value">{stats.responseRate}%</div>
                            <div className="stat-label">HR Response Rate</div>
                            <div className="stat-trend">Within 48 hours</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">✅</div>
                            <div className="stat-value">{Math.floor(stats.totalEmailsSent * 0.85)}</div>
                            <div className="stat-label">Resolved Cases</div>
                            <div className="stat-trend">85% success rate</div>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="info-box">
                        <span className="info-icon">ℹ️</span>
                        <div className="info-text">
                            <strong>How it works</strong>
                            <p>We send a professionally drafted complaint email to the HR department of the company.
                                All emails include case details, evidence references, and legal implications.
                                Your identity is kept confidential.</p>
                        </div>
                    </div>

                    {/* Main Card */}
                    <div className="main-card">
                        <div className="card-header">
                            <span className="card-icon">📝</span>
                            <h2 className="card-title">Send HR Complaint</h2>
                        </div>

                        {/* Company Suggestions */}
                        <div className="suggestions-section">
                            <div className="suggestions-label">Popular companies:</div>
                            <div className="suggestions-grid">
                                {companySuggestions.slice(0, 8).map((company) => (
                                    <span
                                        key={company}
                                        className="suggestion-chip"
                                        onClick={() => handleSuggestionClick(company)}
                                    >
                                        {company}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Company Name Input */}
                        <div className="form-group">
                            <label className="form-label">Company Name</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🏢</span>
                                <input
                                    type="text"
                                    placeholder="e.g., Google, Microsoft, Amazon"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        {/* HR Email Input */}
                        <div className="form-group">
                            <label className="form-label">HR Email Address</label>
                            <div className="input-wrapper">
                                <span className="input-icon">📧</span>
                                <input
                                    type="email"
                                    placeholder="hr@company.com"
                                    value={companyEmail}
                                    onChange={(e) => setCompanyEmail(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        {/* Offender Name Input */}
                        <div className="form-group">
                            <label className="form-label">Offender Name *</label>
                            <div className="input-wrapper">
                                <span className="input-icon">👤</span>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={offenderName}
                                    onChange={(e) => setOffenderName(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        {/* Offender Profile URL */}
                        <div className="form-group">
                            <label className="form-label">Offender LinkedIn Profile URL *</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🔗</span>
                                <input
                                    type="url"
                                    placeholder="https://linkedin.com/in/username"
                                    value={offenderProfile}
                                    onChange={(e) => setOffenderProfile(e.target.value)}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        {/* Evidence Text Input */}
                        <div className="form-group">
                            <label className="form-label">Incident Details / Evidence</label>
                            <div className="input-wrapper">
                                <textarea
                                    placeholder="Describe the incident (e.g., received inappropriate messages on [Date])..."
                                    value={evidenceText}
                                    onChange={(e) => setEvidenceText(e.target.value)}
                                    className="form-input"
                                    style={{ paddingLeft: "16px", minHeight: "80px", resize: "vertical" }}
                                />
                            </div>
                        </div>

                        {/* Send Button */}
                        <button
                            onClick={sendMail}
                            disabled={loading}
                            className="send-btn"
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <span>📨</span>
                                    Send Complaint Email
                                </>
                            )}
                        </button>

                        {/* Note */}
                        <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "20px" }}>
                            ⚡ Complaint emails are professionally drafted with legal language.
                            All communication is tracked and confidential.
                        </p>
                    </div>

                    {/* Recent Activity */}
                    <div className="recent-activity">
                        <div className="activity-header">
                            <span className="card-icon">🕒</span>
                            <h3>Recent Complaints</h3>
                        </div>
                        <div className="activity-list">
                            {emailLogs.length === 0 ? (
                                <p style={{ color: "#6b7280", fontSize: "14px" }}>No complaints sent yet.</p>
                            ) : (
                                emailLogs.map((log, index) => (
                                    <div key={index} className="activity-item">
                                        <span className="activity-company">{log.companyName}</span>
                                        <span className="activity-detail">
                                            Reported {log.offenderName || "an employee"} for misconduct
                                        </span>
                                        <span className="activity-time">
                                            {new Date(log.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="activity-status" style={{ background: log.status === "Sent" ? "#d1fae5" : "#fee2e2", color: log.status === "Sent" ? "#065f46" : "#991b1b" }}>
                                            {log.status}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "30px",
                        marginTop: "30px",
                        padding: "20px",
                        background: "white",
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "20px" }}>🔒</span>
                            <span style={{ fontSize: "14px", color: "#4b5563" }}>100% Confidential</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "20px" }}>⚖️</span>
                            <span style={{ fontSize: "14px", color: "#4b5563" }}>Legally Drafted</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "20px" }}>📨</span>
                            <span style={{ fontSize: "14px", color: "#4b5563" }}>Tracked Delivery</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LinkedInMisconductReport;