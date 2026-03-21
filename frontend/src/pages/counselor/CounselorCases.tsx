import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

const CounselorCases = () => {
    const [cases, setCases] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [severityFilter, setSeverityFilter] = useState("");

    useEffect(() => {
        fetchCases();
    }, []);

    const fetchCases = async () => {
        try {
            const res = await api.get("/cases");
            // API returns all cases for counselor.
            setCases(res.data);
        } catch (err) {
            console.error("Failed to fetch cases", err);
        }
    };

    const getColor = (s: string) => {
        if (s === "Critical") return "#db2777";
        if (s === "High") return "#ec489a";
        if (s === "Medium") return "#f9a8d4";
        return "#fbc4d5";
    };

    const filteredCases = cases.filter(c => {
        const matchesSearch = c.caseNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || c.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter ? c.status === statusFilter : true;
        const matchesSeverity = severityFilter ? c.severity === severityFilter : true;
        return matchesSearch && matchesStatus && matchesSeverity;
    });

    return (
        <>
            <style>
                {`
                .page {
                    padding: 100px 40px;
                    background: linear-gradient(135deg, #fff0f5 0%, #ffe4f0 100%);
                    min-height: 100vh;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
                }
                .page h2 {
                    font-size: 28px;
                    font-weight: 700;
                    background: linear-gradient(135deg, #db2777 0%, #be185d 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 24px;
                }
                .filters {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 28px;
                    flex-wrap: wrap;
                }
                .filters input, .filters select {
                    padding: 10px 16px;
                    border: 1px solid #ffe0ed;
                    border-radius: 40px;
                    font-size: 14px;
                    transition: all 0.2s ease;
                    background: white;
                    color: #831843;
                }
                .filters input:focus, .filters select:focus {
                    outline: none;
                    border-color: #db2777;
                    box-shadow: 0 0 0 3px rgba(219, 39, 119, 0.1);
                }
                .filters input::placeholder {
                    color: #fbc4d5;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    background: white;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(219, 39, 119, 0.08);
                    border: 1px solid #ffe0ed;
                }
                th, td {
                    padding: 16px 20px;
                    border-bottom: 1px solid #ffe0ed;
                    text-align: left;
                }
                th {
                    background: #fff5f9;
                    color: #b83280;
                    font-weight: 600;
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                td {
                    color: #5e2a45;
                    font-size: 0.9rem;
                }
                tr {
                    transition: background 0.2s ease;
                }
                tr:hover {
                    background: #fff5f9;
                }
                tr:last-child td {
                    border-bottom: none;
                }
                .badge {
                    padding: 6px 14px;
                    border-radius: 40px;
                    color: white;
                    font-size: 12px;
                    font-weight: 600;
                    display: inline-block;
                    letter-spacing: 0.3px;
                }
                .action-btn {
                    padding: 8px 20px;
                    background: linear-gradient(135deg, #db2777 0%, #be185d 100%);
                    color: white;
                    border: none;
                    border-radius: 40px;
                    cursor: pointer;
                    text-decoration: none;
                    font-size: 13px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    display: inline-block;
                    box-shadow: 0 2px 6px rgba(219, 39, 119, 0.2);
                }
                .action-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(219, 39, 119, 0.3);
                    background: linear-gradient(135deg, #e06a9e 0%, #c13b6e 100%);
                }
                .empty-state {
                    text-align: center;
                    padding: 60px 20px;
                    color: #b86f88;
                    font-size: 14px;
                }
                @media (max-width: 768px) {
                    .page {
                        padding: 80px 20px;
                    }
                    .filters {
                        flex-direction: column;
                    }
                    .filters input, .filters select {
                        width: 100%;
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
                        border-bottom: 1px solid #ffe0ed;
                    }
                    td::before {
                        content: attr(data-label);
                        font-weight: 600;
                        color: #b83280;
                        font-size: 0.75rem;
                        text-transform: uppercase;
                    }
                    tr {
                        margin-bottom: 12px;
                        border: 1px solid #ffe0ed;
                        border-radius: 16px;
                        background: white;
                        overflow: hidden;
                    }
                    .badge {
                        padding: 4px 12px;
                    }
                }
                `}
            </style>
            <div className="page">
                <h2>All Cases</h2>

                <div className="filters">
                    <input
                        type="text"
                        placeholder="Search cases..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="">All Statuses</option>
                        <option value="New">New</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Escalated">Escalated</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                    </select>
                    <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)}>
                        <option value="">All Severities</option>
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>

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
                        {filteredCases.map(c => (
                            <tr key={c._id}>
                                <td data-label="Case #">{c.caseNumber}</td>
                                <td data-label="Severity">
                                    <span className="badge" style={{ background: getColor(c.severity) }}>
                                        {c.severity}
                                    </span>
                                </td>
                                <td data-label="Status">{c.status}</td>
                                <td data-label="Date">{new Date(c.createdAt).toLocaleDateString()}</td>
                                <td data-label="Action">
                                    <Link to={"/counselor/case/" + c._id} className="action-btn">
                                        View Details
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {filteredCases.length === 0 && (
                            <tr>
                                <td colSpan={5} className="empty-state">💗 No cases found. Try adjusting your filters.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default CounselorCases;