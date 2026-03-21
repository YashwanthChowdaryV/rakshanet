import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import CounselorSessions from "./CounselorSessions";

const CounselorCaseDetails = () => {
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
            // Using placeholder userId for now as we don't have a user selector
            // In a real app we would select a specific user ID
            const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
            await api.put(`/cases/${id}/assign`, { userId: currentUser.id, role: assignRole });
            alert("Assigned successfully");
            fetchCase();
        } catch (err) {
            alert("Failed to assign case");
        }
    };

    if (!caseData) return <><div style={{paddingTop: "100px", textAlign: "center"}}>Loading...</div></>;

    return (
        <>
                        <style>
                {`
                .page { padding: 100px 40px; background: #f3f4f6; min-height: 100vh; }
                .layout { display: flex; gap: 20px; }
                .main-content { flex: 3; }
                .sidebar { flex: 1; }
                .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 20px; }
                .tabs { display: flex; gap: 10px; border-bottom: 1px solid #ddd; margin-bottom: 20px; }
                .tab { padding: 10px 15px; cursor: pointer; border-bottom: 2px solid transparent; }
                .tab.active { border-bottom-color: #2563eb; color: #2563eb; font-weight: bold; }
                .btn { padding: 8px 12px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; }
                .input-group { margin-bottom: 15px; }
                .input-group label { display: block; margin-bottom: 5px; font-weight: bold; font-size: 14px; }
                .input-group select, .input-group textarea, .input-group input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;}
                .badge { padding: 4px 8px; border-radius: 12px; color: white; font-size: 12px; font-weight: 500; }
                .item-list { border-bottom: 1px solid #eee; padding: 10px 0; }
                .item-list:last-child { border-bottom: none; }
                `}
            </style>
            
            <div className="page">
                <h2 style={{ marginBottom: "20px" }}>Case: {caseData.caseNumber}</h2>
                
                <div className="layout">
                    {/* LEFT MAIN TABS */}
                    <div className="main-content">
                        <div className="card">
                            <div className="tabs">
                                {["Overview", "Timeline", "Notes", "Evidence", "Sessions"].map(tab => (
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
                                        <p><strong>Description:</strong> <br/>{caseData.description}</p>
                                        <hr style={{ margin: "15px 0", border:"none", borderTop:"1px solid #eee" }}/>
                                        <p><strong>Victim:</strong> {caseData.victim?.alias || "Anonymous"}</p>
                                        <p><strong>Platform:</strong> {caseData.platform}</p>
                                        <p><strong>Date:</strong> {caseData.incidentDate} {caseData.incidentTime}</p>
                                    </div>
                                )}

                                {activeTab === "Timeline" && (
                                    <div>
                                        {caseData.timeline?.length > 0 ? caseData.timeline.map((t: any, i: number) => (
                                            <div key={i} className="item-list">
                                                <strong>{new Date(t.date).toLocaleDateString()} - {t.action}</strong>
                                                <p style={{ margin: "5px 0 0", color: "#666" }}>By {t.actor}: {t.note}</p>
                                            </div>
                                        )) : <p>No timeline events yet.</p>}
                                    </div>
                                )}

                                {activeTab === "Notes" && (
                                    <div>
                                        {caseData.notes?.length > 0 ? caseData.notes.map((n: any, i: number) => (
                                            <div key={i} className="item-list">
                                                <strong>{n.role}</strong> ({new Date(n.date).toLocaleDateString()}):
                                                <p style={{ margin: "5px 0 0" }}>{n.text}</p>
                                            </div>
                                        )) : <p>No notes yet.</p>}
                                    </div>
                                )}

                                {activeTab === "Evidence" && (
                                    <div>
                                        {caseData.evidence?.length > 0 ? caseData.evidence.map((e: any, i: number) => (
                                            <div key={i} className="item-list" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
                                                            style={{ padding: "4px 8px", fontSize: "12px", background: "#f59e0b" }}
                                                            disabled={verifying[e.fileName]}
                                                        >
                                                            {verifying[e.fileName] ? "Verifying..." : "Verify Hash"}
                                                        </button>
                                                    )}
                                                    <a href={`http://localhost:5000/uploads/${e.storedName}`} target="_blank" rel="noreferrer" className="btn" style={{textDecoration: "none"}}>View</a>
                                                </div>
                                            </div>
                                        )) : <p>No evidence uploaded.</p>}
                                    </div>
                                )}

                                {activeTab === "Sessions" && (
                                    <CounselorSessions caseId={id || ""} />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR - ACTIONS */}
                    <div className="sidebar">
                        <div className="card">
                            <h3 style={{marginTop: 0}}>Case Info</h3>
                            <p style={{ margin: "10px 0" }}>
                                Severity: <span className="badge" style={{background: caseData.severityColor || "#ef4444"}}>{caseData.severity}</span>
                            </p>
                            <p style={{ margin: "10px 0" }}>
                                Status: <strong>{caseData.status}</strong>
                            </p>
                            <p style={{ margin: "10px 0" }}>
                                Assigned To: <strong>{caseData.assignedTo?.role ? `${caseData.assignedTo.role}` : "Unassigned"}</strong>
                            </p>
                        </div>

                        <div className="card">
                            <h3 style={{marginTop: 0}}>Actions</h3>
                            
                            <div className="input-group">
                                <label>Change Status</label>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <select value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                                        <option value="New">New</option>
                                        <option value="Under Review">Under Review</option>
                                        <option value="Escalated">Escalated</option>
                                        <option value="Resolved">Resolved</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                    <button className="btn" onClick={handleUpdateStatus}>Save</button>
                                </div>
                            </div>

                            <hr style={{ margin: "15px 0", border:"none", borderTop:"1px solid #eee" }}/>

                            <div className="input-group">
                                <label>Assign Case</label>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <select value={assignRole} onChange={e => setAssignRole(e.target.value)}>
                                        <option value="counselor">To Me (Counselor)</option>
                                        <option value="lawyer">Escalate to Lawyer</option>
                                    </select>
                                    <button className="btn" onClick={handleAssignCase}>Assign</button>
                                </div>
                            </div>

                            <hr style={{ margin: "15px 0", border:"none", borderTop:"1px solid #eee" }}/>

                            <div className="input-group">
                                <label>Add Note</label>
                                <textarea rows={3} value={newNote} onChange={e => setNewNote(e.target.value)}></textarea>
                                <button className="btn" style={{marginTop:"10px", width:"100%"}} onClick={handleAddNote}>Add Note</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CounselorCaseDetails;