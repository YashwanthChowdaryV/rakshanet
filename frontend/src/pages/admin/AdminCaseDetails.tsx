import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

const AdminCaseDetails = () => {
    const { id } = useParams();
    const [caseData, setCaseData] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("Overview");

    // Actions
    const [newStatus, setNewStatus] = useState("");
    const [newNote, setNewNote] = useState("");
    const [assignRole, setAssignRole] = useState("counselor"); // fallback
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

    const handleAssignCase = async () => {
        try {
            const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
            await api.put(`/cases/${id}/assign`, { userId: currentUser.id, role: assignRole });
            alert("Assigned successfully");
            fetchCase();
        } catch (err) {
            alert("Failed to assign case");
        }
    };

    const handleDeleteCase = async () => {
        if (!window.confirm("Are you sure you want to permanently delete this case?")) return;
        try {
            await api.delete(`/cases/${id}`);
            alert("Case deleted successfully");
            // Redirect back to admin cases page
            window.location.href = "/admin/cases";
        } catch (err) {
            alert("Failed to delete case");
        }
    };

    if (!caseData) return <><div style={{ paddingTop: "100px", textAlign: "center", background: "#fff5f5", minHeight: "100vh", color: "#b91c1c" }}>Loading...</div></>;

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "Critical": return "#dc2626";
            case "High": return "#f97316";
            case "Medium": return "#eab308";
            case "Low": return "#10b981";
            default: return "#6b7280";
        }
    };

    const getSeverityBg = (severity: string) => {
        switch (severity) {
            case "Critical": return "#fee2e2";
            case "High": return "#fff7ed";
            case "Medium": return "#fefce8";
            case "Low": return "#f0fdf4";
            default: return "#f3f4f6";
        }
    };

    return (
        <>
            <style>
                {`
                .page { 
                    padding: 100px 40px; 
                    background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%); 
                    min-height: 100vh;
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
                    background: white; 
                    padding: 24px; 
                    border-radius: 20px; 
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                    border: 1px solid #ffe0e0;
                    margin-bottom: 24px;
                    transition: all 0.3s ease;
                }
                .card:hover {
                    box-shadow: 0 8px 20px rgba(220, 38, 38, 0.08);
                }
                .tabs { 
                    display: flex; 
                    gap: 8px; 
                    border-bottom: 1px solid #ffe0e0; 
                    margin-bottom: 24px; 
                }
                .tab { 
                    padding: 12px 20px; 
                    cursor: pointer; 
                    border-bottom: 2px solid transparent;
                    color: #b86f88;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }
                .tab.active { 
                    border-bottom-color: #dc2626; 
                    color: #b91c1c; 
                    font-weight: 600;
                }
                .tab:hover:not(.active) {
                    color: #b91c1c;
                }
                .btn { 
                    padding: 8px 16px; 
                    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                    color: white; 
                    border: none; 
                    border-radius: 40px; 
                    cursor: pointer; 
                    font-weight: 600;
                    font-size: 13px;
                    transition: all 0.2s ease;
                }
                .btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
                }
                .btn-danger { 
                    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                    color: white; 
                    padding: 12px 20px; 
                    border: none; 
                    border-radius: 40px; 
                    cursor: pointer; 
                    font-weight: 600;
                    width: 100%;
                    transition: all 0.2s ease;
                }
                .btn-danger:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
                }
                .input-group { 
                    margin-bottom: 20px; 
                }
                .input-group label { 
                    display: block; 
                    margin-bottom: 8px; 
                    font-weight: 600; 
                    font-size: 13px;
                    color: #b91c1c;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .input-group select, 
                .input-group textarea, 
                .input-group input { 
                    width: 100%; 
                    padding: 10px 14px; 
                    border: 1px solid #ffe0e0; 
                    border-radius: 12px; 
                    box-sizing: border-box;
                    font-family: inherit;
                    font-size: 14px;
                    transition: all 0.2s ease;
                    background: white;
                }
                .input-group select:focus, 
                .input-group textarea:focus, 
                .input-group input:focus {
                    outline: none;
                    border-color: #dc2626;
                    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
                }
                .badge { 
                    padding: 6px 14px; 
                    border-radius: 40px; 
                    color: white; 
                    font-size: 12px; 
                    font-weight: 600;
                    display: inline-block;
                }
                .item-list { 
                    border-bottom: 1px solid #ffe0e0; 
                    padding: 16px 0; 
                    transition: background 0.2s ease;
                }
                .item-list:last-child { 
                    border-bottom: none; 
                }
                .item-list:hover {
                    background: #fff5f5;
                    margin: 0 -24px;
                    padding: 16px 24px;
                }
                h2 {
                    font-size: 28px;
                    font-weight: 700;
                    background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 28px;
                }
                h3 {
                    color: #b91c1c;
                    font-size: 18px;
                    font-weight: 700;
                    margin-top: 0;
                    margin-bottom: 16px;
                }
                hr {
                    margin: 20px 0;
                    border: none;
                    border-top: 1px solid #ffe0e0;
                }
                @media (max-width: 768px) {
                    .page {
                        padding: 80px 20px;
                    }
                    .layout {
                        flex-direction: column;
                    }
                }
                `}
            </style>

            <div className="page">
                <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
                    <h2>Admin Case Details: {caseData.caseNumber}</h2>

                    <div className="layout">
                        {/* LEFT MAIN TABS */}
                        <div className="main-content">
                            <div className="card">
                                <div className="tabs">
                                    {["Overview", "Timeline", "Notes", "Evidence"].map(tab => (
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
                                            <p><strong style={{ color: "#b91c1c" }}>Description:</strong> <br />{caseData.description}</p>
                                            <hr />
                                            <p><strong style={{ color: "#b91c1c" }}>Victim Details:</strong> {caseData.victim?.alias || "Anonymous"}</p>
                                            <p><strong style={{ color: "#b91c1c" }}>Platform:</strong> {caseData.platform}</p>
                                            <p><strong style={{ color: "#b91c1c" }}>Date:</strong> {caseData.incidentDate} {caseData.incidentTime}</p>
                                        </div>
                                    )}

                                    {activeTab === "Timeline" && (
                                        <div>
                                            {caseData.timeline?.length > 0 ? caseData.timeline.map((t: any, i: number) => (
                                                <div key={i} className="item-list">
                                                    <strong style={{ color: "#b91c1c" }}>{new Date(t.date || new Date()).toLocaleDateString()} - {t.action}</strong>
                                                    <p style={{ margin: "8px 0 0", color: "#6b7280" }}>By {t.actor}: {t.note}</p>
                                                </div>
                                            )) : <p style={{ color: "#b86f88", textAlign: "center", padding: "20px" }}>No timeline events yet.</p>}
                                        </div>
                                    )}

                                    {activeTab === "Notes" && (
                                        <div>
                                            {caseData.notes?.length > 0 ? caseData.notes.map((n: any, i: number) => (
                                                <div key={i} className="item-list">
                                                    <strong style={{ color: "#b91c1c" }}>{n.role}</strong>
                                                    <span style={{ color: "#9ca3af", fontSize: "12px" }}> ({new Date(n.date || new Date()).toLocaleDateString()}):</span>
                                                    <p style={{ margin: "8px 0 0", color: "#4b5563" }}>{n.text}</p>
                                                </div>
                                            )) : <p style={{ color: "#b86f88", textAlign: "center", padding: "20px" }}>No notes yet.</p>}
                                        </div>
                                    )}

                                    {activeTab === "Evidence" && (
                                        <div>
                                            {caseData.evidence?.length > 0 ? caseData.evidence.map((e: any, i: number) => (
                                                <div key={i} className="item-list" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                                                    <span>📄 {e.fileName} ({(e.size / 1024).toFixed(2)} KB)</span>
                                                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                                        {verificationResults[e.fileName] ? (
                                                            <span className="badge" style={{ background: verificationResults[e.fileName] === 'valid' ? "#10b981" : "#ef4444" }}>
                                                                {verificationResults[e.fileName] === 'valid' ? "✅ Valid Match" : "❌ Tampered"}
                                                            </span>
                                                        ) : (
                                                            <button
                                                                onClick={() => verifyEvidence(e.fileName)}
                                                                className="btn"
                                                                style={{ padding: "6px 14px", fontSize: "12px", background: "#f59e0b" }}
                                                                disabled={verifying[e.fileName]}
                                                            >
                                                                {verifying[e.fileName] ? "Verifying..." : "Verify Hash"}
                                                            </button>
                                                        )}
                                                        <a href={`http://localhost:5000/uploads/${e.storedName}`} target="_blank" rel="noreferrer" className="btn" style={{ textDecoration: "none" }}>View</a>
                                                    </div>
                                                </div>
                                            )) : <p style={{ color: "#b86f88", textAlign: "center", padding: "20px" }}>No evidence uploaded.</p>}
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDEBAR - ACTIONS */}
                        <div className="sidebar">
                            <div className="card">
                                <h3>Case Info</h3>
                                <p style={{ margin: "12px 0" }}>
                                    Severity: <span className="badge" style={{ background: getSeverityColor(caseData.severity) }}>{caseData.severity}</span>
                                </p>
                                <p style={{ margin: "12px 0" }}>
                                    Status: <strong style={{ color: "#b91c1c" }}>{caseData.status}</strong>
                                </p>
                                <p style={{ margin: "12px 0" }}>
                                    Assigned To: <strong style={{ color: "#b91c1c" }}>{caseData.assignedTo?.role ? `${caseData.assignedTo.role}` : "Unassigned"}</strong>
                                </p>
                            </div>

                            <div className="card">
                                <h3>Actions</h3>

                                <div className="input-group">
                                    <label>Change Status</label>
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
                                    <label>Assign Case</label>
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <select value={assignRole} onChange={e => setAssignRole(e.target.value)} style={{ flex: 1 }}>
                                            <option value="counselor">To Me (Counselor)</option>
                                            <option value="lawyer">Escalate to Lawyer</option>
                                        </select>
                                        <button className="btn" onClick={handleAssignCase}>Assign</button>
                                    </div>
                                </div>

                                <hr />

                                <div className="input-group">
                                    <label>Add Note</label>
                                    <textarea rows={3} value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Add private note about this case..."></textarea>
                                    <button className="btn" style={{ marginTop: "12px", width: "100%" }} onClick={handleAddNote}>Add Note</button>
                                </div>
                            </div>

                            <div className="card" style={{ borderColor: "#dc2626", borderWidth: "2px", borderStyle: "solid", background: "#fff5f5" }}>
                                <h3 style={{ color: "#dc2626" }}>⚠️ Danger Zone</h3>
                                <p style={{ fontSize: "12px", color: "#b86f88", marginBottom: "15px" }}>Warning: Deleting a case is permanent and cannot be undone.</p>
                                <button className="btn-danger" onClick={handleDeleteCase}>Delete Case Permanently</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminCaseDetails;