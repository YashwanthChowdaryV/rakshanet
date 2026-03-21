import React, { useEffect, useState } from "react";
import api from "../../services/api";

interface CounselorSessionsProps {
    caseId: string;
}

const CounselorSessions: React.FC<CounselorSessionsProps> = ({ caseId }) => {
    const [sessions, setSessions] = useState<any[]>([]);

    // Form state
    const [notes, setNotes] = useState("");
    const [mood, setMood] = useState("Stable");
    const [riskLevel, setRiskLevel] = useState("Low");
    const [recommendation, setRecommendation] = useState("");
    const [nextSessionDate, setNextSessionDate] = useState("");

    useEffect(() => {
        if (caseId) fetchSessions();
    }, [caseId]);

    const fetchSessions = async () => {
        try {
            const res = await api.get(`/counselor/session/${caseId}`);
            setSessions(res.data);
        } catch (err) {
            console.error("Failed to fetch sessions", err);
        }
    };

    const addSession = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post(`/counselor/session`, {
                caseId,
                notes,
                mood,
                riskLevel,
                recommendation,
                nextSessionDate
            });
            alert("Session added successfully");

            // Reset form
            setNotes("");
            setMood("Stable");
            setRiskLevel("Low");
            setRecommendation("");
            setNextSessionDate("");

            fetchSessions();
        } catch (err) {
            console.error("Failed to add session", err);
            alert("Failed to add session");
        }
    };

    return (
        <div className="sessions-container">
            <style>
                {`
                .sessions-container { 
                    margin-top: 20px; 
                }
                .form-card { 
                    background: #ffffff; 
                    padding: 24px; 
                    border-radius: 20px; 
                    border: 1px solid #ffe0ed; 
                    margin-bottom: 28px;
                    box-shadow: 0 4px 12px rgba(219, 39, 119, 0.08);
                    transition: all 0.3s ease;
                }
                .form-card:hover {
                    box-shadow: 0 8px 20px rgba(219, 39, 119, 0.12);
                    border-color: #fbc4d5;
                }
                .form-card h3 { 
                    margin-top: 0; 
                    margin-bottom: 20px; 
                    color: #b83280; 
                    font-size: 18px; 
                    font-weight: 700;
                }
                .form-group { 
                    margin-bottom: 18px; 
                }
                .form-group label { 
                    display: block; 
                    margin-bottom: 8px; 
                    font-weight: 600; 
                    color: #db2777;
                    font-size: 13px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .form-group input, 
                .form-group select, 
                .form-group textarea { 
                    width: 100%; 
                    padding: 12px 14px; 
                    border: 1px solid #ffe0ed; 
                    border-radius: 12px; 
                    box-sizing: border-box; 
                    font-family: inherit;
                    font-size: 14px;
                    transition: all 0.2s ease;
                    background: #ffffff;
                    color: #831843;
                }
                .form-group input:focus, 
                .form-group select:focus, 
                .form-group textarea:focus {
                    outline: none;
                    border-color: #db2777;
                    box-shadow: 0 0 0 3px rgba(219, 39, 119, 0.1);
                }
                .form-group input::placeholder,
                .form-group textarea::placeholder {
                    color: #fbc4d5;
                }
                .btn-submit { 
                    background: linear-gradient(135deg, #db2777 0%, #be185d 100%);
                    color: white; 
                    border: none; 
                    padding: 12px 28px; 
                    border-radius: 40px; 
                    cursor: pointer; 
                    font-weight: 600;
                    font-size: 14px;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(219, 39, 119, 0.3);
                }
                .btn-submit:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(219, 39, 119, 0.4);
                    background: linear-gradient(135deg, #e06a9e 0%, #c13b6e 100%);
                }
                .sessions-list h3 { 
                    color: #b83280; 
                    font-size: 18px; 
                    font-weight: 700;
                    margin-bottom: 20px;
                    margin-top: 8px;
                }
                .session-card { 
                    background: #ffffff; 
                    padding: 20px; 
                    border-radius: 16px; 
                    border: 1px solid #ffe0ed; 
                    margin-bottom: 16px;
                    transition: all 0.3s ease;
                }
                .session-card:hover {
                    transform: translateX(4px);
                    border-color: #fbc4d5;
                    box-shadow: 0 4px 12px rgba(219, 39, 119, 0.08);
                }
                .session-card h4 { 
                    margin-top: 0; 
                    margin-bottom: 12px;
                    color: #831843; 
                    font-size: 15px;
                    font-weight: 700;
                }
                .session-card p { 
                    margin: 8px 0; 
                    color: #b86f88;
                    font-size: 14px;
                    line-height: 1.5;
                }
                .session-card p strong { 
                    color: #db2777; 
                    font-weight: 600;
                }
                @media (max-width: 768px) {
                    .form-card {
                        padding: 20px;
                    }
                    .form-group input, 
                    .form-group select, 
                    .form-group textarea {
                        padding: 10px 12px;
                    }
                    .btn-submit {
                        width: 100%;
                    }
                }
                `}
            </style>

            <div className="form-card">
                <h3>Log New Session</h3>
                <form onSubmit={addSession}>
                    <div className="form-group">
                        <label>Notes</label>
                        <textarea required value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Enter session notes, observations, and key discussion points..."></textarea>
                    </div>

                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                        <div className="form-group" style={{ flex: 1, minWidth: "150px" }}>
                            <label>Mood</label>
                            <select value={mood} onChange={e => setMood(e.target.value)}>
                                <option value="Stable">Stable</option>
                                <option value="Anxious">Anxious</option>
                                <option value="Distressed">Distressed</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ flex: 1, minWidth: "150px" }}>
                            <label>Risk Level</label>
                            <select value={riskLevel} onChange={e => setRiskLevel(e.target.value)}>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Recommendation</label>
                        <input type="text" value={recommendation} onChange={e => setRecommendation(e.target.value)} placeholder="e.g., Continue therapy, Refer to specialist, Follow-up next week..." />
                    </div>

                    <div className="form-group">
                        <label>Next Session Date</label>
                        <input type="date" value={nextSessionDate} onChange={e => setNextSessionDate(e.target.value)} />
                    </div>

                    <button type="submit" className="btn-submit">Log Session</button>
                </form>
            </div>

            <div className="sessions-list">
                <h3>Past Sessions ({sessions.length})</h3>
                {sessions.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px", background: "#ffffff", borderRadius: "16px", border: "1px solid #ffe0ed", color: "#b86f88" }}>
                        💗 No past sessions recorded yet.
                    </div>
                ) : (
                    sessions.map(s => (
                        <div key={s._id} className="session-card">
                            <h4>📅 Session on {new Date(s.createdAt).toLocaleDateString()}</h4>
                            <p><strong>😊 Mood:</strong> {s.mood} | <strong>⚠️ Risk Level:</strong> {s.riskLevel}</p>
                            <p><strong>📝 Notes:</strong> {s.notes}</p>
                            {s.recommendation && <p><strong>💡 Recommendation:</strong> {s.recommendation}</p>}
                            {s.nextSessionDate && <p><strong>📆 Next Session:</strong> {new Date(s.nextSessionDate).toLocaleDateString()}</p>}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CounselorSessions;