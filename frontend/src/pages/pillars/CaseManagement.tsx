import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

const CaseManagement = () => {
    const [cases, setCases] = useState<any[]>([]);
    const [selectedCase, setSelectedCase] = useState<any>(null);
    const [filteredCases, setFilteredCases] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [severityFilter, setSeverityFilter] = useState("All");
    const [platformFilter, setPlatformFilter] = useState("All");
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState({
        total: 0,
        new: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        resolved: 0,
        inProgress: 0,
        womenCases: 0,
        convictionRate: 92,
        avgResolutionDays: 14,
    });

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isAdmin = user.role === "admin";
    const [activeTab, setActiveTab] = useState<"overview"|"timeline"|"notes"|"legal">("overview");
    const [newNote, setNewNote] = useState("");

    const fetchCases = async () => {
        try {
            setLoading(true);
            const res = await api.get("/cases");
            const fetchedCases = res.data.cases || [];
            
            const mappedCases = fetchedCases.map((c: any) => ({
                ...c,
                id: c._id,
                victimName: c.victim?.alias || c.victim?.user?.name || `Student`,
                isAnonymous: c.victim?.anonymous,
                anonymousAlias: c.victim?.alias,
                assignedTo: c.assignedTo ? { name: c.assignedTo.name, _id: c.assignedTo._id } : null,
                isWomen: false,
                daysToResolve: c.status === "Resolved" ? Math.floor((new Date(c.updatedAt).getTime() - new Date(c.createdAt).getTime()) / (1000 * 3600 * 24)) : undefined,
            }));
            
            setCases(mappedCases);
            setFilteredCases(mappedCases);
            setError(null);
        } catch (err: any) {
            console.error("Error fetching cases:", err);
            setError("Failed to load cases. " + (err.response?.data?.message || ""));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCases();
    }, []);

    const handleStatusChange = async (caseId: string, newStatus: string) => {
        try {
            await api.put(`/cases/${caseId}/status`, { status: newStatus });
            fetchCases();
            if (selectedCase && selectedCase._id === caseId) {
                setSelectedCase({ ...selectedCase, status: newStatus });
            }
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const handleAddNote = async (caseId: string) => {
        if (!newNote.trim()) return;
        try {
            await api.post(`/cases/${caseId}/note`, { text: newNote });
            setNewNote("");
            fetchCases();
            if (selectedCase && selectedCase._id === caseId) {
                const updatedNotes = [...(selectedCase.notes || []), { text: newNote, role: user.role, createdAt: new Date().toISOString() }];
                setSelectedCase({ ...selectedCase, notes: updatedNotes });
            }
        } catch (err) {
            alert("Failed to add note");
        }
    };

    useEffect(() => {
        if (cases.length > 0) {
            try {
                // Apply filters
                let filtered = [...cases];

                if (searchTerm) {
                    filtered = filtered.filter(c =>
                        c.caseNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (c.victimName || "").toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }

                if (statusFilter !== "All") {
                    filtered = filtered.filter(c => c.status === statusFilter);
                }

                if (severityFilter !== "All") {
                    filtered = filtered.filter(c => c.severity === severityFilter);
                }

                if (platformFilter !== "All") {
                    filtered = filtered.filter(c => c.platform === platformFilter);
                }

                setFilteredCases(filtered);

                // Calculate stats from fake data
                const resolved = cases.filter(c => c.status === "Resolved" || c.status === "Closed").length;
                const womenCases = cases.filter(c => c.isWomen === true).length;

                // Calculate average resolution days from resolved cases
                const resolvedCases = cases.filter(c => c.status === "Resolved" && c.daysToResolve);
                const avgDays = resolvedCases.length > 0
                    ? Math.round(resolvedCases.reduce((sum, c) => sum + (c.daysToResolve || 0), 0) / resolvedCases.length)
                    : 14;

                setStats({
                    total: cases.length,
                    new: cases.filter(c => c.status === "New").length,
                    critical: cases.filter(c => c.severity === "Critical").length,
                    high: cases.filter(c => c.severity === "High").length,
                    medium: cases.filter(c => c.severity === "Medium").length,
                    low: cases.filter(c => c.severity === "Low").length,
                    resolved: resolved,
                    inProgress: cases.filter(c => c.status === "Under Review" || c.status === "Escalated").length,
                    womenCases: womenCases,
                    convictionRate: 92,
                    avgResolutionDays: avgDays,
                });
            } catch (err) {
                console.error("Error filtering cases:", err);
            }
        }
    }, [cases, searchTerm, statusFilter, severityFilter, platformFilter]);

    // Removed mock logic

    const getSeverityBadge = (severity: string) => {
        const badges: any = {
            Critical: { color: "#dc2626", bg: "#fee2e2", icon: "🔴" },
            High: { color: "#ea580c", bg: "#ffedd5", icon: "🟠" },
            Medium: { color: "#ca8a04", bg: "#fef9c3", icon: "🟡" },
            Low: { color: "#16a34a", bg: "#dcfce7", icon: "🟢" },
        };
        const badge = badges[severity] || { color: "#6b7280", bg: "#f3f4f6", icon: "⚪" };
        return badge;
    };

    const getStatusBadge = (status: string) => {
        const badges: any = {
            New: { color: "#2563eb", bg: "#dbeafe" },
            "Under Review": { color: "#ca8a04", bg: "#fef9c3" },
            Escalated: { color: "#ea580c", bg: "#ffedd5" },
            Resolved: { color: "#16a34a", bg: "#dcfce7" },
            Closed: { color: "#6b7280", bg: "#f3f4f6" },
        };
        return badges[status] || { color: "#6b7280", bg: "#f3f4f6" };
    };

    const getPlatformIcon = (platform: string) => {
        const icons: any = {
            LinkedIn: "💼",
            Instagram: "📱",
            Snapchat: "👻",
            Telegram: "✈️",
            WhatsApp: "💬",
            Email: "📧",
            Facebook: "📘",
            Twitter: "🐦",
        };
        return icons[platform] || "🌐";
    };

    // Error state
    if (error) {
        return (
            <>
                <Navbar />
                <div style={{ paddingTop: "120px", textAlign: "center" }}>
                    <h2 style={{ color: "#dc2626" }}>⚠️ Error</h2>
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: "10px 20px",
                            background: "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            marginTop: "20px",
                            cursor: "pointer"
                        }}
                    >
                        Refresh Page
                    </button>
                </div>
            </>
        );
    }

    // Loading state
    if (loading) {
        return (
            <>
                <Navbar />
                <div style={{ paddingTop: "120px", textAlign: "center" }}>
                    <h2>Loading cases...</h2>
                </div>
            </>
        );
    }

    // Empty state
    if (cases.length === 0) {
        return (
            <>
                <Navbar />
                <div style={{ paddingTop: "120px", textAlign: "center" }}>
                    <h2>📭 No cases found</h2>
                    <p>There are no cases to display at this time.</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <style>
                {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: #f3f4f6;
          }

          .cases-wrapper {
            padding-top: 100px;
            padding-left: 40px;
            padding-right: 40px;
            padding-bottom: 80px;
            min-height: 100vh;
            background-color: #f3f4f6;
          }

          .cases-container {
            max-width: 1400px;
            margin: 0 auto;
          }

          /* Header */
          .header-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            flex-wrap: wrap;
            gap: 16px;
          }

          .main-title {
            font-size: 28px;
            font-weight: 700;
            color: #111827;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .view-toggle {
            display: flex;
            gap: 8px;
            background: white;
            padding: 4px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
          }

          .view-btn {
            padding: 8px 16px;
            border: none;
            background: transparent;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s ease;
          }

          .view-btn.active {
            background: #2563eb;
            color: white;
          }

          /* Motivational Banner */
          .motivation-banner {
            background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
            color: white;
            padding: 24px 32px;
            border-radius: 16px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
            box-shadow: 0 10px 25px -5px rgba(236, 72, 153, 0.3);
          }

          .motivation-text h2 {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 8px;
          }

          .motivation-text p {
            font-size: 16px;
            opacity: 0.95;
            line-height: 1.5;
          }

          .motivation-stats {
            display: flex;
            gap: 30px;
          }

          .motivation-stat {
            text-align: center;
          }

          .motivation-stat .number {
            font-size: 32px;
            font-weight: 700;
            display: block;
          }

          .motivation-stat .label {
            font-size: 14px;
            opacity: 0.9;
          }

          /* Stats Cards */
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 16px;
            margin-bottom: 30px;
          }

          .stat-card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            transition: all 0.2s ease;
          }

          .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }

          .stat-label {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .stat-value {
            font-size: 28px;
            font-weight: 700;
            color: #111827;
          }

          .stat-trend {
            font-size: 12px;
            color: #10b981;
            margin-top: 4px;
          }

          .stat-card.pink {
            background: #fdf2f8;
            border-color: #fbcfe8;
          }

          .stat-card.pink .stat-label {
            color: #be185d;
          }

          /* Filters */
          .filters-section {
            background: white;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            margin-bottom: 30px;
          }

          .search-box {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            font-size: 15px;
            margin-bottom: 16px;
            background: #f9fafb;
          }

          .search-box:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }

          .filter-row {
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
          }

          .filter-select {
            padding: 10px 16px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            font-size: 14px;
            background: white;
            min-width: 150px;
            cursor: pointer;
          }

          .filter-select:focus {
            outline: none;
            border-color: #2563eb;
          }

          .active-filters {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-top: 16px;
          }

          .filter-tag {
            background: #f3f4f6;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .filter-tag button {
            border: none;
            background: transparent;
            cursor: pointer;
            color: #6b7280;
            font-size: 16px;
          }

          .filter-tag.pink {
            background: #fce7f3;
            color: #be185d;
          }

          /* Table View */
          .table-container {
            background: white;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            overflow-x: auto;
            margin-bottom: 30px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th {
            text-align: left;
            padding: 16px;
            background: #f9fafb;
            font-weight: 600;
            font-size: 14px;
            color: #4b5563;
            border-bottom: 1px solid #e5e7eb;
          }

          td {
            padding: 16px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
          }

          tr:hover {
            background: #f9fafb;
            cursor: pointer;
          }

          .severity-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
          }

          .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
          }

          .platform-icon {
            font-size: 18px;
          }

          .women-tag {
            background: #fce7f3;
            color: #be185d;
            padding: 2px 6px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            margin-left: 6px;
          }

          /* Grid View */
          .grid-view {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }

          .case-card {
            background: white;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            padding: 20px;
            transition: all 0.2s ease;
            cursor: pointer;
            position: relative;
          }

          .case-card:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transform: translateY(-2px);
          }

          .case-card.women {
            border-left: 4px solid #ec4899;
          }

          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
          }

          .case-number {
            font-weight: 600;
            color: #2563eb;
            font-size: 16px;
          }

          .card-body {
            margin-bottom: 16px;
          }

          .card-meta {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            margin: 12px 0;
            font-size: 13px;
            color: #6b7280;
          }

          .card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 12px;
            border-top: 1px solid #e5e7eb;
          }

          .assigned-to {
            font-size: 13px;
            color: #6b7280;
          }

          .resolution-badge {
            background: #dcfce7;
            color: #166534;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
          }

          /* Detail Panel */
          .detail-panel {
            background: white;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            padding: 24px;
            margin-top: 30px;
            animation: slideUp 0.3s ease;
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .detail-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            flex-wrap: wrap;
            gap: 16px;
          }

          .detail-title {
            font-size: 20px;
            font-weight: 600;
            color: #111827;
          }

          .close-btn {
            background: #f3f4f6;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
          }

          .detail-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 20px;
          }

          .detail-item {
            margin-bottom: 16px;
          }

          .detail-label {
            font-size: 13px;
            color: #6b7280;
            margin-bottom: 4px;
          }

          .detail-value {
            font-size: 15px;
            color: #111827;
            font-weight: 500;
          }

          .notes-section {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
          }

          .note-item {
            background: #f9fafb;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 8px;
          }

          .note-item strong {
            color: #2563eb;
          }

          .success-story {
            background: #ecfdf5;
            border-left: 4px solid #10b981;
            padding: 16px;
            border-radius: 8px;
            margin-top: 16px;
          }

          /* Empty State */
          .empty-state {
            text-align: center;
            padding: 60px;
            background: white;
            border-radius: 12px;
            color: #9ca3af;
          }

          /* Responsive */
          @media (max-width: 768px) {
            .cases-wrapper {
              padding: 80px 16px 40px;
            }

            .header-section {
              flex-direction: column;
              align-items: flex-start;
            }

            .motivation-banner {
              flex-direction: column;
              text-align: center;
            }

            .motivation-stats {
              justify-content: center;
            }

            .filter-row {
              flex-direction: column;
            }

            .filter-select {
              width: 100%;
            }

            .detail-grid {
              grid-template-columns: 1fr;
            }
          }
        `}
            </style>

            <div className="cases-wrapper">
                <div className="cases-container">
                    {/* Header */}
                    <div className="header-section">
                        <h1 className="main-title">📋 Case Management Dashboard</h1>
                        <div className="view-toggle">
                            <button
                                className={`view-btn ${viewMode === "table" ? "active" : ""}`}
                                onClick={() => setViewMode("table")}
                            >
                                Table View
                            </button>
                            <button
                                className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                                onClick={() => setViewMode("grid")}
                            >
                                Card View
                            </button>
                        </div>
                    </div>

                    {/* Motivational Banner - Shows fake data */}
                    <div className="motivation-banner">
                        <div className="motivation-text">
                            <h2>👩 You're Not Alone</h2>
                            <p>
                                {stats.womenCases} women have filed cases through RakshaNet.<br />
                                <strong>{stats.convictionRate}%</strong> of cases resulted in positive action.
                                Your voice matters. Your case will be handled with confidentiality and care.
                            </p>
                        </div>
                        <div className="motivation-stats">
                            <div className="motivation-stat">
                                <span className="number">{stats.womenCases}</span>
                                <span className="label">Women Supported</span>
                            </div>
                            <div className="motivation-stat">
                                <span className="number">{stats.convictionRate}%</span>
                                <span className="label">Success Rate</span>
                            </div>
                            <div className="motivation-stat">
                                <span className="number">{stats.avgResolutionDays}⏱️</span>
                                <span className="label">Avg Resolution Days</span>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards - Shows fake data */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-label">📊 Total Cases</div>
                            <div className="stat-value">{stats.total}</div>
                            <div className="stat-trend">All time</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">🆕 New Cases</div>
                            <div className="stat-value">{stats.new}</div>
                            <div className="stat-trend">{stats.new > 0 ? `${stats.new} awaiting review` : "No new cases"}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">🔴 Critical</div>
                            <div className="stat-value" style={{ color: "#dc2626" }}>{stats.critical}</div>
                            <div className="stat-trend">Immediate action required</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">✅ Resolved</div>
                            <div className="stat-value">{stats.resolved}</div>
                            <div className="stat-trend">{((stats.resolved / stats.total) * 100 || 0).toFixed(1)}% closure rate</div>
                        </div>
                        <div className="stat-card pink">
                            <div className="stat-label">👩 Women's Cases</div>
                            <div className="stat-value">{stats.womenCases}</div>
                            <div className="stat-trend">{((stats.womenCases / stats.total) * 100 || 0).toFixed(1)}% of total</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">⚖️ Conviction Rate</div>
                            <div className="stat-value">{stats.convictionRate}%</div>
                            <div className="stat-trend">Above national average</div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="filters-section">
                        <input
                            type="text"
                            placeholder="🔍 Search by case number, description, or victim name..."
                            className="search-box"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <div className="filter-row">
                            <select
                                className="filter-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All">All Status</option>
                                <option value="New">New</option>
                                <option value="Under Review">Under Review</option>
                                <option value="Escalated">Escalated</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Closed">Closed</option>
                            </select>

                            <select
                                className="filter-select"
                                value={severityFilter}
                                onChange={(e) => setSeverityFilter(e.target.value)}
                            >
                                <option value="All">All Severity</option>
                                <option value="Critical">Critical</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>

                            <select
                                className="filter-select"
                                value={platformFilter}
                                onChange={(e) => setPlatformFilter(e.target.value)}
                            >
                                <option value="All">All Platforms</option>
                                <option value="LinkedIn">LinkedIn</option>
                                <option value="Instagram">Instagram</option>
                                <option value="Snapchat">Snapchat</option>
                                <option value="Telegram">Telegram</option>
                                <option value="WhatsApp">WhatsApp</option>
                                <option value="Email">Email</option>
                                <option value="Facebook">Facebook</option>
                                <option value="Twitter">Twitter</option>
                            </select>
                        </div>

                        {(searchTerm || statusFilter !== "All" || severityFilter !== "All" || platformFilter !== "All") && (
                            <div className="active-filters">
                                {searchTerm && (
                                    <span className="filter-tag">
                                        Search: {searchTerm}
                                        <button onClick={() => setSearchTerm("")}>×</button>
                                    </span>
                                )}
                                {statusFilter !== "All" && (
                                    <span className="filter-tag">
                                        Status: {statusFilter}
                                        <button onClick={() => setStatusFilter("All")}>×</button>
                                    </span>
                                )}
                                {severityFilter !== "All" && (
                                    <span className="filter-tag">
                                        Severity: {severityFilter}
                                        <button onClick={() => setSeverityFilter("All")}>×</button>
                                    </span>
                                )}
                                {platformFilter !== "All" && (
                                    <span className="filter-tag">
                                        Platform: {platformFilter}
                                        <button onClick={() => setPlatformFilter("All")}>×</button>
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Cases Display - Shows 65 fake cases */}
                    {filteredCases.length === 0 ? (
                        <div className="empty-state">
                            <p>📭 No cases found matching your filters</p>
                            <p style={{ fontSize: "14px", marginTop: "8px" }}>Try adjusting your search criteria</p>
                        </div>
                    ) : viewMode === "table" ? (
                        /* Table View */
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Case #</th>
                                        <th>Date</th>
                                        <th>Victim</th>
                                        <th>Severity</th>
                                        <th>Status</th>
                                        <th>Platform</th>
                                        <th>Assigned To</th>
                                        <th>Resolution</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCases.map((c) => {
                                        const severity = getSeverityBadge(c.severity);
                                        const status = getStatusBadge(c.status);
                                        return (
                                            <tr key={c._id} onClick={() => setSelectedCase(c)}>
                                                <td><strong>{c.caseNumber}</strong>{c.isWomen && <span className="women-tag">👩</span>}</td>
                                                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    {c.isAnonymous ? `Anonymous (${c.anonymousAlias})` : c.victimName || `Student #${c.reporterId?.slice(-4)}`}
                                                </td>
                                                <td>
                                                    <span className="severity-badge" style={{ background: severity.bg, color: severity.color }}>
                                                        {severity.icon} {c.severity}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="status-badge" style={{ background: status.bg, color: status.color }}>
                                                        {c.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="platform-icon" title={c.platform}>
                                                        {getPlatformIcon(c.platform)} {c.platform}
                                                    </span>
                                                </td>
                                                <td>{c.assignedTo?.name || "Unassigned"}</td>
                                                <td>
                                                    {c.resolution ? (
                                                        <span className="resolution-badge">✅ Resolved</span>
                                                    ) : (
                                                        <span style={{ color: "#9ca3af" }}>In Progress</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        /* Grid View */
                        <div className="grid-view">
                            {filteredCases.map((c) => {
                                const severity = getSeverityBadge(c.severity);
                                const status = getStatusBadge(c.status);
                                return (
                                    <div key={c._id} className={`case-card ${c.isWomen ? 'women' : ''}`} onClick={() => setSelectedCase(c)}>
                                        <div className="card-header">
                                            <span className="case-number">{c.caseNumber}</span>
                                            <span className="platform-icon" title={c.platform}>
                                                {getPlatformIcon(c.platform)}
                                            </span>
                                        </div>
                                        <div className="card-body">
                                            <div style={{ display: "flex", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                                                <span className="severity-badge" style={{ background: severity.bg, color: severity.color }}>
                                                    {severity.icon} {c.severity}
                                                </span>
                                                <span className="status-badge" style={{ background: status.bg, color: status.color }}>
                                                    {c.status}
                                                </span>
                                                {c.isWomen && <span className="women-tag">👩 Women's Case</span>}
                                            </div>
                                            <div className="card-meta">
                                                <span>📅 {new Date(c.createdAt).toLocaleDateString()}</span>
                                                <span>👤 {c.isAnonymous ? `Anonymous (${c.anonymousAlias})` : c.victimName || `Student`}</span>
                                            </div>
                                            <p style={{ fontSize: "13px", color: "#4b5563", marginTop: "8px" }}>
                                                {c.description?.substring(0, 100)}...
                                            </p>
                                            {c.resolution && (
                                                <div style={{ marginTop: "8px", fontSize: "12px", color: "#16a34a" }}>
                                                    ✅ {c.resolution}
                                                </div>
                                            )}
                                        </div>
                                        <div className="card-footer">
                                            <span className="assigned-to">
                                                {c.assignedTo?.name ? `👤 ${c.assignedTo.name}` : "⏳ Unassigned"}
                                            </span>
                                            <span style={{ fontSize: "12px", color: "#2563eb" }}>View Details →</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Case Detail Panel */}
                    {selectedCase && (
                        <div className="detail-panel">
                            <div className="detail-header">
                                <h2 className="detail-title">🆔 {selectedCase.caseNumber} {selectedCase.isWomen && <span className="women-tag">👩 Women's Case</span>}</h2>
                                <button className="close-btn" onClick={() => setSelectedCase(null)}>Close</button>
                            </div>

                            {/* TABS Navigation */}
                            <div style={{ display: "flex", gap: "10px", borderBottom: "1px solid #e5e7eb", margin: "20px 0" }}>
                                {["overview", "timeline", "notes", "legal"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        style={{
                                            padding: "10px 20px",
                                            background: "none",
                                            border: "none",
                                            borderBottom: activeTab === tab ? "2px solid #2563eb" : "2px solid transparent",
                                            color: activeTab === tab ? "#2563eb" : "#6b7280",
                                            fontWeight: activeTab === tab ? 600 : 400,
                                            cursor: "pointer",
                                            textTransform: "capitalize"
                                        }}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* TAB Content */}
                            {activeTab === "overview" && (
                                <>
                                    <div className="detail-grid">
                                        <div>
                                            <div className="detail-item">
                                                <div className="detail-label">Status</div>
                                                <div className="detail-value">
                                                    <span className="status-badge" style={{ background: getStatusBadge(selectedCase.status).bg, color: getStatusBadge(selectedCase.status).color }}>
                                                        {selectedCase.status}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="detail-label">Severity</div>
                                                <div className="detail-value">
                                                    <span className="severity-badge" style={{ background: getSeverityBadge(selectedCase.severity).bg, color: getSeverityBadge(selectedCase.severity).color }}>
                                                        {getSeverityBadge(selectedCase.severity).icon} {selectedCase.severity}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="detail-label">Platform</div>
                                                <div className="detail-value">{getPlatformIcon(selectedCase.platform)} {selectedCase.platform}</div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="detail-label">Filed On</div>
                                                <div className="detail-value">{new Date(selectedCase.createdAt).toLocaleString()}</div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="detail-item">
                                                <div className="detail-label">Victim</div>
                                                <div className="detail-value">
                                                    {selectedCase.isAnonymous
                                                        ? `Anonymous (${selectedCase.anonymousAlias})`
                                                        : selectedCase.victimName || `Student ID: ${selectedCase.reporterId}`}
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="detail-label">Assigned To</div>
                                                <div className="detail-value">{selectedCase.assignedTo?.name || "Unassigned"}</div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="detail-label">Offender</div>
                                                <div className="detail-value">
                                                    {selectedCase.offenderDetails?.username || selectedCase.offenderDetails?.name || selectedCase.offenderDetails?.phone || "Unknown"}
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <div className="detail-label">Last Updated</div>
                                                <div className="detail-value">{new Date(selectedCase.updatedAt).toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="detail-item">
                                        <div className="detail-label">Description</div>
                                        <div className="detail-value" style={{ background: "#f9fafb", padding: "12px", borderRadius: "8px" }}>
                                            {selectedCase.description}
                                        </div>
                                    </div>

                                    {selectedCase.aiAnalysis && (
                                        <div className="detail-item">
                                            <div className="detail-label">AI Analysis</div>
                                            <div style={{ background: "#f9fafb", padding: "12px", borderRadius: "8px" }}>
                                                <p><strong>Categories:</strong> {selectedCase.aiAnalysis.categories?.join(", ") || (selectedCase.aiAnalysis.label || selectedCase.aiAnalysis.suggestion)}</p>
                                                {selectedCase.aiAnalysis.confidence && <p><strong>Confidence:</strong> {selectedCase.aiAnalysis.confidence}%</p>}
                                                {selectedCase.aiAnalysis.flaggedKeywords && <p><strong>Flags:</strong> {selectedCase.aiAnalysis.flaggedKeywords?.join(", ")}</p>}
                                            </div>
                                        </div>
                                    )}

                                    {selectedCase.resolution && (
                                        <div className="success-story">
                                            <strong>✅ Resolution:</strong> {selectedCase.resolution}
                                            {selectedCase.daysToResolve && <span> (Resolved in {selectedCase.daysToResolve} days)</span>}
                                        </div>
                                    )}
                                </>
                            )}
                            
                            {activeTab === "timeline" && (
                                <div className="detail-item" style={{ marginTop: "20px" }}>
                                    <h4 style={{ marginBottom: "16px" }}>⏳ Case Timeline</h4>
                                    {selectedCase.timeline?.length > 0 ? (
                                        selectedCase.timeline.map((act: any, index: number) => (
                                            <div key={index} style={{ marginBottom: "16px", borderLeft: "2px solid #2563eb", paddingLeft: "12px", marginLeft: "8px" }}>
                                                <strong style={{ color: "#111827" }}>{act.action}</strong>
                                                <div style={{ fontSize: "14px", marginTop: "4px" }}>{act.note}</div>
                                                <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                                                    {act.actor} • {new Date(act.date).toLocaleString()}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p style={{ color: "#9ca3af" }}>No timeline events yet</p>
                                    )}
                                </div>
                            )}

                            {activeTab === "notes" && (
                                <div className="notes-section" style={{ marginTop: "20px", borderTop: "none", paddingTop: 0 }}>
                                    <h4 style={{ marginBottom: "16px" }}>📝 Case Notes & Updates</h4>
                                    
                                    <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
                                        <input 
                                            type="text" 
                                            value={newNote} 
                                            onChange={(e) => setNewNote(e.target.value)} 
                                            placeholder="Write a new note..."
                                            style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db" }}
                                        />
                                        <button 
                                            onClick={() => handleAddNote(selectedCase._id)}
                                            style={{ padding: "10px 16px", background: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: 500 }}
                                        >
                                            Add Note
                                        </button>
                                    </div>

                                    {selectedCase.notes?.length > 0 ? (
                                        selectedCase.notes.map((note: any, index: number) => (
                                            <div key={index} className="note-item" style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}>
                                                <strong>{note.role}:</strong> {note.text}
                                                <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                                                    {new Date(note.createdAt || new Date()).toLocaleString()}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p style={{ color: "#9ca3af" }}>No notes added yet</p>
                                    )}
                                </div>
                            )}

                            {activeTab === "legal" && (
                                <div className="detail-item" style={{ marginTop: "20px" }}>
                                    <h4 style={{ marginBottom: "8px" }}>⚖️ Legal Actions</h4>
                                    <p style={{ color: "#6b7280", marginBottom: "20px", fontSize: "14px" }}>Document evidence, external reporting, and next steps.</p>
                                    
                                    {isAdmin && (
                                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "24px", background: "#eff6ff", padding: "16px", borderRadius: "8px" }}>
                                            <div>
                                                <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#1e40af", marginBottom: "6px" }}>Update Status</label>
                                                <select 
                                                    onChange={(e) => handleStatusChange(selectedCase._id, e.target.value)} 
                                                    value={selectedCase.status}
                                                    style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #bfdbfe", background: "white", outline: "none", minWidth: "150px" }}
                                                >
                                                    <option value="New">New</option>
                                                    <option value="Under Review">Under Review</option>
                                                    <option value="Escalated">Escalated</option>
                                                    <option value="Resolved">Resolved</option>
                                                    <option value="Closed">Closed</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    {selectedCase.evidence?.length > 0 ? (
                                        <div>
                                            <h5 style={{ marginBottom: "10px", fontSize: "14px", color: "#374151" }}>Evidence Files:</h5>
                                            <ul style={{ listStyleType: "none", padding: 0 }}>
                                                {selectedCase.evidence.map((ev: any, i: number) => (
                                                    <li key={i} style={{ padding: "12px", background: "#f9fafb", marginBottom: "8px", borderRadius: "6px", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: "8px" }}>
                                                        <span>📎</span>
                                                        <span style={{ fontWeight: 500, color: "#111827", fontSize: "14px" }}>{ev.fileName}</span>
                                                        <span style={{ color: "#6b7280", fontSize: "12px", marginLeft: "auto" }}>({(ev.size / 1024).toFixed(1)} KB)</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <div style={{ padding: "20px", textAlign: "center", background: "#f9fafb", borderRadius: "8px", border: "1px dashed #d1d5db" }}>
                                            <p style={{ color: "#9ca3af", fontSize: "14px" }}>No evidence uploaded for this case.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CaseManagement;