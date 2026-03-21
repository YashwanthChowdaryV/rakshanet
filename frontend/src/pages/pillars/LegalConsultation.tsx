import { useState, useEffect } from "react";

import api from "../../services/api";

const LegalConsultation = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedLawyer, setSelectedLawyer] = useState("");
    const [selectedLawyerId, setSelectedLawyerId] = useState("");
    const [selectedCase, setSelectedCase] = useState("");
    const [consultationType, setConsultationType] = useState("Free");
    const [preferredDate, setPreferredDate] = useState("");
    const [preferredTime, setPreferredTime] = useState("");
    const [mode, setMode] = useState("Video Call");
    const [description, setDescription] = useState("");
    const [consultations, setConsultations] = useState<any[]>([]);
    const [userCases, setUserCases] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showSections, setShowSections] = useState(false);

    const [lawyersList, setLawyersList] = useState<any[]>([]);

    const fetchLawyers = async () => {
        try {
            const res = await api.get("/legal/lawyers");
            if (res.data.length > 0) {
                const mapped = res.data.map((user: any) => ({
                    id: user._id,
                    name: user.name,
                    specialization: user.profile?.department || "General Cyber Law",
                    rating: "4.8",
                }));
                setLawyersList(mapped);
            }
        } catch (error) {
            console.error("Fetch lawyers error:", error);
        }
    };

    // ================= WOMEN'S CYBER LAW SECTIONS =================
    const womensLawSections = [
        {
            act: "Information Technology Act, 2000",
            sections: [
                { number: "Section 66E", description: "Violation of privacy - Publishing or transmitting private images of women without consent", punishment: "Imprisonment up to 3 years or fine up to ₹2 lakhs or both" },
                { number: "Section 67", description: "Publishing obscene content targeting women", punishment: "Imprisonment up to 3 years and fine up to ₹5 lakhs" },
                { number: "Section 67A", description: "Publishing sexually explicit content involving women", punishment: "Imprisonment up to 5 years and fine up to ₹10 lakhs" },
                { number: "Section 67B", description: "Child pornography and women protection", punishment: "Imprisonment up to 5 years and fine up to ₹10 lakhs" },
                { number: "Section 72", description: "Breach of confidentiality and privacy of women", punishment: "Imprisonment up to 2 years or fine up to ₹1 lakh or both" },
            ]
        },
        {
            act: "Indian Penal Code (IPC)",
            sections: [
                { number: "Section 354A", description: "Sexual harassment - Including online sexual harassment", punishment: "Rigorous imprisonment up to 3 years or fine" },
                { number: "Section 354C", description: "Voyeurism - Capturing or sharing images of women without consent", punishment: "Imprisonment up to 3 years for first offense" },
                { number: "Section 354D", description: "Stalking - Including cyberstalking of women", punishment: "Imprisonment up to 3 years for first offense" },
                { number: "Section 499", description: "Defamation - Online defamation of women", punishment: "Simple imprisonment up to 2 years or fine or both" },
                { number: "Section 503", description: "Criminal intimidation - Threatening women online", punishment: "Imprisonment up to 2 years or fine or both" },
                { number: "Section 509", description: "Word, gesture or act intended to insult modesty of women", punishment: "Simple imprisonment up to 3 years and fine" },
            ]
        },
        {
            act: "Indecent Representation of Women (Prohibition) Act, 1986",
            sections: [
                { number: "Section 3", description: "Prohibition of indecent representation of women in advertisements, publications, etc.", punishment: "Imprisonment up to 2 years and fine up to ₹2,000" },
                { number: "Section 4", description: "Prohibition of publication of indecent representation of women", punishment: "Imprisonment up to 2 years and fine up to ₹2,000" },
            ]
        },
        {
            act: "Protection of Women from Domestic Violence Act, 2005",
            sections: [
                { number: "Section 3", description: "Definition of domestic violence includes online harassment and cyber abuse", punishment: "Protection orders, monetary relief, custody orders" },
                { number: "Section 12", description: "Application to magistrate for protection against cyber harassment", punishment: "Protection officers appointed to assist women" },
            ]
        },
        {
            act: "Digital Personal Data Protection Act, 2023",
            sections: [
                { number: "Section 15", description: "Consent requirement for processing personal data of women", punishment: "Penalty up to ₹250 crores for non-compliance" },
                { number: "Section 22", description: "Right to correction and erasure of personal data", punishment: "Data Protection Board adjudication" },
            ]
        }
    ];

    const fetchConsultations = async () => {
        try {
            const res = await api.get("/legal/my");
            const data = Array.isArray(res.data) ? res.data : (res.data.consultations || []);
            setConsultations(data);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    const fetchUserCases = async () => {
        try {
            const res = await api.get("/cases");
            const fetchedCases = Array.isArray(res.data) ? res.data : (res.data.cases || []);
            setUserCases(fetchedCases);
        } catch (error) {
            console.error("Fetch cases error:", error);
        }
    };

    useEffect(() => {
        fetchConsultations();
        fetchUserCases();
        fetchLawyers();
    }, []);

    const generateFakePDF = (c: any) => {
        alert(`Generating Official Legal Complaint PDF for Case ${c.caseNumber}...\n\n(This is a mock placeholder for document generation.)`);
    };

    const handleSubmit = async () => {
        if (!selectedCase) {
            alert("Please select a case");
            return;
        }

        try {
            setLoading(true);

            await api.post("/legal/request", {
                lawyerName: selectedLawyer || "Any Available Lawyer",
                lawyerId: selectedLawyerId || undefined,
                caseNumber: selectedCase,
                consultationType,
                preferredDate,
                preferredTime,
                mode,
                description,
            });

            alert("Consultation requested successfully");
            setShowModal(false);
            fetchConsultations();

            setSelectedCase("");
            setPreferredDate("");
            setPreferredTime("");
            setDescription("");
        } catch (err: any) {
            alert(err.response?.data?.message || "Request failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>
                {`
                    /* ========== BLACK & WHITE CLASSIC THEME ========== */
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }

                    body {
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Times New Roman', serif;
                        background: #f5f5f5;
                    }

                    .legal-wrapper {
                        padding-top: 100px;
                        padding-left: 40px;
                        padding-right: 40px;
                        padding-bottom: 80px;
                        min-height: 100vh;
                        background: linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%);
                    }

                    .legal-container {
                        max-width: 1400px;
                        margin: 0 auto;
                    }

                    /* ========== HERO SECTION WITH IMAGE SIDE BY SIDE ========== */
                    .hero-section {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 48px;
                        margin-bottom: 60px;
                        background: #ffffff;
                        border-radius: 24px;
                        overflow: hidden;
                        box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.1);
                        border: 1px solid #e0e0e0;
                    }

                    .hero-content {
                        padding: 48px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                    }

                    .hero-content h1 {
                        font-size: 42px;
                        font-weight: 700;
                        color: #000000;
                        margin-bottom: 16px;
                        letter-spacing: -0.02em;
                        line-height: 1.2;
                    }

                    .hero-content .subtitle {
                        font-size: 18px;
                        color: #4a4a4a;
                        line-height: 1.6;
                        margin-bottom: 32px;
                    }

                    .hero-image {
                        background-image: url('https://adityaandco.com/wp-content/uploads/2025/08/Civil-Lawyers-1024x717.webp');
                        background-size: cover;
                        background-position: center;
                        min-height: 100%;
                        width: 100%;
                    }

                    @media (max-width: 768px) {
                        .hero-section {
                            grid-template-columns: 1fr;
                        }
                        .hero-image {
                            min-height: 280px;
                            order: -1;
                        }
                        .hero-content {
                            padding: 32px;
                        }
                        .hero-content h1 {
                            font-size: 32px;
                        }
                        .hero-content .subtitle {
                            font-size: 16px;
                        }
                    }

                    /* ========== NOTICE BOX ========== */
                    .notice-box {
                        background: #fef9e6;
                        border-left: 4px solid #d4a373;
                        padding: 20px 24px;
                        border-radius: 12px;
                        margin-bottom: 40px;
                        color: #5e4b2b;
                    }

                    .notice-box strong {
                        color: #9c6e3e;
                    }

                    /* ========== WOMEN'S LAW SECTION ========== */
                    .law-section {
                        background: #ffffff;
                        border-radius: 20px;
                        padding: 32px;
                        margin-bottom: 48px;
                        border: 1px solid #eaeaea;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
                    }

                    .law-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        cursor: pointer;
                        padding: 8px 0;
                    }

                    .law-header h2 {
                        font-size: 24px;
                        font-weight: 600;
                        color: #1a1a1a;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }

                    .toggle-icon {
                        font-size: 20px;
                        color: #6b6b6b;
                        transition: transform 0.3s ease;
                    }

                    .toggle-icon.open {
                        transform: rotate(180deg);
                    }

                    .law-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
                        gap: 24px;
                        margin-top: 28px;
                    }

                    .law-card {
                        background: #fafafa;
                        border-radius: 16px;
                        padding: 20px;
                        border-left: 3px solid #2c2c2c;
                    }

                    .law-act {
                        font-size: 16px;
                        font-weight: 700;
                        color: #1e1e1e;
                        margin-bottom: 16px;
                        padding-bottom: 8px;
                        border-bottom: 1px solid #e0e0e0;
                    }

                    .law-section-item {
                        margin-bottom: 14px;
                        padding-bottom: 12px;
                        border-bottom: 1px solid #ededed;
                    }

                    .law-section-item:last-child {
                        border-bottom: none;
                        margin-bottom: 0;
                        padding-bottom: 0;
                    }

                    .section-number {
                        font-weight: 700;
                        color: #3a3a3a;
                        font-size: 14px;
                        font-family: monospace;
                    }

                    .section-desc {
                        font-size: 13px;
                        color: #4a4a4a;
                        margin: 4px 0;
                        line-height: 1.5;
                    }

                    .section-punishment {
                        font-size: 12px;
                        color: #8b3c3c;
                        background: #f5e8e8;
                        padding: 4px 8px;
                        border-radius: 4px;
                        display: inline-block;
                        margin-top: 6px;
                        font-family: monospace;
                    }

                    .emergency-contact {
                        background: #f2f2f2;
                        border: 1px solid #e0e0e0;
                        border-radius: 12px;
                        padding: 20px;
                        margin-top: 24px;
                        display: flex;
                        gap: 24px;
                        flex-wrap: wrap;
                    }

                    .emergency-item {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        font-size: 14px;
                    }

                    .emergency-item span {
                        font-weight: 700;
                        color: #2c2c2c;
                    }

                    /* ========== POLICY BANNER ========== */
                    .policy-banner {
                        background: #1e1e1e;
                        border-radius: 20px;
                        padding: 32px;
                        margin-bottom: 48px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        flex-wrap: wrap;
                        gap: 24px;
                        color: #ffffff;
                    }

                    .policy-banner h3 {
                        font-size: 22px;
                        font-weight: 600;
                        margin-bottom: 8px;
                    }

                    .policy-banner p {
                        color: #cccccc;
                        font-size: 14px;
                    }

                    .request-btn {
                        background: #ffffff;
                        color: #1e1e1e;
                        padding: 12px 28px;
                        border: none;
                        border-radius: 40px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        white-space: nowrap;
                        font-size: 15px;
                    }

                    .request-btn:hover {
                        background: #f0f0f0;
                        transform: translateY(-2px);
                    }

                    /* ========== SECTION HEADERS ========== */
                    .section-header {
                        font-size: 28px;
                        font-weight: 600;
                        color: #1a1a1a;
                        margin: 48px 0 24px 0;
                        padding-bottom: 12px;
                        border-bottom: 2px solid #e0e0e0;
                        letter-spacing: -0.3px;
                    }

                    /* ========== LAWYERS GRID ========== */
                    .lawyer-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                        gap: 24px;
                        margin-bottom: 48px;
                    }

                    .lawyer-card {
                        background: #ffffff;
                        padding: 28px;
                        border-radius: 20px;
                        border: 1px solid #eaeaea;
                        transition: all 0.25s ease;
                    }

                    .lawyer-card:hover {
                        border-color: #cccccc;
                        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
                        transform: translateY(-3px);
                    }

                    .lawyer-name {
                        font-size: 18px;
                        font-weight: 700;
                        color: #000000;
                        margin-bottom: 6px;
                    }

                    .lawyer-specialization {
                        font-size: 13px;
                        color: #6b6b6b;
                        margin-bottom: 12px;
                        letter-spacing: 0.3px;
                    }

                    .lawyer-rating {
                        display: inline-block;
                        background: #f5f5f5;
                        padding: 4px 10px;
                        border-radius: 20px;
                        font-weight: 600;
                        font-size: 12px;
                        margin-bottom: 20px;
                        color: #4a4a4a;
                    }

                    .consult-btn {
                        width: 100%;
                        background: #1e1e1e;
                        color: white;
                        border: none;
                        padding: 12px;
                        border-radius: 40px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        font-size: 14px;
                    }

                    .consult-btn:hover {
                        background: #3a3a3a;
                    }

                    /* ========== CONSULTATIONS LIST ========== */
                    .consultations-list {
                        margin-top: 20px;
                    }

                    .consultation-card {
                        background: #ffffff;
                        padding: 24px;
                        margin-bottom: 12px;
                        border-radius: 16px;
                        border: 1px solid #eaeaea;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        flex-wrap: wrap;
                        gap: 16px;
                        transition: all 0.2s ease;
                    }

                    .consultation-card:hover {
                        border-color: #d0d0d0;
                        background: #fefefe;
                    }

                    .consultation-info h4 {
                        font-size: 16px;
                        font-weight: 700;
                        color: #1a1a1a;
                        margin-bottom: 8px;
                    }

                    .consultation-details {
                        display: flex;
                        gap: 20px;
                        font-size: 13px;
                        color: #6b6b6b;
                        flex-wrap: wrap;
                    }

                    .status-badge {
                        padding: 6px 14px;
                        border-radius: 40px;
                        font-size: 12px;
                        font-weight: 600;
                    }

                    .status-pending {
                        background: #f5f0e6;
                        color: #9c6e3e;
                    }

                    .status-confirmed {
                        background: #e6f0f5;
                        color: #2c6b8f;
                    }

                    .status-completed {
                        background: #e6f5ed;
                        color: #2f6b47;
                    }

                    .status-cancelled {
                        background: #f5e6e6;
                        color: #9c3e3e;
                    }

                    .empty-state {
                        text-align: center;
                        padding: 48px;
                        background: #ffffff;
                        border-radius: 20px;
                        color: #9c9c9c;
                        border: 1px solid #eaeaea;
                    }

                    /* ========== MODAL ========== */
                    .modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.7);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 1000;
                    }

                    .modal-content {
                        background: #ffffff;
                        padding: 36px;
                        border-radius: 28px;
                        width: 550px;
                        max-width: 90%;
                        max-height: 90vh;
                        overflow-y: auto;
                    }

                    .modal-content h3 {
                        font-size: 24px;
                        font-weight: 700;
                        color: #000000;
                        margin-bottom: 24px;
                        border-bottom: 2px solid #eaeaea;
                        padding-bottom: 16px;
                    }

                    .form-group {
                        margin-bottom: 20px;
                    }

                    .form-label {
                        display: block;
                        font-size: 13px;
                        font-weight: 600;
                        color: #4a4a4a;
                        margin-bottom: 8px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }

                    .form-input,
                    .form-select,
                    .form-textarea {
                        width: 100%;
                        padding: 12px 16px;
                        border: 1px solid #e0e0e0;
                        border-radius: 12px;
                        font-size: 15px;
                        font-family: inherit;
                        transition: all 0.2s;
                    }

                    .form-input:focus,
                    .form-select:focus,
                    .form-textarea:focus {
                        outline: none;
                        border-color: #6b6b6b;
                        box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
                    }

                    .form-textarea {
                        resize: vertical;
                        min-height: 100px;
                    }

                    .modal-actions {
                        display: flex;
                        gap: 12px;
                        margin-top: 28px;
                    }

                    .submit-btn {
                        flex: 2;
                        background: #1e1e1e;
                        color: white;
                        border: none;
                        padding: 14px;
                        border-radius: 40px;
                        font-weight: 600;
                        cursor: pointer;
                    }

                    .submit-btn:hover:not(:disabled) {
                        background: #3a3a3a;
                    }

                    .cancel-btn {
                        flex: 1;
                        background: #f5f5f5;
                        color: #4a4a4a;
                        border: 1px solid #e0e0e0;
                        padding: 14px;
                        border-radius: 40px;
                        font-weight: 500;
                        cursor: pointer;
                    }

                    .help-text {
                        font-size: 12px;
                        color: #9c9c9c;
                        margin-top: 6px;
                    }

                    @media (max-width: 768px) {
                        .legal-wrapper {
                            padding: 80px 20px 40px;
                        }
                        .law-grid {
                            grid-template-columns: 1fr;
                        }
                        .consultation-card {
                            flex-direction: column;
                            align-items: flex-start;
                        }
                        .policy-banner {
                            flex-direction: column;
                            text-align: center;
                        }
                        .request-btn {
                            width: 100%;
                        }
                    }
                `}
            </style>

            <div className="legal-wrapper">
                <div className="legal-container">
                    {/* Hero Section with Image Side by Side */}
                    <div className="hero-section">
                        <div className="hero-content">
                            <h1>⚖️ Legal Consultation<br />& Cyber Law Support</h1>
                            <p className="subtitle">
                                Get expert legal advice for serious cyber harassment cases.
                                All consultations are confidential and legally privileged.
                                Our specialists handle women's cyber crime cases with priority.
                            </p>
                            <button
                                className="request-btn"
                                onClick={() => setShowModal(true)}
                                style={{ background: '#1e1e1e', color: '#ffffff', width: 'auto', alignSelf: 'flex-start' }}
                            >
                                Request Free Consultation →
                            </button>
                        </div>
                        <div className="hero-image"></div>
                    </div>

                    {/* Important Notice */}
                    <div className="notice-box">
                        <strong>⚠ Important:</strong> Move to legal consultation only if the issue is serious
                        (blackmail, threats, financial fraud, identity theft, repeated harassment,
                        privacy violations, or any crime against women).
                    </div>

                    {/* Women's Cyber Law Sections */}
                    <div className="law-section">
                        <div className="law-header" onClick={() => setShowSections(!showSections)}>
                            <h2>👩 Women's Cyber Law Protections in India</h2>
                            <span className={`toggle-icon ${showSections ? 'open' : ''}`}>▼</span>
                        </div>

                        {showSections && (
                            <>
                                <div className="law-grid">
                                    {womensLawSections.map((act, actIndex) => (
                                        <div key={actIndex} className="law-card">
                                            <div className="law-act">{act.act}</div>
                                            {act.sections.map((section, secIndex) => (
                                                <div key={secIndex} className="law-section-item">
                                                    <div className="section-number">{section.number}</div>
                                                    <div className="section-desc">{section.description}</div>
                                                    <div className="section-punishment">{section.punishment}</div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>

                                {/* Emergency Contacts for Women */}
                                <div className="emergency-contact">
                                    <div className="emergency-item">
                                        <span>🚨 Women's Helpline:</span> 181
                                    </div>
                                    <div className="emergency-item">
                                        <span>👩 Cyber Crime Women's Desk:</span> 1930
                                    </div>
                                    <div className="emergency-item">
                                        <span>⚖️ National Commission for Women:</span> 7827170170
                                    </div>
                                    <div className="emergency-item">
                                        <span>📞 Police Emergency:</span> 112
                                    </div>
                                </div>

                                <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "16px", fontStyle: "italic" }}>
                                    * These sections specifically protect women from cyber crimes including
                                    online harassment, revenge porn, cyberstalking, identity theft, and privacy violations.
                                    Our lawyers specialize in these protections.
                                </p>
                            </>
                        )}
                    </div>

                    {/* Free Policy Banner */}
                    <div className="policy-banner">
                        <div>
                            <h3>🎁 Free 30-Minute Legal Consultation</h3>
                            <p>
                                Every student is eligible for one free 30-minute consultation per case.
                                For extended legal guidance, paid consultation options are available.
                                Women's cyber crime cases are prioritized.
                            </p>
                        </div>
                        <button
                            className="request-btn"
                            onClick={() => setShowModal(true)}
                        >
                            Request Consultation
                        </button>
                    </div>

                    {/* Lawyers Grid */}
                    <h2 className="section-header">👩‍⚖️ Our Legal Experts</h2>
                    <div className="lawyer-grid">
                        {lawyersList.map((lawyer, index) => (
                            <div key={index} className="lawyer-card">
                                <div className="lawyer-name">{lawyer.name}</div>
                                <div className="lawyer-specialization">{lawyer.specialization}</div>
                                <div className="lawyer-rating">⭐ {lawyer.rating}</div>
                                <button
                                    className="consult-btn"
                                    onClick={() => {
                                        setSelectedLawyer(lawyer.name);
                                        setSelectedLawyerId(lawyer.id);
                                        setShowModal(true);
                                    }}
                                >
                                    Consult Now
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* My Consultations */}
                    <h2 className="section-header">📋 My Consultations</h2>

                    {consultations.length === 0 ? (
                        <div className="empty-state">
                            <p>No consultations yet.</p>
                            <p style={{ fontSize: "14px", marginTop: "8px", color: "#9ca3af" }}>
                                Request your first consultation using the button above.
                                Women's safety cases get priority response.
                            </p>
                        </div>
                    ) : (
                        <div className="consultations-list">
                            {consultations.map((c, index) => (
                                <div key={index} className="consultation-card">
                                    <div className="consultation-info">
                                        <h4>{c.lawyerName}</h4>
                                        <div className="consultation-details">
                                            <span>📋 Case: {c.caseNumber}</span>
                                            <span>⚖️ Type: {c.consultationType}</span>
                                            <span>📅 {c.preferredDate || "Date TBD"}</span>
                                            <span>⏰ {c.preferredTime || "Time TBD"}</span>
                                            <span>📞 Mode: {c.mode}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-end" }}>
                                        <span className={`status-badge status-${c.status?.toLowerCase() || 'pending'}`}>
                                            {c.status || "Pending"}
                                        </span>
                                        {c.status !== "Pending" && (
                                            <button
                                                onClick={() => generateFakePDF(c)}
                                                style={{ padding: "6px 12px", background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
                                            >
                                                📄 Generate Complaint PDF
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Modal */}
                    {showModal && (
                        <div className="modal-overlay" onClick={() => setShowModal(false)}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <h3>📝 Request Legal Consultation</h3>

                                <div className="form-group">
                                    <label className="form-label">Select Case *</label>
                                    <select
                                        className="form-select"
                                        onChange={(e) => setSelectedCase(e.target.value)}
                                        value={selectedCase}
                                    >
                                        <option value="">-- Choose a case --</option>
                                        {userCases.map((c) => (
                                            <option key={c._id} value={c.caseNumber}>
                                                {c.caseNumber} - {c.platform} ({c.severity})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Consultation Type</label>
                                    <select
                                        className="form-select"
                                        value={consultationType}
                                        onChange={(e) => setConsultationType(e.target.value)}
                                    >
                                        <option value="Free">Free 30-Minute (1 per case)</option>
                                        <option value="Paid">Paid Extended (₹999/hour)</option>
                                    </select>
                                    <div className="help-text">Women's cases: Free consultation available 24/7</div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Preferred Date</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={preferredDate}
                                        onChange={(e) => setPreferredDate(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Preferred Time</label>
                                    <input
                                        type="time"
                                        className="form-input"
                                        value={preferredTime}
                                        onChange={(e) => setPreferredTime(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Mode of Consultation</label>
                                    <select
                                        className="form-select"
                                        value={mode}
                                        onChange={(e) => setMode(e.target.value)}
                                    >
                                        <option value="Video Call">Video Call (Google Meet)</option>
                                        <option value="Phone Call">Phone Call</option>
                                        <option value="In-Person">In-Person (Lawyer's Office)</option>
                                        <option value="Women's Cell">Women's Cyber Cell (Special)</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Brief Description</label>
                                    <textarea
                                        className="form-textarea"
                                        placeholder="Briefly describe your legal issue... If it's a women's safety issue, mention it here."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button
                                        className="submit-btn"
                                        onClick={handleSubmit}
                                        disabled={loading}
                                    >
                                        {loading ? "Submitting..." : "Request Consultation"}
                                    </button>
                                    <button
                                        className="cancel-btn"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>

                                <div className="help-text" style={{ marginTop: "16px", textAlign: "center" }}>
                                    For immediate women's safety concerns, call 181 (Women's Helpline)
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default LegalConsultation;