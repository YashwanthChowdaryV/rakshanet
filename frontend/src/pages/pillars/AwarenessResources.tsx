import { useState, useEffect } from "react";

import api from "../../services/api";

const AwarenessResources = () => {
    const [resources, setResources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fake data for awareness resources
    const fakeResources = [
        {
            id: 1,
            title: "Digital Safety 101: Protecting Your Online Identity",
            description: "Learn essential tips to safeguard your personal information, create strong passwords, and recognize phishing attempts. This comprehensive guide covers everything from social media privacy to secure browsing habits.",
            tag: "High Priority",
            duration: "15 min read",
            type: "Guide",
            link: "#",
            icon: "🛡️"
        },
        {
            id: 2,
            title: "Recognizing Cyber Harassment: Signs & Support",
            description: "Understand the warning signs of online harassment, learn how to document evidence, and discover resources for support. This resource helps victims identify abuse and take appropriate action.",
            tag: "Essential",
            duration: "20 min read",
            type: "Article",
            link: "#",
            icon: "⚠️"
        },
        {
            id: 3,
            title: "Legal Rights Against Online Abuse",
            description: "A comprehensive overview of cyber laws in India including IT Act 2000, IPC sections for online harassment, and how to file complaints with cyber cells. Know your rights and legal remedies.",
            tag: "High Priority",
            duration: "25 min read",
            type: "Legal Guide",
            link: "#",
            icon: "⚖️"
        },
        {
            id: 4,
            title: "Mental Health & Digital Wellbeing",
            description: "Strategies to maintain mental health while navigating online spaces. Includes coping mechanisms for cyberbullying, digital detox tips, and resources for professional support.",
            tag: "Wellness",
            duration: "12 min read",
            type: "Wellness Guide",
            link: "#",
            icon: "🧠"
        },
        {
            id: 5,
            title: "Parent's Guide to Children's Online Safety",
            description: "Essential resources for parents to help children navigate social media, recognize grooming tactics, and establish healthy digital boundaries. Includes conversation starters and monitoring tips.",
            tag: "Family",
            duration: "18 min read",
            type: "Parent Guide",
            link: "#",
            icon: "👨‍👩‍👧"
        },
        {
            id: 6,
            title: "Social Media Privacy Settings Masterclass",
            description: "Step-by-step walkthrough of privacy settings on Instagram, Facebook, LinkedIn, and Twitter. Learn how to limit visibility, block unwanted contacts, and secure your accounts.",
            tag: "Practical",
            duration: "30 min read",
            type: "Tutorial",
            link: "#",
            icon: "🔒"
        },
        {
            id: 7,
            title: "How to Report Cyber Crime in India",
            description: "Complete guide to reporting cyber crimes through the National Cyber Crime Reporting Portal. Includes documentation requirements, follow-up procedures, and victim support resources.",
            tag: "High Priority",
            duration: "22 min read",
            type: "Guide",
            link: "#",
            icon: "📝"
        },
        {
            id: 8,
            title: "Building Digital Resilience: A Student's Toolkit",
            description: "Empower yourself with tools to build resilience against online harassment. Includes journaling prompts, boundary-setting techniques, and community support resources for students.",
            tag: "Student Focus",
            duration: "10 min read",
            type: "Toolkit",
            link: "#",
            icon: "🎓"
        },
        {
            id: 9,
            title: "Understanding AI & Deepfake Threats",
            description: "Learn about emerging threats like deepfakes and AI-generated harassment. This guide explains how to identify manipulated content and protect yourself from digital impersonation.",
            tag: "Emerging",
            duration: "18 min read",
            type: "Tech Guide",
            link: "#",
            icon: "🤖"
        },
        {
            id: 10,
            title: "Workplace Cyber Harassment: Your Rights",
            description: "Comprehensive resource on handling online harassment in professional settings. Includes employer responsibilities, legal protections, and steps to report misconduct at work.",
            tag: "Professional",
            duration: "20 min read",
            type: "Legal Guide",
            link: "#",
            icon: "💼"
        }
    ];

    const fetchResources = async () => {
        try {
            setLoading(true);
            // Try to fetch from backend, if fails, use fake data
            try {
                const res = await api.get("/resources/awareness");
                setResources(res.data);
                setError(null);
            } catch (err) {
                console.log("Backend not available, using fake data");
                setResources(fakeResources);
                setError(null);
            }
        } catch (err: any) {
            console.error("Error fetching awareness resources:", err);
            // Use fake data as fallback
            setResources(fakeResources);
            setError(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    if (loading) {
        return (
            <>
                <div style={pageStyle}>
                    <div className="loader-container">
                        <div className="loader"></div>
                        <p>Loading Educational Resources...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div style={pageStyle} className="awareness-wrapper">
                <style>
                    {`
                        .awareness-wrapper {
                            max-width: 1200px;
                            margin: 0 auto;
                        }
                        .page-header {
                            margin-bottom: 48px;
                            text-align: left;
                        }
                        .page-header h1 {
                            font-size: 42px;
                            font-weight: 800;
                            background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                            background-clip: text;
                            margin-bottom: 12px;
                        }
                        .page-header p {
                            font-size: 18px;
                            color: #6b7280;
                            max-width: 700px;
                            line-height: 1.6;
                        }

                        .resource-list {
                            display: flex;
                            flex-direction: column;
                            gap: 20px;
                        }

                        .resource-item {
                            background: linear-gradient(135deg, #ffffff 0%, #faf5ff 100%);
                            border-radius: 20px;
                            padding: 28px;
                            border: 1px solid #e9d5ff;
                            display: grid;
                            grid-template-columns: 1fr 200px;
                            gap: 24px;
                            transition: all 0.3s ease;
                            text-align: left;
                            position: relative;
                            overflow: hidden;
                        }
                        .resource-item::before {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 4px;
                            height: 100%;
                            background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
                        }
                        .resource-item:hover {
                            transform: translateY(-4px);
                            border-color: #c084fc;
                            box-shadow: 0 20px 25px -12px rgba(139, 92, 246, 0.2);
                        }

                        .resource-main h3 {
                            font-size: 20px;
                            font-weight: 700;
                            color: #4c1d95;
                            margin-bottom: 12px;
                            text-align: left;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                        }
                        .resource-icon {
                            font-size: 24px;
                        }
                        .resource-main p {
                            color: #6b7280;
                            font-size: 15px;
                            line-height: 1.6;
                            margin-bottom: 16px;
                            text-align: left;
                        }

                        .meta-tags {
                            display: flex;
                            gap: 12px;
                            flex-wrap: wrap;
                        }
                        .meta-tag {
                            font-size: 12px;
                            font-weight: 600;
                            padding: 6px 12px;
                            border-radius: 20px;
                            background: #f3e8ff;
                            color: #6d28d9;
                        }
                        .meta-tag.priority {
                            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                            color: #b45309;
                        }

                        .resource-action {
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            gap: 12px;
                            border-left: 1px solid #e9d5ff;
                            padding-left: 24px;
                        }

                        .view-btn {
                            display: block;
                            padding: 12px 24px;
                            background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
                            color: white;
                            text-decoration: none;
                            border-radius: 40px;
                            font-weight: 600;
                            font-size: 14px;
                            text-align: center;
                            transition: all 0.3s ease;
                            box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
                        }
                        .view-btn:hover {
                            transform: translateY(-2px);
                            box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
                            background: linear-gradient(135deg, #9b6eff 0%, #7c3aed 100%);
                        }

                        .type-label {
                            font-size: 13px;
                            color: #8b5cf6;
                            text-align: center;
                            font-weight: 600;
                            letter-spacing: 0.5px;
                        }

                        .loader-container {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            height: 50vh;
                        }
                        .loader {
                            border: 4px solid #f3e8ff;
                            border-top: 4px solid #8b5cf6;
                            border-radius: 50%;
                            width: 50px;
                            height: 50px;
                            animation: spin 1s linear infinite;
                            margin-bottom: 20px;
                        }
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }

                        .stats-banner {
                            background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
                            border-radius: 16px;
                            padding: 24px;
                            margin-bottom: 40px;
                            display: grid;
                            grid-template-columns: repeat(3, 1fr);
                            gap: 24px;
                            text-align: center;
                        }
                        .stat-item {
                            display: flex;
                            flex-direction: column;
                            gap: 8px;
                        }
                        .stat-number {
                            font-size: 32px;
                            font-weight: 800;
                            color: #6d28d9;
                        }
                        .stat-label {
                            font-size: 14px;
                            color: #6b7280;
                            font-weight: 500;
                        }

                        @media (max-width: 768px) {
                            .resource-item {
                                grid-template-columns: 1fr;
                            }
                            .resource-action {
                                border-left: none;
                                border-top: 1px solid #e9d5ff;
                                padding-left: 0;
                                padding-top: 20px;
                            }
                            .stats-banner {
                                grid-template-columns: 1fr;
                                gap: 16px;
                            }
                            .page-header h1 {
                                font-size: 32px;
                            }
                        }
                    `}
                </style>

                <div className="page-header">
                    <h1>📚 Awareness & Resources</h1>
                    <p>Knowledge is your first line of defense. Access curated materials to help you navigate the digital world safely and confidently.</p>
                </div>

                {/* Stats Banner */}
                <div className="stats-banner">
                    <div className="stat-item">
                        <div className="stat-number">50+</div>
                        <div className="stat-label">Educational Resources</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">10k+</div>
                        <div className="stat-label">Students Empowered</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">24/7</div>
                        <div className="stat-label">Support Available</div>
                    </div>
                </div>

                {error && <div style={{ color: "#ef4444", marginBottom: "20px", fontWeight: "600", textAlign: "left" }}>⚠️ {error}</div>}

                <div className="resource-list">
                    {resources.map((res) => (
                        <div key={res.id} className="resource-item">
                            <div className="resource-main">
                                <h3>
                                    <span className="resource-icon">{res.icon || "📖"}</span>
                                    {res.title}
                                </h3>
                                <p>{res.description}</p>
                                <div className="meta-tags">
                                    <span className={`meta-tag ${res.tag === "High Priority" ? "priority" : ""}`}>{res.tag}</span>
                                    <span className="meta-tag">⏱️ {res.duration}</span>
                                    <span className="meta-tag">📁 {res.type}</span>
                                </div>
                            </div>
                            <div className="resource-action">
                                <a href={res.link} className="view-btn" onClick={(e) => {
                                    e.preventDefault();
                                    alert(`📖 Opening: ${res.title}\n\nThis resource will help you understand ${res.description.substring(0, 50)}...\n\nIn the full version, this would open the complete guide.`);
                                }}>
                                    Read Resource
                                </a>
                                <span className="type-label">{res.type}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Info Banner */}
                <div style={{
                    marginTop: "48px",
                    padding: "32px",
                    background: "linear-gradient(135deg, #faf5ff 0%, #ffffff 100%)",
                    borderRadius: "20px",
                    border: "1px solid #e9d5ff",
                    textAlign: "center"
                }}>
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>🌟</div>
                    <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#4c1d95", marginBottom: "12px" }}>
                        Need Personalized Support?
                    </h3>
                    <p style={{ color: "#6b7280", marginBottom: "20px", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
                        Our counselors and legal experts are here to help you navigate any situation.
                        Reach out for confidential, one-on-one guidance.
                    </p>
                    <button
                        onClick={() => alert("📞 Support Team Available 24/7\n\nContact us at: support@rakshanet.com\nor call: 1800-XXX-XXXX")}
                        style={{
                            padding: "12px 32px",
                            background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
                            color: "white",
                            border: "none",
                            borderRadius: "40px",
                            fontWeight: "600",
                            fontSize: "14px",
                            cursor: "pointer",
                            boxShadow: "0 2px 8px rgba(139, 92, 246, 0.3)"
                        }}
                    >
                        Get Support →
                    </button>
                </div>
            </div>
        </>
    );
};

const pageStyle: React.CSSProperties = {
    paddingTop: "120px",
    paddingLeft: "40px",
    paddingRight: "40px",
    paddingBottom: "80px",
    background: "linear-gradient(135deg, #faf5ff 0%, #ffffff 100%)",
    minHeight: "100vh"
};

export default AwarenessResources;