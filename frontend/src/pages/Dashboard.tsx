import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";

const Dashboard = () => {
    const navigate = useNavigate();
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
    const [stats, setStats] = useState({
        total: 0,
        new: 0,
        review: 0,
        resolved: 0,
    });
    const [legalCount, setLegalCount] = useState(0);
    const [therapyCount, setTherapyCount] = useState(0);
    const [recentCases, setRecentCases] = useState<any[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const statsRes = await api.get("/cases/stats");
                setStats({
                    total: statsRes.data.totalCases || 0,
                    new: statsRes.data.new || 0,
                    review: statsRes.data.review || 0,
                    resolved: statsRes.data.resolved || 0
                });

                const casesRes = await api.get("/cases");
                const allCases = Array.isArray(casesRes.data) ? casesRes.data : (casesRes.data.cases || []);
                setRecentCases(allCases.slice(0, 3));

                const legalRes = await api.get("/legal/my");
                setLegalCount(Array.isArray(legalRes.data) ? legalRes.data.length : (legalRes.data.consultations?.length || 0));

                const therapyRes = await api.get("/therapy/my");
                setTherapyCount(Array.isArray(therapyRes.data) ? therapyRes.data.length : (therapyRes.data.sessions?.length || 0));
            } catch (error) {
                console.error("Dashboard fetch error", error);
            }
        };
        fetchDashboardData();

        const quoteInterval = setInterval(() => {
            setCurrentQuoteIndex((prev) => (prev + 1) % motivationalFlashcards.length);
        }, 8000);

        return () => clearInterval(quoteInterval);
    }, []);

    const pillars = [
        { name: "Report Incident", path: "/report", icon: "🚨", description: "File a new incident", color: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)" },
        { name: "Case Management", path: "/cases", icon: "📋", description: "Track your cases", color: "linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)" },
        { name: "Abuse Detection", path: "/nlp", icon: "🤖", description: "AI Text Analysis", color: "linear-gradient(135deg, #8b5cf6 0%, #4c1d95 100%)", badge: "NEW" },
        { name: "Legal Consultation", path: "/legal", icon: "⚖️", description: "Expert legal advice", color: "linear-gradient(135deg, #f59e0b 0%, #92400e 100%)" },
        { name: "Therapy Support", path: "/therapy", icon: "🧘", description: "Mental health help", color: "linear-gradient(135deg, #ec4899 0%, #9d174d 100%)" },
        { name: "Corporate Report", path: "/linkedin-report", icon: "💼", description: "Workplace safety", color: "linear-gradient(135deg, #0a66c2 0%, #004182 100%)" },
    ];

    const motivationalFlashcards = [
        { title: "🌸 You Are Not Alone", content: "Thousands have stood where you stand. We are here to support you." },
        { title: "💪 Courage is Within You", content: "The first step is hardest, but you've already taken it. You are strong." },
        { title: "🛡️ Your Safety Matters", content: "You deserve to feel safe online and offline. Never forget your worth." },
        { title: "⚖️ Justice is Possible", content: "The law is on your side. Cyber harassment is a crime, not your fault." },
    ];

    return (
        <div className="dashboard-root">


            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

                    .dashboard-root {
                        font-family: 'Plus Jakarta Sans', sans-serif;
                        background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
                        min-height: 100vh;
                        padding-top: 80px;
                        color: #7f1a1a;
                    }

                    .main-layout {
                        max-width: 1400px;
                        margin: 0 auto;
                        padding: 40px;
                        display: grid;
                        grid-template-columns: 1fr 380px;
                        gap: 32px;
                    }

                    @media (max-width: 1100px) {
                        .main-layout {
                            grid-template-columns: 1fr;
                        }
                    }

                    /* Header Section */
                    .header-section {
                        margin-bottom: 40px;
                    }

                    .welcome-banner {
                        background: linear-gradient(135deg, #991b1b 0%, #7f1a1a 100%);
                        border-radius: 24px;
                        padding: 48px;
                        color: white;
                        position: relative;
                        overflow: hidden;
                        box-shadow: 0 20px 25px -5px rgba(153, 27, 27, 0.3);
                    }

                    .welcome-banner::before {
                        content: '';
                        position: absolute;
                        top: -50%;
                        right: -10%;
                        width: 400px;
                        height: 400px;
                        background: radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, transparent 70%);
                        pointer-events: none;
                    }

                    .welcome-banner h1 {
                        font-size: 36px;
                        font-weight: 800;
                        margin-bottom: 12px;
                        letter-spacing: -0.02em;
                    }

                    .welcome-banner p {
                        font-size: 18px;
                        opacity: 0.9;
                        max-width: 600px;
                        line-height: 1.6;
                    }

                    /* Stats Grid */
                    .stats-grid {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 20px;
                        margin-top: -30px;
                        padding: 0 40px;
                        position: relative;
                        z-index: 10;
                    }

                    @media (max-width: 900px) {
                        .stats-grid {
                            grid-template-columns: repeat(2, 1fr);
                        }
                    }

                    .stat-card {
                        background: white;
                        border-radius: 20px;
                        padding: 24px;
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
                        border: 1px solid #ffe0e0;
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                        display: flex;
                        flex-direction: column;
                    }

                    .stat-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 20px 25px -5px rgba(220, 38, 38, 0.15);
                        border-color: #fecaca;
                    }

                    .stat-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 16px;
                    }

                    .stat-icon {
                        width: 40px;
                        height: 40px;
                        border-radius: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 20px;
                    }

                    .stat-value {
                        font-size: 32px;
                        font-weight: 800;
                        color: #991b1b;
                    }

                    .stat-label {
                        font-size: 14px;
                        color: #b91c1c;
                        font-weight: 600;
                    }

                    /* Content Sections */
                    .pillars-section {
                        margin-top: 40px;
                    }

                    .section-title {
                        font-size: 22px;
                        font-weight: 700;
                        margin-bottom: 24px;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        color: #991b1b;
                    }

                    .pillar-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                        gap: 20px;
                    }

                    .pillar-card {
                        background: white;
                        border-radius: 20px;
                        padding: 24px;
                        border: 1px solid #ffe0e0;
                        cursor: pointer;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        position: relative;
                        overflow: hidden;
                    }

                    .pillar-card:hover {
                        border-color: #ef4444;
                        background: #fff5f5;
                        transform: translateY(-4px);
                        box-shadow: 0 8px 20px rgba(239, 68, 68, 0.15);
                    }

                    .pillar-icon-box {
                        width: 56px;
                        height: 56px;
                        border-radius: 16px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 28px;
                        margin-bottom: 20px;
                        color: white;
                    }

                    .pillar-card h3 {
                        font-size: 18px;
                        font-weight: 700;
                        margin-bottom: 8px;
                        color: #7f1a1a;
                    }

                    .pillar-card p {
                        font-size: 14px;
                        color: #b91c1c;
                        line-height: 1.5;
                    }

                    .badge {
                        position: absolute;
                        top: 16px;
                        right: 16px;
                        background: #ef4444;
                        color: white;
                        font-size: 10px;
                        font-weight: 800;
                        padding: 4px 8px;
                        border-radius: 20px;
                    }

                    /* Right Sidebar */
                    .sidebar-content {
                        display: flex;
                        flex-direction: column;
                        gap: 32px;
                    }

                    .side-card {
                        background: white;
                        border-radius: 24px;
                        padding: 28px;
                        border: 1px solid #ffe0e0;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                    }

                    .quote-display {
                        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                        color: white;
                        min-height: 200px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        text-align: center;
                        transition: all 0.5s ease;
                    }

                    .quote-display h4 {
                        font-size: 14px;
                        text-transform: uppercase;
                        letter-spacing: 0.1em;
                        opacity: 0.9;
                        margin-bottom: 16px;
                    }

                    .quote-display p {
                        font-size: 20px;
                        font-weight: 600;
                        line-height: 1.5;
                    }

                    .activity-list {
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                    }

                    .activity-item {
                        display: flex;
                        gap: 16px;
                        align-items: flex-start;
                    }

                    .activity-icon {
                        width: 40px;
                        height: 40px;
                        border-radius: 10px;
                        background: #fff5f5;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex-shrink: 0;
                    }

                    .activity-info h5 {
                        font-size: 14px;
                        font-weight: 700;
                        margin-bottom: 4px;
                        color: #991b1b;
                    }

                    .activity-info p {
                        font-size: 13px;
                        color: #b91c1c;
                    }

                    /* Emergency Bar */
                    .emergency-widget {
                        background: #fff5f5;
                        border: 1px solid #fee2e2;
                        padding: 24px;
                        border-radius: 20px;
                        margin-top: 40px;
                    }

                    .emergency-widget h3 {
                        color: #991b1b;
                        font-size: 18px;
                        margin-bottom: 12px;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }

                    .emergency-contacts {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                        gap: 12px;
                    }

                    .contact-pill {
                        background: white;
                        border: 1px solid #fee2e2;
                        padding: 8px 16px;
                        border-radius: 12px;
                        font-size: 13px;
                        font-weight: 600;
                        color: #b91c1c;
                        text-align: center;
                    }

                    .call-emergency-btn {
                        width: 100%;
                        background: #dc2626;
                        color: white;
                        border: none;
                        padding: 14px;
                        border-radius: 12px;
                        font-weight: 700;
                        margin-top: 20px;
                        cursor: pointer;
                        transition: all 0.2s;
                    }

                    .call-emergency-btn:hover {
                        background: #b91c1c;
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
                    }

                    /* Animations */
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    .animate {
                        animation: fadeIn 0.5s ease forwards;
                    }

                    /* Additional Red Theme Elements */
                    .pillar-card .pillar-icon-box {
                        box-shadow: 0 4px 8px rgba(220, 38, 38, 0.1);
                    }

                    .stat-card .stat-icon {
                        background: #fff5f5 !important;
                    }
                `}
            </style>

            <div className="main-layout">
                {/* Left Content */}
                <div className="dashboard-content">
                    <header className="header-section animate">
                        <div className="welcome-banner">
                            <h1>Welcome to RakshaNet 🛡️</h1>
                            <p>Empowering you with AI-driven cyber safety, instant incident reporting, and professional legal & emotional support. You are not alone.</p>
                        </div>
                    </header>

                    <div className="stats-grid animate" style={{ animationDelay: '0.1s' }}>
                        <div className="stat-card">
                            <div className="stat-header">
                                <span className="stat-label">Total Cases</span>
                                <div className="stat-icon" style={{ background: '#fff5f5', color: '#dc2626' }}>📁</div>
                            </div>
                            <div className="stat-value">{stats.total}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-header">
                                <span className="stat-label">Resolved</span>
                                <div className="stat-icon" style={{ background: '#fff5f5', color: '#10b981' }}>✅</div>
                            </div>
                            <div className="stat-value">{stats.resolved}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-header">
                                <span className="stat-label">Consultations</span>
                                <div className="stat-icon" style={{ background: '#fff5f5', color: '#f59e0b' }}>⚖️</div>
                            </div>
                            <div className="stat-value">{legalCount}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-header">
                                <span className="stat-label">Support sessions</span>
                                <div className="stat-icon" style={{ background: '#fff5f5', color: '#ec4899' }}>🧘</div>
                            </div>
                            <div className="stat-value">{therapyCount}</div>
                        </div>
                    </div>

                    <section className="pillars-section animate" style={{ animationDelay: '0.2s' }}>
                        <h2 className="section-title">Safety Solutions</h2>
                        <div className="pillar-grid">
                            {pillars.map((p, i) => (
                                <div key={i} className="pillar-card" onClick={() => navigate(p.path)}>
                                    {p.badge && <span className="badge">{p.badge}</span>}
                                    <div className="pillar-icon-box" style={{ background: p.color }}>
                                        {p.icon}
                                    </div>
                                    <h3>{p.name}</h3>
                                    <p>{p.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="emergency-widget animate" style={{ animationDelay: '0.3s' }}>
                        <h3>🚨 24/7 Emergency Response</h3>
                        <div className="emergency-contacts">
                            <div className="contact-pill">Helpline: 181</div>
                            <div className="contact-pill">Cyber Crime: 1930</div>
                            <div className="contact-pill">NCW: 7827170170</div>
                            <div className="contact-pill">Police: 112</div>
                        </div>
                        <button className="call-emergency-btn" onClick={() => window.location.href = "tel:112"}>
                            Call Urgent Emergency Services
                        </button>
                    </section>
                </div>

                {/* Right Sidebar */}
                <aside className="sidebar-content animate" style={{ animationDelay: '0.4s' }}>
                    <div className="side-card quote-display">
                        <h4>{motivationalFlashcards[currentQuoteIndex].title}</h4>
                        <p>"{motivationalFlashcards[currentQuoteIndex].content}"</p>
                    </div>

                    <div className="side-card">
                        <h2 className="section-title" style={{ fontSize: '18px', marginBottom: '20px' }}>Recent Activity</h2>
                        <div className="activity-list">
                            {recentCases.length > 0 ? (
                                recentCases.map((c, i) => (
                                    <div key={i} className="activity-item">
                                        <div className="activity-icon">📄</div>
                                        <div className="activity-info">
                                            <h5>Case #{c.caseNumber}</h5>
                                            <p>{c.status} • {new Date(c.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ fontSize: '14px', color: '#b91c1c', textAlign: 'center' }}>No recent activity found.</p>
                            )}
                        </div>
                        {recentCases.length > 0 && (
                            <button
                                onClick={() => navigate('/cases')}
                                style={{ width: '100%', marginTop: '20px', padding: '10px', background: '#fff5f5', border: '1px solid #fee2e2', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', color: '#b91c1c' }}
                            >
                                View All Activity
                            </button>
                        )}
                    </div>

                    <div className="side-card" style={{ background: '#fff5f5' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '12px', color: '#991b1b' }}>🔒 Safe & Confidential</h4>
                        <p style={{ fontSize: '13px', color: '#b91c1c', lineHeight: '1.6' }}>
                            All reports and consultations are end-to-end encrypted. Your identity is always protected unless you choose to reveal it.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Dashboard;