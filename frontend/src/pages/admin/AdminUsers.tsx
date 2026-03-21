import { useState, useEffect } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ background: "#fff5f5", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#b91c1c" }}>Loading users...</div>;

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
        <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "28px", background: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Manage Users</h1>

        <div style={{ background: "white", borderRadius: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", border: "1px solid #ffe0e0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fff5f5", borderBottom: "1px solid #ffe0e0", textAlign: "left" }}>
                <th style={{ padding: "16px 20px", color: "#b91c1c", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Name</th>
                <th style={{ padding: "16px 20px", color: "#b91c1c", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Email</th>
                <th style={{ padding: "16px 20px", color: "#b91c1c", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Role</th>
                <th style={{ padding: "16px 20px", color: "#b91c1c", fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user._id} style={{ borderBottom: "1px solid #ffe0e0", transition: "background 0.2s ease" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#fff5f5"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "white"; }}>
                  <td style={{ padding: "16px 20px", fontSize: "14px", color: "#111827", fontWeight: "500" }}>{user.name}</td>
                  <td style={{ padding: "16px 20px", fontSize: "14px", color: "#7f1a1a" }}>{user.email}</td>
                  <td style={{ padding: "16px 20px", fontSize: "14px" }}>
                    <span style={{
                      background: user.role === 'admin' ? '#fee2e2' : user.role === 'counselor' ? '#fee2e2' : '#fee2e2',
                      color: user.role === 'admin' ? '#b91c1c' : user.role === 'counselor' ? '#b91c1c' : '#b91c1c',
                      padding: "4px 12px",
                      borderRadius: "40px",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: "14px", color: "#9ca3af" }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: "60px", textAlign: "center", color: "#b86f88", fontSize: "14px" }}>
                    👥 No users found.
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