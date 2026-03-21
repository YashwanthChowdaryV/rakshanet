import { useState, useEffect } from "react";

export default function AdminLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/audit", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-600">Loading audit logs...</div>;

  return (
    <div style={{ padding: "100px 32px 32px", maxWidth: "1280px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "24px", color: "#1f2937" }}>Audit Logs</h1>

      <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", border: "1px solid #e5e7eb", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb", textAlign: "left" }}>
              <th style={{ padding: "12px 16px", color: "#6b7280", fontSize: "14px" }}>Action</th>
              <th style={{ padding: "12px 16px", color: "#6b7280", fontSize: "14px" }}>User</th>
              <th style={{ padding: "12px 16px", color: "#6b7280", fontSize: "14px" }}>Role</th>
              <th style={{ padding: "12px 16px", color: "#6b7280", fontSize: "14px" }}>Details</th>
              <th style={{ padding: "12px 16px", color: "#6b7280", fontSize: "14px" }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log: any) => (
              <tr key={log._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#111827", fontWeight: "500" }}>{log.action}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#4b5563" }}>{log.user?.name || "System"}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px" }}>
                  <span style={{ background: "#e0e7ff", color: "#4f46e5", padding: "2px 8px", borderRadius: "12px", fontSize: "12px" }}>
                    {log.role}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#6b7280" }}>{log.details}</td>
                <td style={{ padding: "12px 16px", fontSize: "14px", color: "#6b7280" }}>{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: "48px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>
                  No audit logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}