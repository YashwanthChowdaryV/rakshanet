import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

const LawyerCases = () => {
    const [cases, setCases] = useState<any[]>([]);
    const [filterType, setFilterType] = useState<"escalated" | "assigned">("assigned");
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const myUserId = currentUser?.id || currentUser?._id || "";

    useEffect(() => {
        fetchCases();
    }, []);

    const fetchCases = async () => {
        try {
            const res = await api.get("/cases");
            setCases(res.data);
        } catch (err) {
            console.error("Failed to fetch cases", err);
        }
    };

    const getSeverityStyle = (s: string) => {
        const styles = {
            Critical: { background: "#1a1a1a", color: "#ffffff", borderLeft: "3px solid #ffffff", icon: "●" },
            High: { background: "#1a1a1a", color: "#e0e0e0", borderLeft: "3px solid #e0e0e0", icon: "●" },
            Medium: { background: "#1a1a1a", color: "#c0c0c0", borderLeft: "3px solid #c0c0c0", icon: "●" },
            Low: { background: "#1a1a1a", color: "#a0a0a0", borderLeft: "3px solid #a0a0a0", icon: "●" }
        };
        return styles[s as keyof typeof styles] || styles.Medium;
    };

    const getStatusStyle = (status: string) => {
        const styles: { [key: string]: { bg: string; color: string } } = {
            "New": { bg: "#2a2a2a", color: "#ffffff" },
            "Under Review": { bg: "#2a2a2a", color: "#e0e0e0" },
            "Escalated": { bg: "#2a2a2a", color: "#ffffff" },
            "Resolved": { bg: "#2a2a2a", color: "#d0d0d0" },
            "Closed": { bg: "#2a2a2a", color: "#b0b0b0" }
        };
        return styles[status] || styles.New;
    };

    const displayCases = cases.filter(c => {
        if (filterType === "escalated") {
            // Show any case that is escalated, in lawyer review, OR assigned to this lawyer
            const assignedUserId = c.assignedTo?.user?._id || c.assignedTo?.user || "";
            return c.status === "Escalated" || c.status === "Lawyer Review" || String(assignedUserId) === String(myUserId);
        } else {
            // My Assigned Cases — match on this specific lawyer's user ID
            const assignedUserId = c.assignedTo?.user?._id || c.assignedTo?.user || "";
            return String(assignedUserId) === String(myUserId);
        }
    });

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
                    font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
                }

                .page-container {
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .page-header {
                    margin-bottom: 32px;
                }

                .page-header h2 {
                    font-size: 1.75rem;
                    font-weight: 600;
                    color: #ffffff;
                    margin: 0;
                    letter-spacing: -0.3px;
                }

                .page-header p {
                    color: #888888;
                    margin-top: 8px;
                    font-size: 0.9rem;
                }

                .stats-grid {
                    display: flex;
                    gap: 20px;
                    margin-bottom: 32px;
                }

                .stat-card {
                    background: #1a1a1a;
                    border-radius: 12px;
                    padding: 20px 24px;
                    flex: 1;
                    border: 1px solid #2a2a2a;
                    transition: all 0.2s ease;
                }

                .stat-card:hover {
                    border-color: #3a3a3a;
                    background: #222222;
                }

                .stat-label {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.6px;
                    color: #888888;
                    font-weight: 600;
                    margin-bottom: 8px;
                }

                .stat-value {
                    font-size: 1.75rem;
                    font-weight: 600;
                    color: #ffffff;
                }

                .tabs {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 28px;
                    border-bottom: 1px solid #2a2a2a;
                }

                .tab-btn {
                    padding: 10px 20px;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    font-weight: 500;
                    font-size: 0.875rem;
                    transition: all 0.2s ease;
                    color: #888888;
                    border-bottom: 2px solid transparent;
                    margin-bottom: -1px;
                }

                .tab-btn.active {
                    color: #ffffff;
                    border-bottom-color: #ffffff;
                }

                .tab-btn:hover:not(.active) {
                    color: #cccccc;
                }

                .cases-table-container {
                    background: #1a1a1a;
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid #2a2a2a;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                th {
                    padding: 16px 20px;
                    text-align: left;
                    background: #0f0f0f;
                    font-weight: 500;
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: #aaaaaa;
                    border-bottom: 1px solid #2a2a2a;
                }

                td {
                    padding: 16px 20px;
                    border-bottom: 1px solid #2a2a2a;
                    color: #e0e0e0;
                    font-size: 0.875rem;
                    background: #1a1a1a;
                }

                tr {
                    transition: background 0.2s ease;
                }

                tr:hover td {
                    background: #222222;
                }

                tr:last-child td {
                    border-bottom: none;
                }

                .case-number {
                    font-weight: 500;
                    color: #ffffff;
                    font-family: 'SF Mono', 'Menlo', monospace;
                    font-size: 0.8rem;
                }

                .severity-badge {
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 0.7rem;
                    font-weight: 500;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    letter-spacing: 0.2px;
                }

                .status-badge {
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 0.7rem;
                    font-weight: 500;
                    display: inline-block;
                }

                .action-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 14px;
                    background: #2a2a2a;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: 500;
                    font-size: 0.8rem;
                    transition: all 0.2s ease;
                    border: 1px solid #3a3a3a;
                }

                .action-link:hover {
                    background: #333333;
                    border-color: #555555;
                    transform: translateX(2px);
                }

                .empty-state {
                    text-align: center;
                    padding: 60px 20px !important;
                    color: #666666;
                }

                .empty-state-icon {
                    font-size: 48px;
                    margin-bottom: 16px;
                    opacity: 0.5;
                    color: #888888;
                }

                .empty-state-text {
                    font-size: 0.875rem;
                    margin-bottom: 6px;
                    color: #888888;
                }

                .empty-state-subtext {
                    font-size: 0.8rem;
                    color: #666666;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .cases-table-container {
                    animation: fadeIn 0.3s ease;
                }

                @media (max-width: 768px) {
                    .page {
                        padding: 80px 20px;
                    }
                    
                    .stats-grid {
                        flex-direction: column;
                        gap: 12px;
                    }
                    
                    table, thead, tbody, th, td, tr {
                        display: block;
                    }
                    
                    th {
                        display: none;
                    }
                    
                    td {
                        padding: 12px 16px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 1px solid #2a2a2a;
                        background: #1a1a1a;
                    }
                    
                    td::before {
                        content: attr(data-label);
                        font-weight: 500;
                        color: #888888;
                        font-size: 0.75rem;
                    }
                    
                    tr {
                        margin-bottom: 12px;
                        border: 1px solid #2a2a2a;
                        border-radius: 8px;
                        background: #1a1a1a;
                    }
                    
                    .action-link {
                        justify-content: center;
                    }
                }
                `}
            </style>

            <div className="page">
                <div className="page-container">
                    <div className="page-header">
                        <h2>Case Management</h2>
                        <p>Review and manage legal cases</p>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-label">Total Cases</div>
                            <div className="stat-value">{cases.length}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Escalated</div>
                            <div className="stat-value">
                                {cases.filter(c => c.status === "Escalated").length}
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Assigned to Me</div>
                            <div className="stat-value">
                                {cases.filter(c => {
                                    const assignedUserId = c.assignedTo?.user?._id || c.assignedTo?.user || "";
                                    return String(assignedUserId) === String(myUserId);
                                }).length}
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Resolved</div>
                            <div className="stat-value">
                                {cases.filter(c => c.status === "Resolved" || c.status === "Closed").length}
                            </div>
                        </div>
                    </div>

                    <div className="tabs">
                        <button
                            className={"tab-btn " + (filterType === "escalated" ? "active" : "")}
                            onClick={() => setFilterType("escalated")}
                        >
                            Needs Attention
                        </button>
                        <button
                            className={"tab-btn " + (filterType === "assigned" ? "active" : "")}
                            onClick={() => setFilterType("assigned")}
                        >
                            My Assigned Cases
                        </button>
                    </div>

                    <div className="cases-table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Case #</th>
                                    <th>Severity</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayCases.map(c => {
                                    const severityStyle = getSeverityStyle(c.severity);
                                    const statusStyle = getStatusStyle(c.status);
                                    return (
                                        <tr key={c._id}>
                                            <td data-label="Case #">
                                                <span className="case-number">{c.caseNumber}</span>
                                            </td>
                                            <td data-label="Severity">
                                                <span className="severity-badge" style={{
                                                    background: severityStyle.background,
                                                    color: severityStyle.color,
                                                    borderLeft: severityStyle.borderLeft,
                                                    borderRadius: "4px 6px 6px 4px"
                                                }}>
                                                    {severityStyle.icon} {c.severity}
                                                </span>
                                            </td>
                                            <td data-label="Status">
                                                <span className="status-badge" style={{
                                                    background: statusStyle.bg,
                                                    color: statusStyle.color
                                                }}>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td data-label="Date">
                                                {new Date(c.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td data-label="Action">
                                                <Link to={"/lawyer/case/" + c._id} className="action-link">
                                                    Review <span style={{ fontSize: "14px" }}>→</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {displayCases.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="empty-state">
                                            <div className="empty-state-icon">📋</div>
                                            <div className="empty-state-text">No cases in this category</div>
                                            <div className="empty-state-subtext">Switch tabs to view other cases</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LawyerCases;