import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";

const Dashboard = () => {
    const navigate = useNavigate();
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
    const [casesCount, setCasesCount] = useState(0);
    const [legalCount, setLegalCount] = useState(0);
    const [therapyCount, setTherapyCount] = useState(0);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const casesRes = await api.get("/cases");
                setCasesCount(casesRes.data?.cases?.length || 0);

                const legalRes = await api.get("/legal/my");
                setLegalCount(legalRes.data?.length || 0);

                const therapyRes = await api.get("/therapy/my");
                setTherapyCount(therapyRes.data?.length || 0);
            } catch (error) {
                console.error("Dashboard fetch error", error);
            }
        };
        fetchDashboardData();
    }, []);

    const pillars = [
        {
            name: "Report Incident",
            path: "/report",
            icon: "🚨",
            description: "File a new cyber incident report",
            color: "#2563eb"
        },
        {
            name: "Case Management",
            path: "/cases",
            icon: "📋",
            description: "Track your ongoing cases",
            color: "#7c3aed"
        },
        {
            name: "AI Abuse Detection (NLP)",
            path: "/nlp",
            icon: "🤖",
            description: "Analyze text for harassment, threats & blackmail",
            color: "#0891b2"
        },
        {
            name: "Legal Consultation",
            path: "/legal",
            icon: "⚖️",
            description: "Free legal advice from experts",
            color: "#b45309"
        },
        {
            name: "Therapy Support",
            path: "/therapy",
            icon: "🧘",
            description: "Mental health & counseling",
            color: "#be185d"
        },
        {
            name: "LinkedIn Report",
            path: "/linkedin-report",
            icon: "💼",
            description: "Corporate harassment reporting",
            color: "#0a66c2"
        },
    ];

    const motivationalFlashcards = [
        {
            title: "🌸 You Are Not Alone",
            content: "Thousands of women have stood where you stand today. Your voice matters, and we are here to support you every step of the way."
        },
        {
            title: "💪 Courage is Within You",
            content: "The first step is always the hardest, but you've already taken it by being here. You are stronger than you know."
        },
        {
            title: "🛡️ Your Safety Matters",
            content: "You deserve to feel safe online and offline. Never let anyone make you feel otherwise."
        },
        {
            title: "🌟 Every Voice Counts",
            content: "When you speak up, you not only help yourself but also inspire countless others to find their voice."
        },
        {
            title: "🤝 You Have Support",
            content: "Our counselors, lawyers, and support team are just a click away. You never have to face this alone."
        },
        {
            title: "🌅 A New Beginning",
            content: "Every day is a chance to start fresh. Don't let the past define your future."
        },
        {
            title: "💖 Self-Care is Not Selfish",
            content: "Taking care of your mental health is essential. You cannot pour from an empty cup."
        },
        {
            title: "⚖️ Justice is Possible",
            content: "The law is on your side. Cyber harassment is a crime, and perpetrators can be held accountable."
        },
        {
            title: "🌺 You Are Worthy",
            content: "You deserve respect, dignity, and happiness. No one has the right to take that away from you."
        },
        {
            title: "🕊️ Peace is Your Right",
            content: "You have the right to live without fear, harassment, or intimidation."
        }
    ];

    const nextQuote = () => {
        setCurrentQuoteIndex((prev) => (prev + 1) % motivationalFlashcards.length);
    };

    const prevQuote = () => {
        setCurrentQuoteIndex((prev) => (prev - 1 + motivationalFlashcards.length) % motivationalFlashcards.length);
    };

    return (
        <>
            <style>
                {`
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }

                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                        background-color: #ffffff;
                    }

                    .dashboard-wrapper {
                        padding-top: 100px;
                        padding-left: 40px;
                        padding-right: 40px;
                        padding-bottom: 60px;
                        min-height: 100vh;
                        background-color: #ffffff;
                    }

                    .dashboard-container {
                        max-width: 1200px;
                        margin: 0 auto;
                    }

                    /* Welcome Section */
                    .welcome-section {
                        text-align: center;
                        margin-bottom: 40px;
                        padding: 20px 0;
                    }

                    .welcome-title {
                        font-size: 36px;
                        font-weight: 700;
                        color: #1e293b;
                        margin-bottom: 12px;
                    }

                    .welcome-subtitle {
                        font-size: 18px;
                        color: #64748b;
                        max-width: 700px;
                        margin: 0 auto;
                        line-height: 1.6;
                    }

                    /* Quick Stats Grid */
                    .quick-stats-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 20px;
                        margin-bottom: 40px;
                    }

                    .stat-widget {
                        background: #f8fafc;
                        border: 1px solid #e2e8f0;
                        padding: 24px;
                        border-radius: 16px;
                        text-align: center;
                        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                        transition: transform 0.2s ease;
                        cursor: pointer;
                    }

                    .stat-widget:hover {
                        transform: translateY(-4px);
                        border-color: #cbd5e1;
                    }

                    .stat-number {
                        font-size: 32px;
                        font-weight: 800;
                        color: #0f172a;
                        margin-bottom: 8px;
                    }

                    .stat-label {
                        font-size: 14px;
                        color: #64748b;
                        font-weight: 500;
                    }

                    /* Pillar Grid - Main Navigation */
                    .pillar-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                        gap: 24px;
                        margin-bottom: 60px;
                    }

                    .pillar-card {
                        background: #ffffff;
                        border-radius: 16px;
                        padding: 28px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        border: 1px solid #e2e8f0;
                        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                        position: relative;
                        overflow: hidden;
                    }

                    .pillar-card::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        height: 4px;
                        background: ${pillars.map(p => p.color).join(', ')};
                        background: linear-gradient(90deg, ${pillars.map(p => p.color).join(', ')});
                    }

                    .pillar-card:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
                        border-color: #cbd5e1;
                    }

                    .pillar-icon {
                        font-size: 48px;
                        margin-bottom: 16px;
                    }

                    .pillar-card h3 {
                        font-size: 22px;
                        font-weight: 600;
                        margin-bottom: 8px;
                        color: #1e293b;
                    }

                    .pillar-description {
                        font-size: 14px;
                        color: #64748b;
                        line-height: 1.5;
                        margin-bottom: 16px;
                    }

                    .pillar-arrow {
                        font-size: 20px;
                        opacity: 0;
                        transform: translateX(-10px);
                        transition: all 0.3s ease;
                        color: #2563eb;
                    }

                    .pillar-card:hover .pillar-arrow {
                        opacity: 1;
                        transform: translateX(0);
                    }

                    /* NLP Badge */
                    .nlp-badge {
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        background: #0891b2;
                        color: white;
                        font-size: 10px;
                        padding: 4px 8px;
                        border-radius: 20px;
                        font-weight: 600;
                        letter-spacing: 0.5px;
                    }

                    /* Motivational Flashcards Section */
                    .flashcard-section {
                        margin-top: 40px;
                    }

                    .section-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 30px;
                        flex-wrap: wrap;
                        gap: 16px;
                    }

                    .section-header h2 {
                        font-size: 28px;
                        font-weight: 700;
                        color: #1e293b;
                        position: relative;
                        padding-bottom: 8px;
                    }

                    .section-header h2::after {
                        content: '';
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        width: 60px;
                        height: 3px;
                        background: linear-gradient(90deg, #ec4899, #8b5cf6);
                        border-radius: 2px;
                    }

                    .flashcard-controls {
                        display: flex;
                        gap: 12px;
                    }

                    .flashcard-btn {
                        width: 40px;
                        height: 40px;
                        border: 1px solid #e2e8f0;
                        background: white;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 18px;
                        transition: all 0.2s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .flashcard-btn:hover {
                        background: #f8fafc;
                        border-color: #94a3b8;
                    }

                    .quote-card {
                        background: #ffffff;
                        border: 1px solid #e2e8f0;
                        border-radius: 24px;
                        padding: 40px;
                        margin-bottom: 30px;
                        box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
                        transition: all 0.3s ease;
                        min-height: 250px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                    }

                    .quote-card:hover {
                        box-shadow: 0 20px 30px -10px rgba(0,0,0,0.1);
                    }

                    .quote-icon {
                        font-size: 48px;
                        margin-bottom: 20px;
                        color: #ec4899;
                    }

                    .quote-text {
                        font-size: 28px;
                        font-weight: 500;
                        color: #1e293b;
                        line-height: 1.5;
                        margin-bottom: 20px;
                        font-style: italic;
                    }

                    .quote-title {
                        font-size: 20px;
                        font-weight: 600;
                        color: #ec4899;
                        margin-bottom: 12px;
                    }

                    .quote-progress {
                        font-size: 14px;
                        color: #94a3b8;
                        margin-top: 20px;
                    }

                    /* Flashcard Grid */
                    .flashcards-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                        gap: 24px;
                        margin-top: 30px;
                    }

                    .flashcard {
                        background: #ffffff;
                        border: 1px solid #e2e8f0;
                        border-radius: 20px;
                        padding: 28px;
                        transition: all 0.3s ease;
                    }

                    .flashcard:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 15px 30px -10px rgba(0,0,0,0.1);
                        border-color: #cbd5e1;
                    }

                    .flashcard-title {
                        font-size: 20px;
                        font-weight: 600;
                        color: #1e293b;
                        margin-bottom: 16px;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }

                    .flashcard-content {
                        font-size: 16px;
                        color: #475569;
                        line-height: 1.7;
                    }

                    /* Emergency Contact Bar */
                    .emergency-bar {
                        margin-top: 50px;
                        padding: 24px;
                        background: #fef2f2;
                        border: 1px solid #fecaca;
                        border-radius: 16px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        flex-wrap: wrap;
                        gap: 16px;
                    }

                    .emergency-text {
                        color: #991b1b;
                    }

                    .emergency-text strong {
                        font-size: 18px;
                        display: block;
                        margin-bottom: 8px;
                    }

                    .emergency-numbers {
                        display: flex;
                        gap: 24px;
                        flex-wrap: wrap;
                    }

                    .emergency-number {
                        background: white;
                        padding: 8px 16px;
                        border-radius: 30px;
                        border: 1px solid #fecaca;
                        color: #b91c1c;
                        font-weight: 500;
                    }

                    .emergency-call-btn {
                        background: #dc2626;
                        color: white;
                        border: none;
                        padding: 12px 32px;
                        border-radius: 40px;
                        font-weight: 600;
                        font-size: 16px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        border: 1px solid #dc2626;
                    }

                    .emergency-call-btn:hover {
                        background: #b91c1c;
                        transform: scale(1.02);
                    }

                    /* Responsive */
                    @media (max-width: 768px) {
                        .dashboard-wrapper {
                            padding: 80px 16px 40px;
                        }

                        .welcome-title {
                            font-size: 28px;
                        }

                        .welcome-subtitle {
                            font-size: 16px;
                        }

                        .quote-text {
                            font-size: 22px;
                        }

                        .emergency-bar {
                            flex-direction: column;
                            text-align: center;
                        }

                        .emergency-numbers {
                            justify-content: center;
                        }
                    }
                `}
            </style>

            <Navbar />

            <div className="dashboard-wrapper">
                <div className="dashboard-container">
                    {/* Welcome Section */}
                    <div className="welcome-section">
                        <h1 className="welcome-title">Welcome to RakshaNet 🛡️</h1>
                        <p className="welcome-subtitle">
                            Your safe space for reporting cyber incidents, seeking legal help,
                            finding emotional support, and detecting online abuse with AI.
                            You are not alone in this journey.
                        </p>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="quick-stats-grid">
                        <div className="stat-widget" onClick={() => navigate("/cases")}>
                            <div className="stat-number">{casesCount}</div>
                            <div className="stat-label">Active Cases</div>
                        </div>
                        <div className="stat-widget" onClick={() => navigate("/legal")}>
                            <div className="stat-number">{legalCount}</div>
                            <div className="stat-label">Legal Consultations</div>
                        </div>
                        <div className="stat-widget" onClick={() => navigate("/therapy")}>
                            <div className="stat-number">{therapyCount}</div>
                            <div className="stat-label">Therapy Sessions</div>
                        </div>
                    </div>

                    {/* Pillar Grid - Main Navigation */}
                    <div className="pillar-grid">
                        {pillars.map((pillar) => (
                            <div
                                key={pillar.name}
                                className="pillar-card"
                                onClick={() => navigate(pillar.path)}
                            >
                                {pillar.name === "AI Abuse Detection (NLP)" && (
                                    <span className="nlp-badge">NEW</span>
                                )}
                                <div className="pillar-icon">{pillar.icon}</div>
                                <h3>{pillar.name}</h3>
                                <div className="pillar-description">{pillar.description}</div>
                                <div className="pillar-arrow">→</div>
                            </div>
                        ))}
                    </div>

                    {/* Motivational Flashcards Section */}
                    <div className="flashcard-section">
                        <div className="section-header">
                            <h2>🌸 Words of Encouragement</h2>
                            <div className="flashcard-controls">
                                <button className="flashcard-btn" onClick={prevQuote}>←</button>
                                <button className="flashcard-btn" onClick={nextQuote}>→</button>
                            </div>
                        </div>

                        {/* Featured Quote Card */}
                        <div className="quote-card">
                            <div className="quote-icon">💫</div>
                            <div className="quote-title">{motivationalFlashcards[currentQuoteIndex].title}</div>
                            <div className="quote-text">"{motivationalFlashcards[currentQuoteIndex].content}"</div>
                            <div className="quote-progress">
                                {currentQuoteIndex + 1} of {motivationalFlashcards.length}
                            </div>
                        </div>

                        {/* All Flashcards Grid */}
                        <div className="flashcards-grid">
                            {motivationalFlashcards.map((card, index) => (
                                <div key={index} className="flashcard">
                                    <div className="flashcard-title">
                                        {card.title}
                                    </div>
                                    <div className="flashcard-content">
                                        {card.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Emergency Contact Bar */}
                    <div className="emergency-bar">
                        <div className="emergency-text">
                            <strong>🚨 24/7 Emergency Support</strong>
                            <div className="emergency-numbers">
                                <span className="emergency-number">Women's Helpline: 181</span>
                                <span className="emergency-number">Cyber Crime: 1930</span>
                                <span className="emergency-number">Police: 112</span>
                            </div>
                        </div>
                        <button
                            className="emergency-call-btn"
                            onClick={() => window.location.href = "tel:112"}
                        >
                            Call Emergency
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;