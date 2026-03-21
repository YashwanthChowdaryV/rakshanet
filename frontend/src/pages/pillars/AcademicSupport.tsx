import { useState, useEffect } from "react";

import api from "../../services/api";

const AcademicSupport = () => {
    const [resources, setResources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fake data for BTech student academic support
    const fakeResources = [
        {
            id: 1,
            title: "AI & ML Study Resources",
            description: "Comprehensive collection of machine learning tutorials, research papers, and hands-on projects. Includes Python implementations, TensorFlow guides, and interview preparation materials.",
            category: "Core Subjects",
            icon: "🤖",
            link: "#",
            type: "Study Materials",
            difficulty: "Intermediate",
            studentsHelped: 234
        },
        {
            id: 2,
            title: "Data Structures & Algorithms Masterclass",
            description: "Complete DSA resource hub with video lectures, practice problems, and solution explanations. Covers arrays, trees, graphs, dynamic programming, and system design basics.",
            category: "Programming",
            icon: "📊",
            link: "#",
            type: "Course",
            difficulty: "Beginner to Advanced",
            studentsHelped: 567
        },
        {
            id: 3,
            title: "Academic Mentorship Program",
            description: "Connect with senior students and faculty mentors for personalized guidance. Get help with projects, research papers, career planning, and overcoming academic challenges.",
            category: "Mentorship",
            icon: "👥",
            link: "#",
            type: "1-on-1 Support",
            difficulty: "All Levels",
            studentsHelped: 189
        },
        {
            id: 4,
            title: "Internship & Placement Prep",
            description: "Access mock interviews, resume review sessions, coding challenge platforms, and company-specific preparation guides. Get tips from successful placement candidates.",
            category: "Career Support",
            icon: "💼",
            link: "#",
            type: "Career Prep",
            difficulty: "Final Year",
            studentsHelped: 445
        },
        {
            id: 5,
            title: "Web Development Bootcamp",
            description: "Full-stack development resources including HTML/CSS, JavaScript, React, Node.js, and MongoDB. Real-world projects and portfolio building guidance included.",
            category: "Technical Skills",
            icon: "🌐",
            link: "#",
            type: "Workshop",
            difficulty: "Beginner",
            studentsHelped: 312
        },
        {
            id: 6,
            title: "Research Paper Writing Support",
            description: "Guidance on writing research papers, IEEE formatting, journal selection, and publication strategies. Get help with literature review and plagiarism checking.",
            category: "Research",
            icon: "📝",
            link: "#",
            type: "Academic Support",
            difficulty: "Advanced",
            studentsHelped: 98
        },
        {
            id: 7,
            title: "Exam Preparation Strategies",
            description: "Time management techniques, subject-wise study plans, previous year papers, and revision strategies for semester exams. Special focus on backlog clearance.",
            category: "Exams",
            icon: "📚",
            link: "#",
            type: "Guide",
            difficulty: "All Levels",
            studentsHelped: 678
        },
        {
            id: 8,
            title: "Group Study & Peer Learning",
            description: "Join study groups with fellow BTech students working on similar subjects. Collaborative learning sessions, doubt clearing, and project collaboration opportunities.",
            category: "Peer Support",
            icon: "👨‍🎓",
            link: "#",
            type: "Community",
            difficulty: "All Levels",
            studentsHelped: 423
        },
        {
            id: 9,
            title: "Open Source Contribution Guide",
            description: "Learn how to start contributing to open source projects. Git/GitHub tutorials, finding good first issues, and building your developer portfolio.",
            category: "Technical Skills",
            icon: "🖥️",
            link: "#",
            type: "Workshop",
            difficulty: "Intermediate",
            studentsHelped: 267
        },
        {
            id: 10,
            title: "Mental Health & Academic Balance",
            description: "Resources to manage academic stress, maintain work-life balance, and build resilience. Includes mindfulness exercises, counseling access, and wellness workshops.",
            category: "Wellness",
            icon: "🧘",
            link: "#",
            type: "Support",
            difficulty: "All Levels",
            studentsHelped: 334
        },
        {
            id: 11,
            title: "Cloud Computing & DevOps",
            description: "AWS, Azure, and GCP learning resources. Docker, Kubernetes, CI/CD pipelines, and cloud architecture best practices for BTech students.",
            category: "Core Subjects",
            icon: "☁️",
            link: "#",
            type: "Study Materials",
            difficulty: "Advanced",
            studentsHelped: 156
        },
        {
            id: 12,
            title: "Cyber Security Fundamentals",
            description: "Learn ethical hacking, network security, cryptography, and security best practices. Perfect for students interested in cybersecurity careers.",
            category: "Specialization",
            icon: "🔒",
            link: "#",
            type: "Course",
            difficulty: "Intermediate",
            studentsHelped: 289
        },
        {
            id: 13,
            title: "Soft Skills & Communication",
            description: "Develop essential soft skills for professional success. Public speaking, business communication, interview etiquette, and teamwork workshops.",
            category: "Career Support",
            icon: "💬",
            link: "#",
            type: "Workshop",
            difficulty: "All Levels",
            studentsHelped: 512
        },
        {
            id: 14,
            title: "Project Guidance & Mentoring",
            description: "Get expert guidance on major and mini projects. Help with topic selection, implementation strategies, documentation, and presentation skills.",
            category: "Mentorship",
            icon: "🚀",
            link: "#",
            type: "1-on-1 Support",
            difficulty: "All Levels",
            studentsHelped: 201
        },
        {
            id: 15,
            title: "Hackathon Preparation Bootcamp",
            description: "Learn how to excel in hackathons. Rapid prototyping, team collaboration, presentation skills, and winning strategies from experienced participants.",
            category: "Extracurricular",
            icon: "🏆",
            link: "#",
            type: "Workshop",
            difficulty: "All Levels",
            studentsHelped: 178
        }
    ];

    const fetchResources = async () => {
        try {
            setLoading(true);
            // Try to fetch from backend, if fails, use fake data
            try {
                const res = await api.get("/resources/academic");
                setResources(res.data);
                setError(null);
            } catch (err) {
                console.log("Backend not available, using fake data");
                setResources(fakeResources);
                setError(null);
            }
        } catch (err: any) {
            console.error("Error fetching academic resources:", err);
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

    // Quick stats for dashboard
    const totalResources = resources.length;
    const totalStudentsHelped = resources.reduce((sum, res) => sum + (res.studentsHelped || 0), 0);

    if (loading) {
        return (
            <>
                <div style={pageStyle}>
                    <div className="loader-container">
                        <div className="loader"></div>
                        <p>Loading Academic Support Resources...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div style={pageStyle} className="academic-wrapper">
                <style>
                    {`
                        .academic-wrapper {
                            max-width: 1200px;
                            margin: 0 auto;
                        }
                        
                        .hero-section {
                            background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
                            color: white;
                            padding: 60px 48px;
                            border-radius: 28px;
                            margin-bottom: 48px;
                            box-shadow: 0 20px 30px -12px rgba(13, 148, 136, 0.3);
                            text-align: left;
                            position: relative;
                            overflow: hidden;
                        }
                        .hero-section::before {
                            content: '';
                            position: absolute;
                            top: -50%;
                            right: -10%;
                            width: 300px;
                            height: 300px;
                            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                            pointer-events: none;
                        }
                        .hero-section h1 {
                            font-size: 44px;
                            font-weight: 800;
                            margin-bottom: 20px;
                            color: white;
                            letter-spacing: -0.02em;
                        }
                        .hero-section p {
                            font-size: 18px;
                            opacity: 0.95;
                            max-width: 600px;
                            line-height: 1.6;
                            color: white;
                        }
                        .hero-stats {
                            display: flex;
                            gap: 40px;
                            margin-top: 32px;
                        }
                        .hero-stat {
                            display: flex;
                            flex-direction: column;
                            gap: 4px;
                        }
                        .hero-stat-number {
                            font-size: 28px;
                            font-weight: 800;
                        }
                        .hero-stat-label {
                            font-size: 14px;
                            opacity: 0.8;
                        }

                        .resource-grid {
                            display: grid;
                            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                            gap: 28px;
                        }

                        .resource-card {
                            background: white;
                            border-radius: 24px;
                            padding: 28px;
                            border: 1px solid #e6f7f5;
                            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                            display: flex;
                            flex-direction: column;
                            gap: 20px;
                            position: relative;
                            overflow: hidden;
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                        }
                        .resource-card:hover {
                            transform: translateY(-6px);
                            box-shadow: 0 24px 36px -12px rgba(13, 148, 136, 0.2);
                            border-color: #14b8a6;
                        }
                        .resource-card::before {
                            content: "";
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 4px;
                            background: linear-gradient(90deg, #0d9488, #14b8a6);
                            transform: scaleX(0);
                            transition: transform 0.3s;
                            transform-origin: left;
                        }
                        .resource-card:hover::before {
                            transform: scaleX(1);
                        }

                        .card-header {
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-start;
                        }
                        .icon-box {
                            font-size: 56px;
                            background: linear-gradient(135deg, #ecfdf9 0%, #d9f2ef 100%);
                            width: 80px;
                            height: 80px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-radius: 20px;
                            transition: all 0.3s;
                        }
                        .resource-card:hover .icon-box {
                            background: linear-gradient(135deg, #cbf1ec 0%, #b5e9e2 100%);
                            transform: scale(1.05);
                        }
                        .students-count {
                            background: #f0fdfa;
                            padding: 6px 12px;
                            border-radius: 40px;
                            font-size: 12px;
                            font-weight: 600;
                            color: #0d9488;
                        }

                        .resource-content h3 {
                            font-size: 20px;
                            color: #134e4a;
                            margin-bottom: 12px;
                            font-weight: 700;
                            text-align: left;
                            line-height: 1.4;
                        }
                        .category-tag {
                            display: inline-block;
                            padding: 6px 14px;
                            background: #ecfdf9;
                            color: #0d9488;
                            border-radius: 40px;
                            font-size: 12px;
                            font-weight: 600;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                            margin-bottom: 14px;
                        }
                        .resource-content p {
                            color: #5a6e6c;
                            font-size: 14px;
                            line-height: 1.6;
                            text-align: left;
                            margin-bottom: 12px;
                        }
                        .meta-tags {
                            display: flex;
                            gap: 8px;
                            flex-wrap: wrap;
                            margin-top: 12px;
                        }
                        .meta-tag {
                            font-size: 11px;
                            padding: 4px 10px;
                            background: #f9fafb;
                            color: #6b7280;
                            border-radius: 20px;
                            font-weight: 500;
                        }

                        .action-link {
                            margin-top: auto;
                            display: inline-flex;
                            align-items: center;
                            gap: 8px;
                            color: #0d9488;
                            font-weight: 700;
                            text-decoration: none;
                            font-size: 15px;
                            transition: all 0.2s;
                            padding: 8px 0;
                            width: fit-content;
                        }
                        .action-link:hover {
                            gap: 12px;
                            color: #14b8a6;
                        }

                        .quote-section {
                            background: linear-gradient(135deg, #ecfdf9 0%, #d9f2ef 100%);
                            border-radius: 24px;
                            padding: 48px;
                            margin-top: 48px;
                            text-align: center;
                            border: 1px solid #cbf1ec;
                        }
                        .quote-section p {
                            font-size: 20px;
                            font-weight: 500;
                            color: #134e4a;
                            margin-bottom: 16px;
                            line-height: 1.6;
                        }
                        .quote-author {
                            font-size: 14px;
                            color: #5a6e6c;
                            font-style: italic;
                        }

                        .loader-container {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            height: 50vh;
                        }
                        .loader {
                            border: 4px solid #e6f7f5;
                            border-top: 4px solid #0d9488;
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

                        @media (max-width: 768px) {
                            .hero-section {
                                padding: 40px 24px;
                            }
                            .hero-section h1 {
                                font-size: 32px;
                            }
                            .hero-stats {
                                flex-direction: column;
                                gap: 16px;
                            }
                            .resource-grid {
                                grid-template-columns: 1fr;
                            }
                            .quote-section {
                                padding: 32px 24px;
                            }
                            .quote-section p {
                                font-size: 18px;
                            }
                        }
                    `}
                </style>

                <div className="hero-section">
                    <h1>📘 Academic Support Hub</h1>
                    <p>Empowering BTech students with comprehensive resources, mentorship, and guidance for academic excellence and career success.</p>
                    <div className="hero-stats">
                        <div className="hero-stat">
                            <div className="hero-stat-number">{totalResources}+</div>
                            <div className="hero-stat-label">Resources Available</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-number">{Math.floor(totalStudentsHelped / 100)}k+</div>
                            <div className="hero-stat-label">Students Helped</div>
                        </div>
                        <div className="hero-stat">
                            <div className="hero-stat-number">24/7</div>
                            <div className="hero-stat-label">Support Access</div>
                        </div>
                    </div>
                </div>

                {error && <div style={{ color: "#ef4444", marginBottom: "20px", fontWeight: "600", textAlign: "left" }}>⚠️ {error}</div>}

                <div className="resource-grid">
                    {resources.map((res) => (
                        <div key={res.id} className="resource-card">
                            <div className="card-header">
                                <div className="icon-box">{res.icon}</div>
                                {res.studentsHelped && (
                                    <div className="students-count">👥 {res.studentsHelped}+ helped</div>
                                )}
                            </div>
                            <div className="resource-content">
                                <span className="category-tag">{res.category}</span>
                                <h3>{res.title}</h3>
                                <p>{res.description}</p>
                                <div className="meta-tags">
                                    <span className="meta-tag">📌 {res.type}</span>
                                    <span className="meta-tag">⭐ {res.difficulty}</span>
                                </div>
                            </div>
                            <a href={res.link} className="action-link" onClick={(e) => {
                                e.preventDefault();
                                alert(`📖 Opening: ${res.title}\n\n${res.description}\n\nThis resource is designed for ${res.difficulty} level students.\n\nIn the full version, this would open the complete guide.`);
                            }}>
                                Access Resource <span>→</span>
                            </a>
                        </div>
                    ))}
                </div>

                {/* Motivational Quote Section */}
                <div className="quote-section">
                    <p>✨ "Education is the most powerful weapon which you can use to change the world." ✨</p>
                    <div className="quote-author">— Nelson Mandela</div>
                    <div style={{ marginTop: "24px", fontSize: "14px", color: "#0d9488" }}>
                        🌟 Your academic journey matters. We're here to support you every step of the way.
                    </div>
                </div>

                {/* Emergency Academic Support Banner */}
                <div style={{
                    marginTop: "32px",
                    padding: "20px 24px",
                    background: "#fff7ed",
                    borderLeft: "4px solid #f59e0b",
                    borderRadius: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px"
                }}>
                    <div>
                        <strong style={{ color: "#b45309", fontSize: "14px" }}>⚠️ Urgent Academic Support Needed?</strong>
                        <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px" }}>Immediate assistance for exam emergencies, project deadlines, or academic stress.</p>
                    </div>
                    <button
                        onClick={() => alert("📞 Academic Support Hotline: 1800-ACAD-HELP\n\nAvailable 24/7 for BTech students\n\nEmail: academics@rakshanet.com")}
                        style={{
                            padding: "10px 24px",
                            background: "#f59e0b",
                            color: "white",
                            border: "none",
                            borderRadius: "40px",
                            fontWeight: "600",
                            fontSize: "13px",
                            cursor: "pointer",
                            whiteSpace: "nowrap"
                        }}
                    >
                        Request Emergency Support →
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
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    minHeight: "100vh"
};

export default AcademicSupport;