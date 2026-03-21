import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AdminCases() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/cases", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await res.json();
      setCases(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/cases/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setCases(cases.map((c: any) => c._id === id ? { ...c, status: newStatus } : c));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ background: "#fff5f5", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#b91c1c" }}>Loading cases...</div>;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "#dc2626";
      case "High": return "#f97316";
      case "Medium": return "#eab308";
      case "Low": return "#10b981";
      default: return "#6b7280";
    }
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%)",
      minHeight: "100vh",
      width: "100%",
      margin: 0,
      padding: 0,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflowY: "auto"
    }}>
      <div style={{ padding: "100px 32px 60px", maxWidth: "1280px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "28px", background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Manage Cases</h1>

        <div style={{ background: "white", borderRadius: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid #ffe0e0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fff5f5", borderBottom: "1px solid #ffe0e0", textAlign: "left" }}>
                <th style={{ padding: "16px 20px", color: "#b91c1c", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Case ID</th>
                <th style={{ padding: "16px 20px", color: "#b91c1c", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Platform</th>
                <th style={{ padding: "16px 20px", color: "#b91c1c", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Severity</th>
                <th style={{ padding: "16px 20px", color: "#b91c1c", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Status</th>
                <th style={{ padding: "16px 20px", color: "#b91c1c", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c: any) => (
                <tr key={c._id} style={{ borderBottom: "1px solid #ffe0e0", transition: "background 0.2s ease" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#fff5f5"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "white"; }}>
                  <td style={{ padding: "16px 20px", fontSize: "14px", color: "#111827", fontWeight: "500" }}>{c.caseNumber}</td>
                  <td style={{ padding: "16px 20px", fontSize: "14px", color: "#7f1a1a" }}>{c.platform}</td>
                  <td style={{ padding: "16px 20px", fontSize: "14px" }}>
                    <span style={{
                      color: getSeverityColor(c.severity),
                      fontWeight: "600",
                      background: getSeverityColor(c.severity) === "#dc2626" ? "#fee2e2" :
                        getSeverityColor(c.severity) === "#f97316" ? "#fff7ed" :
                          getSeverityColor(c.severity) === "#eab308" ? "#fefce8" : "#f0fdf4",
                      padding: "4px 12px",
                      borderRadius: "40px",
                      fontSize: "12px",
                      display: "inline-block"
                    }}>
                      {c.severity}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: "14px" }}>
                    <select
                      value={c.status}
                      onChange={(e) => updateStatus(c._id, e.target.value)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "40px",
                        border: "1px solid #ffe0e0",
                        background: "white",
                        color: "#7f1a1a",
                        fontWeight: "500",
                        fontSize: "13px",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#dc2626"; e.currentTarget.style.background = "#fff5f5"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#ffe0e0"; e.currentTarget.style.background = "white"; }}
                    >
                      <option value="New">New</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Escalated">Escalated</option>
                      <option value="Lawyer Review">Lawyer Review</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: "14px" }}>
                    <Link
                      to={`/admin/case/${c._id}`}
                      style={{
                        color: "#b91c1c",
                        textDecoration: "none",
                        fontWeight: "600",
                        padding: "6px 16px",
                        borderRadius: "40px",
                        background: "#fee2e2",
                        display: "inline-block",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#fecaca"; e.currentTarget.style.transform = "translateX(2px)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.transform = "translateX(0)"; }}
                    >
                      View Details →
                    </Link>
                  </td>
                </tr>
              ))}
              {cases.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: "60px", textAlign: "center", color: "#b86f88", fontSize: "14px" }}>
                    📋 No cases found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}