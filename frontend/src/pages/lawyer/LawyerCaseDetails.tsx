import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const LawyerCaseDetails = () => {
    const { id } = useParams();
    const [caseData, setCaseData] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("Overview");

    const [newStatus, setNewStatus] = useState("");
    const [newNote, setNewNote] = useState("");

    const [draftCompany, setDraftCompany] = useState("");
    const [draftResult, setDraftResult] = useState<{ subject: string, body: string } | null>(null);

    const [verifying, setVerifying] = useState<{ [key: string]: boolean }>({});
    const [verificationResults, setVerificationResults] = useState<{ [key: string]: 'valid' | 'tampered' }>({});

    const verifyEvidence = async (fileName: string) => {
        try {
            setVerifying(prev => ({ ...prev, [fileName]: true }));
            const res = await api.get(`/cases/${id}/evidence/${fileName}/verify`);
            setVerificationResults(prev => ({ ...prev, [fileName]: res.data.valid ? 'valid' : 'tampered' }));
        } catch (err) {
            console.error("Verification error", err);
            alert("Verification failed");
        } finally {
            setVerifying(prev => ({ ...prev, [fileName]: false }));
        }
    };

    useEffect(() => {
        fetchCase();
    }, [id]);

    const fetchCase = async () => {
        try {
            const res = await api.get(`/cases/${id}`);
            setCaseData(res.data);
            setNewStatus(res.data.status);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateStatus = async () => {
        try {
            await api.put(`/cases/${id}/status`, { status: newStatus });
            alert("Status updated");
            fetchCase();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const handleAddNote = async () => {
        if (!newNote) return;
        try {
            await api.post(`/cases/${id}/note`, { text: newNote });
            setNewNote("");
            fetchCase();
        } catch (err) {
            alert("Failed to add note");
        }
    };

    const handleGenerateDraft = async () => {
        try {
            const res = await api.get(`/cases/${id}/corporate-draft?companyName=${encodeURIComponent(draftCompany)}`);
            setDraftResult(res.data);
            alert("Draft generated");
        } catch (err) {
            alert("Failed to generate draft");
        }
    };

    if (!caseData) return <><div style={{ paddingTop: "100px", textAlign: "center", color: "#888888", background: "#000000", minHeight: "100vh" }}>Loading...</div></>;

    return (
        <>
            <style>
                {`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .page {
                    padding: 100px 40px;
                    background: #000000;
                    min-height: 100vh;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
                }

                .page-header {
                    margin-bottom: 32px;
                }

                .page-header h2 {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #ffffff;
                    margin: 0;
                    letter-spacing: -0.02em;
                }

                .page-header p {
                    color: #888888;
                    margin-top: 8px;
                    font-size: 0.95rem;
                }

                .layout {
                    display: flex;
                    gap: 28px;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .main-content {
                    flex: 3;
                }

                .sidebar {
                    flex: 1;
                }

                .card {
                    background: #1a1a1a;
                    border-radius: 20px;
                    box-shadow: 0 20px 35px -10px rgba(0,0,0,0.3);
                    margin-bottom: 24px;
                    overflow: hidden;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    border: 1px solid #2a2a2a;
                }

                .card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 25px 40px -12px rgba(0,0,0,0.4);
                    border-color: #3a3a3a;
                }

                .card-header {
                    padding: 20px 24px;
                    border-bottom: 1px solid #2a2a2a;
                    background: #0f0f0f;
                }

                .card-header h3 {
                    margin: 0;
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #ffffff;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .card-body {
                    padding: 24px;
                }

                .tabs {
                    display: flex;
                    gap: 4px;
                    background: #0f0f0f;
                    padding: 6px;
                    border-radius: 12px;
                    margin-bottom: 24px;
                    border: 1px solid #2a2a2a;
                }

                .tab {
                    flex: 1;
                    padding: 10px 20px;
                    cursor: pointer;
                    border-radius: 8px;
                    font-weight: 500;
                    font-size: 0.9rem;
                    text-align: center;
                    transition: all 0.2s ease;
                    color: #888888;
                }

                .tab.active {
                    background: #2a2a2a;
                    color: #ffffff;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    font-weight: 600;
                }

                .tab:hover:not(.active) {
                    color: #cccccc;
                    background: #1a1a1a;
                }

                .btn {
                    padding: 8px 16px;
                    background: #2a2a2a;
                    color: #ffffff;
                    border: 1px solid #3a3a3a;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 500;
                    font-size: 0.875rem;
                    transition: all 0.2s ease;
                }

                .btn:hover {
                    background: #333333;
                    transform: translateY(-1px);
                    border-color: #555555;
                }

                .btn:active {
                    transform: translateY(0);
                }

                .btn-secondary {
                    background: #2a2a2a;
                    border-color: #444444;
                }

                .btn-secondary:hover {
                    background: #3a3a3a;
                }

                .btn-outline {
                    background: transparent;
                    color: #ffffff;
                    border: 1px solid #3a3a3a;
                }

                .btn-outline:hover {
                    background: #2a2a2a;
                    transform: translateY(-1px);
                }

                .input-group {
                    margin-bottom: 20px;
                }

                .input-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    font-size: 0.85rem;
                    color: #aaaaaa;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .input-group select, 
                .input-group textarea, 
                .input-group input {
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid #2a2a2a;
                    border-radius: 10px;
                    font-size: 0.9rem;
                    transition: all 0.2s ease;
                    font-family: inherit;
                    background: #0f0f0f;
                    color: #ffffff;
                }

                .input-group select:focus,
                .input-group textarea:focus,
                .input-group input:focus {
                    outline: none;
                    border-color: #666666;
                    box-shadow: 0 0 0 3px rgba(102,102,102,0.1);
                }

                .input-group select option {
                    background: #1a1a1a;
                    color: #ffffff;
                }

                .badge {
                    padding: 4px 12px;
                    border-radius: 20px;
                    color: #ffffff;
                    font-size: 0.75rem;
                    font-weight: 600;
                    display: inline-block;
                    letter-spacing: 0.3px;
                    background: #2a2a2a;
                    border: 1px solid #3a3a3a;
                }

                .severity-high, .severity-medium, .severity-low {
                    background: #2a2a2a;
                }

                .item-list {
                    border-bottom: 1px solid #2a2a2a;
                    padding: 16px 0;
                    transition: background 0.2s ease;
                }

                .item-list:last-child {
                    border-bottom: none;
                }

                .item-list:hover {
                    background: #0f0f0f;
                    margin: 0 -24px;
                    padding: 16px 24px;
                }

                .draft-box {
                    background: #0f0f0f;
                    padding: 20px;
                    border: 1px solid #2a2a2a;
                    border-radius: 12px;
                    margin-top: 20px;
                    font-family: 'SF Mono', Monaco, monospace;
                    font-size: 0.85rem;
                    line-height: 1.6;
                    color: #e0e0e0;
                }

                .info-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 12px 0;
                    border-bottom: 1px solid #2a2a2a;
                }

                .info-row:last-child {
                    border-bottom: none;
                }

                .info-label {
                    font-weight: 600;
                    color: #888888;
                    font-size: 0.85rem;
                }

                .info-value {
                    color: #ffffff;
                    font-weight: 500;
                }

                hr {
                    margin: 20px 0;
                    border: none;
                    border-top: 1px solid #2a2a2a;
                }

                .evidence-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px;
                    background: #0f0f0f;
                    border-radius: 10px;
                    margin-bottom: 10px;
                    transition: all 0.2s ease;
                    border: 1px solid #2a2a2a;
                }

                .evidence-item:hover {
                    background: #1a1a1a;
                    transform: translateX(4px);
                    border-color: #3a3a3a;
                }

                .evidence-name {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-weight: 500;
                    color: #e0e0e0;
                }

                .evidence-actions {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }

                .note-item {
                    background: #0f0f0f;
                    border-left: 3px solid #ffffff;
                    padding: 12px 16px;
                    margin-bottom: 12px;
                    border-radius: 8px;
                    border: 1px solid #2a2a2a;
                }

                .note-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    font-size: 0.8rem;
                    color: #888888;
                }

                .note-role {
                    font-weight: 600;
                    color: #ffffff;
                }

                .note-text {
                    color: #cccccc;
                    line-height: 1.5;
                }

                @keyframes shimmer {
                    0% { background-position: -1000px 0; }
                    100% { background-position: 1000px 0; }
                }

                .loading-shimmer {
                    background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
                    background-size: 1000px 100%;
                    animation: shimmer 2s infinite;
                }

                @media (max-width: 768px) {
                    .page {
                        padding: 80px 20px;
                    }
                    
                    .layout {
                        flex-direction: column;
                        gap: 20px;
                    }
                    
                    .tabs {
                        flex-direction: column;
                    }
                    
                    .tab {
                        text-align: center;
                    }
                    
                    .evidence-item {
                        flex-direction: column;
                        gap: 12px;
                        align-items: flex-start;
                    }
                    
                    .evidence-actions {
                        width: 100%;
                        justify-content: flex-start;
                    }
                }
                `}
            </style>

            <div className="page">
                <div className="page-header">
                    <h2>Legal Case Review</h2>
                    <p>Case ID: {caseData.caseNumber} • Manage and track legal proceedings</p>
                </div>

                <div className="layout">
                    {/* LEFT MAIN TABS */}
                    <div className="main-content">
                        <div className="card">
                            <div className="card-header">
                                <h3>Case Details</h3>
                            </div>
                            <div className="card-body">
                                <div className="tabs">
                                    {["Overview", "Evidence", "Draft Tool"].map(tab => (
                                        <div
                                            key={tab}
                                            className={"tab " + (activeTab === tab ? "active" : "")}
                                            onClick={() => setActiveTab(tab)}
                                        >
                                            {tab}
                                        </div>
                                    ))}
                                </div>

                                <div className="tab-content">
                                    {activeTab === "Overview" && (
                                        <div>
                                            <div className="info-row">
                                                <span className="info-label">Description</span>
                                                <span className="info-value">{caseData.description}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">Platform</span>
                                                <span className="info-value">{caseData.platform}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">Incident Date & Time</span>
                                                <span className="info-value">{caseData.incidentDate} {caseData.incidentTime}</span>
                                            </div>

                                            <hr />

                                            <h4 style={{ marginBottom: "16px", color: "#ffffff", fontSize: "1rem" }}>Case Timeline & Notes</h4>
                                            <div>
                                                {caseData.notes?.length > 0 ? caseData.notes.map((n: any, i: number) => (
                                                    <div key={i} className="note-item">
                                                        <div className="note-header">
                                                            <span className="note-role">{n.role}</span>
                                                            <span>{new Date(n.date).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="note-text">{n.text}</div>
                                                    </div>
                                                )) : <p style={{ color: "#666666", textAlign: "center", padding: "20px" }}>No notes available.</p>}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "Evidence" && (
                                        <div>
                                            <p style={{ marginBottom: "20px", color: "#888888" }}>Review and verify the evidence uploaded by the student for this case.</p>
                                            {caseData.evidence?.length > 0 ? caseData.evidence.map((e: any, i: number) => (
                                                <div key={i} className="evidence-item">
                                                    <div className="evidence-name">
                                                        <span style={{ fontSize: "20px" }}>📄</span>
                                                        <span>{e.fileName}</span>
                                                        <span style={{ fontSize: "0.75rem", color: "#666666" }}>({(e.size / 1024).toFixed(2)} KB)</span>
                                                    </div>
                                                    <div className="evidence-actions">
                                                        {verificationResults[e.fileName] ? (
                                                            <span className="badge" style={{ background: verificationResults[e.fileName] === 'valid' ? "#2a2a2a" : "#2a2a2a", borderColor: verificationResults[e.fileName] === 'valid' ? "#10b981" : "#ef4444", color: verificationResults[e.fileName] === 'valid' ? "#10b981" : "#ef4444" }}>
                                                                {verificationResults[e.fileName] === 'valid' ? "✓ Verified" : "⚠ Tampered"}
                                                            </span>
                                                        ) : (
                                                            <button
                                                                onClick={() => verifyEvidence(e.fileName)}
                                                                className="btn btn-secondary"
                                                                style={{ padding: "6px 12px", fontSize: "0.75rem" }}
                                                                disabled={verifying[e.fileName]}
                                                            >
                                                                {verifying[e.fileName] ? "Verifying..." : "Verify Hash"}
                                                            </button>
                                                        )}
                                                        <a href={`http://localhost:5000/uploads/${e.storedName}`} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ textDecoration: "none", padding: "6px 12px", fontSize: "0.75rem" }}>View</a>
                                                    </div>
                                                </div>
                                            )) : <p style={{ color: "#666666", textAlign: "center", padding: "40px" }}>No evidence uploaded for this case.</p>}
                                        </div>
                                    )}

                                    {activeTab === "Draft Tool" && (
                                        <div>
                                            <p style={{ marginBottom: "20px", color: "#888888" }}>Generate a formal corporate misconduct report drafted by the AI engine to send to the platform or employer.</p>
                                            <div className="input-group">
                                                <label>Target Company/Platform Name</label>
                                                <input type="text" value={draftCompany} onChange={e => setDraftCompany(e.target.value)} placeholder="e.g., LinkedIn Legal Team, Meta Compliance" />
                                            </div>
                                            <button className="btn" onClick={handleGenerateDraft}>Generate Draft Report</button>

                                            {draftResult && (
                                                <div className="draft-box">
                                                    <div style={{ fontWeight: "600", marginBottom: "12px", color: "#ffffff" }}>
                                                        📧 {draftResult.subject}
                                                    </div>
                                                    <div style={{ whiteSpace: "pre-wrap" }}>
                                                        {draftResult.body}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR - ACTIONS */}
                    <div className="sidebar">
                        <div className="card">
                            <div className="card-header">
                                <h3>📋 Case Information</h3>
                            </div>
                            <div className="card-body">
                                <div className="info-row">
                                    <span className="info-label">Severity</span>
                                    <span className="badge">
                                        {caseData.severity}
                                    </span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Status</span>
                                    <span className="info-value" style={{ fontWeight: "600" }}>{caseData.status}</span>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <h3>⚡ Quick Actions</h3>
                            </div>
                            <div className="card-body">
                                <div className="input-group">
                                    <label>Update Status</label>
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <select value={newStatus} onChange={e => setNewStatus(e.target.value)} style={{ flex: 1 }}>
                                            <option value="New">New</option>
                                            <option value="Under Review">Under Review</option>
                                            <option value="Escalated">Escalated</option>
                                            <option value="Resolved">Resolved</option>
                                            <option value="Closed">Closed</option>
                                        </select>
                                        <button className="btn" onClick={handleUpdateStatus}>Save</button>
                                    </div>
                                </div>

                                <hr />

                                <div className="input-group">
                                    <label>Add Legal Note</label>
                                    <textarea
                                        rows={4}
                                        value={newNote}
                                        onChange={e => setNewNote(e.target.value)}
                                        placeholder="Add private observation or correspondence record..."
                                        style={{ resize: "vertical" }}
                                    ></textarea>
                                    <button className="btn" style={{ marginTop: "12px", width: "100%" }} onClick={handleAddNote}>
                                        Add Note
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LawyerCaseDetails;