import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

const LegalConsultation = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedLawyer, setSelectedLawyer] = useState("");
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

    const lawyers = [
        { name: "Adv. Priya Mehta", specialization: "Cyber Law Specialist (Women's Safety)", rating: "4.9" },
        { name: "Adv. Rahul Sharma", specialization: "Criminal & Cyber Law", rating: "4.8" },
        { name: "Adv. Sneha Reddy", specialization: "IT Act & Women's Rights", rating: "4.7" },
        { name: "Adv. Vikram Singh", specialization: "Constitutional & Cyber Law", rating: "4.9" },
    ];

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
            setConsultations(res.data);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    const fetchUserCases = async () => {
        try {
            const res = await api.get("/cases");
            setUserCases(res.data.cases || []);
        } catch (error) {
            console.error("Fetch cases error:", error);
        }
    };

    useEffect(() => {
        fetchConsultations();
        fetchUserCases();
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

            // Reset form
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
            <Navbar />

            <style>
                {`
                    /* ========== Global Styles ========== */
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }

                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                        background-color: #f3f4f6;
                    }

                    .legal-wrapper {
                        padding-top: 100px;
                        padding-left: 40px;
                        padding-right: 40px;
                        padding-bottom: 80px;
                        min-height: 100vh;
                        background-color: #f3f4f6;
                    }

                    .legal-container {
                        max-width: 1200px;
                        margin: 0 auto;
                    }

                    /* Header */
                    .main-title {
                        font-size: 32px;
                        font-weight: 700;
                        color: #111827;
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

                    /* Important Notice */
                    .notice-box {
                        background: #fff3cd;
                        border-left: 4px solid #ffc107;
                        padding: 16px 20px;
                        border-radius: 8px;
                        margin-bottom: 30px;
                    }

                    .notice-box strong {
                        color: #856404;
                    }

                    /* Free Policy Banner */
                    .policy-banner {
                        background: #ecfdf5;
                        border-left: 4px solid #10b981;
                        padding: 24px;
                        border-radius: 8px;
                        margin-bottom: 40px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        flex-wrap: wrap;
                        gap: 20px;
                    }

                    .policy-banner h3 {
                        font-size: 20px;
                        font-weight: 600;
                        color: #047857;
                        margin-bottom: 8px;
                    }

                    .policy-banner p {
                        color: #065f46;
                    }

                    .request-btn {
                        background: #2563eb;
                        color: white;
                        padding: 12px 24px;
                        border: none;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        white-space: nowrap;
                    }

                    .request-btn:hover {
                        background: #1d4ed8;
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
                    }

                    /* Women's Law Section */
                    .law-section {
                        background: white;
                        border-radius: 12px;
                        padding: 24px;
                        margin-bottom: 40px;
                        border: 1px solid #e5e7eb;
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
                        color: #be185d;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }

                    .toggle-icon {
                        font-size: 24px;
                        color: #be185d;
                        transition: transform 0.3s ease;
                    }

                    .toggle-icon.open {
                        transform: rotate(180deg);
                    }

                    .law-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                        gap: 20px;
                        margin-top: 20px;
                    }

                    .law-card {
                        background: #fdf2f8;
                        border-radius: 10px;
                        padding: 20px;
                        border-left: 4px solid #be185d;
                    }

                    .law-act {
                        font-size: 16px;
                        font-weight: 600;
                        color: #be185d;
                        margin-bottom: 12px;
                    }

                    .law-section-item {
                        margin-bottom: 16px;
                        padding-bottom: 12px;
                        border-bottom: 1px solid #fbcfe8;
                    }

                    .law-section-item:last-child {
                        border-bottom: none;
                        margin-bottom: 0;
                        padding-bottom: 0;
                    }

                    .section-number {
                        font-weight: 700;
                        color: #9d174d;
                        font-size: 15px;
                    }

                    .section-desc {
                        font-size: 14px;
                        color: #4b5563;
                        margin: 4px 0;
                        line-height: 1.5;
                    }

                    .section-punishment {
                        font-size: 13px;
                        color: #b91c1c;
                        background: #fee2e2;
                        padding: 4px 8px;
                        border-radius: 4px;
                        display: inline-block;
                        margin-top: 4px;
                    }

                    .emergency-contact {
                        background: #fef2f2;
                        border: 1px solid #fecaca;
                        border-radius: 8px;
                        padding: 16px;
                        margin-top: 20px;
                        display: flex;
                        gap: 20px;
                        flex-wrap: wrap;
                    }

                    .emergency-item {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }

                    .emergency-item span {
                        font-weight: 600;
                        color: #991b1b;
                    }

                    /* Section Headers */
                    .section-header {
                        font-size: 24px;
                        font-weight: 600;
                        color: #111827;
                        margin: 40px 0 20px 0;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }

                    /* Lawyers Grid */
                    .lawyer-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                        gap: 24px;
                        margin-bottom: 50px;
                    }

                    .lawyer-card {
                        background: white;
                        padding: 24px;
                        border-radius: 12px;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                        border: 1px solid #e5e7eb;
                        transition: all 0.2s ease;
                    }

                    .lawyer-card:hover {
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                        transform: translateY(-2px);
                    }

                    .lawyer-name {
                        font-size: 18px;
                        font-weight: 600;
                        color: #111827;
                        margin-bottom: 4px;
                    }

                    .lawyer-specialization {
                        font-size: 14px;
                        color: #6b7280;
                        margin-bottom: 8px;
                    }

                    .lawyer-rating {
                        display: inline-block;
                        background: #fbbf24;
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-weight: 600;
                        font-size: 13px;
                        margin-bottom: 16px;
                    }

                    .consult-btn {
                        width: 100%;
                        background: #2563eb;
                        color: white;
                        border: none;
                        padding: 10px;
                        border-radius: 6px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    }

                    .consult-btn:hover {
                        background: #1d4ed8;
                    }

                    /* Consultations List */
                    .consultations-list {
                        margin-top: 20px;
                    }

                    .consultation-card {
                        background: white;
                        padding: 20px;
                        margin-bottom: 12px;
                        border-radius: 10px;
                        border: 1px solid #e5e7eb;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        transition: all 0.2s ease;
                    }

                    .consultation-card:hover {
                        border-color: #2563eb;
                    }

                    .consultation-info h4 {
                        font-size: 16px;
                        font-weight: 600;
                        color: #111827;
                        margin-bottom: 6px;
                    }

                    .consultation-details {
                        display: flex;
                        gap: 20px;
                        font-size: 14px;
                        color: #6b7280;
                        flex-wrap: wrap;
                    }

                    .status-badge {
                        padding: 6px 12px;
                        border-radius: 20px;
                        font-size: 13px;
                        font-weight: 500;
                    }

                    .status-pending {
                        background: #fef3c7;
                        color: #92400e;
                    }

                    .status-confirmed {
                        background: #dbeafe;
                        color: #1e40af;
                    }

                    .status-completed {
                        background: #d1fae5;
                        color: #065f46;
                    }

                    .status-cancelled {
                        background: #fee2e2;
                        color: #991b1b;
                    }

                    /* Empty State */
                    .empty-state {
                        text-align: center;
                        padding: 40px;
                        background: white;
                        border-radius: 12px;
                        color: #9ca3af;
                        border: 1px dashed #e5e7eb;
                    }

                    /* Modal */
                    .modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.5);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 1000;
                        animation: fadeIn 0.3s ease;
                    }

                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }

                    .modal-content {
                        background: white;
                        padding: 32px;
                        border-radius: 16px;
                        width: 500px;
                        max-width: 90%;
                        max-height: 90vh;
                        overflow-y: auto;
                        animation: slideUp 0.3s ease;
                    }

                    @keyframes slideUp {
                        from {
                            transform: translateY(20px);
                            opacity: 0;
                        }
                        to {
                            transform: translateY(0);
                            opacity: 1;
                        }
                    }

                    .modal-content h3 {
                        font-size: 22px;
                        font-weight: 600;
                        color: #111827;
                        margin-bottom: 24px;
                        border-bottom: 1px solid #e5e7eb;
                        padding-bottom: 12px;
                    }

                    .form-group {
                        margin-bottom: 16px;
                    }

                    .form-label {
                        display: block;
                        font-size: 14px;
                        font-weight: 500;
                        color: #4b5563;
                        margin-bottom: 6px;
                    }

                    .form-input,
                    .form-select,
                    .form-textarea {
                        width: 100%;
                        padding: 12px;
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                        font-size: 15px;
                        transition: all 0.2s ease;
                        font-family: inherit;
                    }

                    .form-input:focus,
                    .form-select:focus,
                    .form-textarea:focus {
                        outline: none;
                        border-color: #2563eb;
                        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
                    }

                    .form-textarea {
                        resize: vertical;
                        min-height: 100px;
                    }

                    .modal-actions {
                        display: flex;
                        gap: 12px;
                        margin-top: 24px;
                    }

                    .submit-btn {
                        flex: 2;
                        background: #16a34a;
                        color: white;
                        border: none;
                        padding: 12px;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    }

                    .submit-btn:hover:not(:disabled) {
                        background: #15803d;
                    }

                    .submit-btn:disabled {
                        opacity: 0.6;
                        cursor: not-allowed;
                    }

                    .cancel-btn {
                        flex: 1;
                        background: #f3f4f6;
                        color: #4b5563;
                        border: 1px solid #e5e7eb;
                        padding: 12px;
                        border-radius: 8px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    }

                    .cancel-btn:hover {
                        background: #e5e7eb;
                    }

                    /* Help Text */
                    .help-text {
                        font-size: 12px;
                        color: #9ca3af;
                        margin-top: 4px;
                    }

                    /* Responsive */
                    @media (max-width: 768px) {
                        .legal-wrapper {
                            padding: 80px 16px 40px;
                        }

                        .main-title {
                            font-size: 28px;
                        }

                        .policy-banner {
                            flex-direction: column;
                            align-items: flex-start;
                        }

                        .request-btn {
                            width: 100%;
                            text-align: center;
                        }

                        .lawyer-grid {
                            grid-template-columns: 1fr;
                        }

                        .law-grid {
                            grid-template-columns: 1fr;
                        }

                        .consultation-card {
                            flex-direction: column;
                            align-items: flex-start;
                            gap: 12px;
                        }

                        .consultation-details {
                            flex-direction: column;
                            gap: 6px;
                        }

                        .emergency-contact {
                            flex-direction: column;
                            gap: 12px;
                        }
                    }
                `}
            </style>

            <div className="legal-wrapper">
                <div className="legal-container">
                    {/* Header */}
                    <h1 className="main-title">⚖️ Legal Consultation & Cyber Law Support</h1>
                    <p className="subtitle">
                        Get expert legal advice for serious cyber harassment cases.
                        All consultations are confidential and legally privileged.
                    </p>

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
                        {lawyers.map((lawyer, index) => (
                            <div key={index} className="lawyer-card">
                                <div className="lawyer-name">{lawyer.name}</div>
                                <div className="lawyer-specialization">{lawyer.specialization}</div>
                                <div className="lawyer-rating">⭐ {lawyer.rating}</div>
                                <button
                                    className="consult-btn"
                                    onClick={() => {
                                        setSelectedLawyer(lawyer.name);
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