import { useState, useEffect } from "react";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (token) fetchNotifications();
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if(Array.isArray(data)) setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch("http://localhost:5000/api/v1/notifications/read", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id })
      });
      setNotifications(notifications.map((n: any) => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await fetch("http://localhost:5000/api/v1/notifications/read-all", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map((n: any) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  return (
    <div style={{ position: "relative" }}>
      <button 
        onClick={() => setOpen(!open)}
        style={{ background: "transparent", border: "none", cursor: "pointer", position: "relative", padding: "8px", color: "white" }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        {unreadCount > 0 && (
          <span style={{ position: "absolute", top: "0", right: "0", background: "#ef4444", color: "white", fontSize: "10px", padding: "2px 6px", borderRadius: "10px", fontWeight: "bold" }}>
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{ position: "absolute", right: "0", top: "100%", width: "320px", background: "white", borderRadius: "8px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", zIndex: 1000, overflow: "hidden", border: "1px solid #e5e7eb" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f9fafb" }}>
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#374151" }}>Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{ fontSize: "12px", color: "#3b82f6", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Mark all as read</button>
            )}
          </div>
          <div style={{ maxHeight: "360px", overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div style={{ padding: "24px", textAlign: "center", color: "#6b7280", fontSize: "14px" }}>No notifications</div>
            ) : (
              notifications.map((n: any) => (
                <div 
                  key={n._id} 
                  onClick={() => { if(!n.read) markAsRead(n._id); }}
                  style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb", background: n.read ? "white" : "#eff6ff", cursor: "pointer", transition: "background 0.2s" }}
                >
                  <p style={{ margin: 0, fontSize: "13px", color: "#111827" }}>{n.message}</p>
                  <span style={{ fontSize: "11px", color: "#6b7280" }}>{new Date(n.createdAt).toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
