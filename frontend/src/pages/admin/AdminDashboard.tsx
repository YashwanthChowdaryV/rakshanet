import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCases: 0,
    criticalCases: 0,
    sessionsCount: 0,
    appointmentsCount: 0,
    recentLogs: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/admin/dashboard-stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-600">Loading dashboard...</div>;

  return (
    <div style={{ padding: "100px 32px 32px", maxWidth: "1280px", margin: "0 auto", background: "linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%)", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "28px", background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Admin Dashboard</h1>

      {/* Quick Links */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "40px", flexWrap: "wrap" }}>
        <Link to="/admin/users" style={{ background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)", color: "white", padding: "12px 24px", borderRadius: "40px", textDecoration: "none", fontWeight: "600", transition: "all 0.3s ease", boxShadow: "0 2px 8px rgba(220, 38, 38, 0.3)", display: "inline-block" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(220, 38, 38, 0.4)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(220, 38, 38, 0.3)"; }}>👥 Manage Users</Link>
        <Link to="/admin/cases" style={{ background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)", color: "white", padding: "12px 24px", borderRadius: "40px", textDecoration: "none", fontWeight: "600", transition: "all 0.3s ease", boxShadow: "0 2px 8px rgba(220, 38, 38, 0.3)", display: "inline-block" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(220, 38, 38, 0.4)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(220, 38, 38, 0.3)"; }}>📋 Manage Cases</Link>
        <Link to="/admin/logs" style={{ background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)", color: "white", padding: "12px 24px", borderRadius: "40px", textDecoration: "none", fontWeight: "600", transition: "all 0.3s ease", boxShadow: "0 2px 8px rgba(220, 38, 38, 0.3)", display: "inline-block" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(220, 38, 38, 0.4)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(220, 38, 38, 0.3)"; }}>📜 Audit Logs</Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px", marginBottom: "48px" }}>
        <div style={{ background: "white", padding: "28px 24px", borderRadius: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid #ffe0e0", transition: "all 0.3s ease" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(220, 38, 38, 0.1)"; e.currentTarget.style.borderColor = "#fecaca"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)"; e.currentTarget.style.borderColor = "#ffe0e0"; }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>👥</div>
          <h3 style={{ fontSize: "14px", color: "#b91c1c", marginBottom: "8px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Users</h3>
          <p style={{ fontSize: "36px", fontWeight: "bold", color: "#7f1a1a", margin: 0 }}>{stats.totalUsers}</p>
        </div>
        <div style={{ background: "white", padding: "28px 24px", borderRadius: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid #ffe0e0", transition: "all 0.3s ease" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(220, 38, 38, 0.1)"; e.currentTarget.style.borderColor = "#fecaca"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)"; e.currentTarget.style.borderColor = "#ffe0e0"; }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>📋</div>
          <h3 style={{ fontSize: "14px", color: "#b91c1c", marginBottom: "8px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Cases</h3>
          <p style={{ fontSize: "36px", fontWeight: "bold", color: "#7f1a1a", margin: 0 }}>{stats.totalCases}</p>
        </div>
        <div style={{ background: "white", padding: "28px 24px", borderRadius: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid #ffe0e0", borderLeft: "4px solid #dc2626", transition: "all 0.3s ease" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(220, 38, 38, 0.15)"; e.currentTarget.style.borderColor = "#fecaca"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)"; e.currentTarget.style.borderColor = "#ffe0e0"; }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>⚠️</div>
          <h3 style={{ fontSize: "14px", color: "#b91c1c", marginBottom: "8px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Critical Cases</h3>
          <p style={{ fontSize: "36px", fontWeight: "bold", color: "#dc2626", margin: 0 }}>{stats.criticalCases}</p>
        </div>
        <div style={{ background: "white", padding: "28px 24px", borderRadius: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid #ffe0e0", transition: "all 0.3s ease" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(220, 38, 38, 0.1)"; e.currentTarget.style.borderColor = "#fecaca"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)"; e.currentTarget.style.borderColor = "#ffe0e0"; }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>🧘</div>
          <h3 style={{ fontSize: "14px", color: "#b91c1c", marginBottom: "8px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Sessions</h3>
          <p style={{ fontSize: "36px", fontWeight: "bold", color: "#7f1a1a", margin: 0 }}>{stats.sessionsCount}</p>
        </div>
        <div style={{ background: "white", padding: "28px 24px", borderRadius: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid #ffe0e0", transition: "all 0.3s ease" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(220, 38, 38, 0.1)"; e.currentTarget.style.borderColor = "#fecaca"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)"; e.currentTarget.style.borderColor = "#ffe0e0"; }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>📅</div>
          <h3 style={{ fontSize: "14px", color: "#b91c1c", marginBottom: "8px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Appointments</h3>
          <p style={{ fontSize: "36px", fontWeight: "bold", color: "#7f1a1a", margin: 0 }}>{stats.appointmentsCount}</p>
        </div>
      </div>

      <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "20px", color: "#7f1a1a", display: "flex", alignItems: "center", gap: "10px" }}>
        <span>🔄</span> Recent System Activity
      </h2>
      <div style={{ background: "white", borderRadius: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid #ffe0e0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#fff5f5", borderBottom: "1px solid #ffe0e0", textAlign: "left" }}>
              <th style={{ padding: "16px 20px", color: "#b91c1c", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Action</th>
              <th style={{ padding: "16px 20px", color: "#b91c1c", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>User</th>
              <th style={{ padding: "16px 20px", color: "#b91c1c", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Role</th>
              <th style={{ padding: "16px 20px", color: "#b91c1c", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentLogs.map((log: any) => (
              <tr key={log._id} style={{ borderBottom: "1px solid #ffe0e0", transition: "background 0.2s ease" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#fff5f5"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "white"; }}>
                <td style={{ padding: "16px 20px", fontSize: "14px", color: "#4b5563" }}>{log.action}</td>
                <td style={{ padding: "16px 20px", fontSize: "14px", color: "#7f1a1a", fontWeight: "500" }}>{log.user?.name || "System"}</td>
                <td style={{ padding: "16px 20px", fontSize: "14px" }}>
                  <span style={{ background: "#fee2e2", color: "#b91c1c", padding: "4px 12px", borderRadius: "40px", fontSize: "12px", fontWeight: "600" }}>
                    {log.role}
                  </span>
                </td>
                <td style={{ padding: "16px 20px", fontSize: "13px", color: "#9ca3af" }}>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
            {stats.recentLogs.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: "48px", textAlign: "center", color: "#b86f88", fontSize: "14px" }}>
                  📭 No recent activity to display.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}