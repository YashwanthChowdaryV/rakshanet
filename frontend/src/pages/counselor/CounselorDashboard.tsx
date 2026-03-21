import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const CounselorDashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [appointments, setAppointments] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStats();
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await api.get("/therapy/assigned");
            setAppointments(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await api.get("/cases/stats");
            setStats(res.data);
        } catch (err) {
            console.log(err);
        }
    };

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
                .title {
                    font-size: 32px;
                    font-weight: 700;
                    background: linear-gradient(135deg, #db2777 0%, #be185d 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 20px;
                }
                .grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 20px;
                    margin-bottom: 30px;
                }
                .card {
                    background: #ffffff;
                    padding: 24px;
                    border-radius: 20px;
                    box-shadow: 0 4px 12px rgba(219, 39, 119, 0.08);
                    border: 1px solid #ffe0ed;
                    transition: all 0.3s ease;
                }
                .card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(219, 39, 119, 0.12);
                    border-color: #fbc4d5;
                }
                .card h3 {
                    font-size: 14px;
                    color: #db2777;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 8px;
                }
                .card p {
                    font-size: 28px;
                    font-weight: 700;
                    color: #831843;
                    margin: 0;
                }
                .btn {
                    padding: 12px 28px;
                    border-radius: 40px;
                    border: none;
                    cursor: pointer;
                    background: linear-gradient(135deg, #db2777 0%, #be185d 100%);
                    color: white;
                    font-weight: 600;
                    font-size: 15px;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(219, 39, 119, 0.3);
                }
                .btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(219, 39, 119, 0.4);
                    background: linear-gradient(135deg, #e06a9e 0%, #c13b6e 100%);
                }
                .section-title {
                    font-size: 22px;
                    font-weight: 700;
                    margin-top: 48px;
                    margin-bottom: 24px;
                    color: #b83280;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .section-title::before {
                    content: "🧘";
                    font-size: 24px;
                }
                .appt-card {
                    background: #ffffff;
                    padding: 20px 24px;
                    border-radius: 20px;
                    margin-bottom: 14px;
                    border: 1px solid #ffe0ed;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: all 0.3s ease;
                }
                .appt-card:hover {
                    transform: translateX(4px);
                    border-color: #fbc4d5;
                    box-shadow: 0 4px 12px rgba(219, 39, 119, 0.08);
                }
                .appt-info h4 {
                    font-weight: 700;
                    margin-bottom: 8px;
                    color: #831843;
                    font-size: 16px;
                }
                .appt-info p {
                    color: #b86f88;
                    font-size: 14px;
                    margin: 4px 0;
                    line-height: 1.5;
                }
                .status-badge {
                    padding: 6px 16px;
                    border-radius: 40px;
                    font-size: 12px;
                    font-weight: 600;
                    background: #ffe4ed;
                    color: #db2777;
                    text-transform: capitalize;
                    letter-spacing: 0.3px;
                }
                .empty-state {
                    text-align: center;
                    padding: 48px;
                    background: #ffffff;
                    border-radius: 20px;
                    color: #b86f88;
                    border: 1px solid #ffe0ed;
                }
                .empty-state p {
                    font-size: 14px;
                }
                @media (max-width: 768px) {
                    .page {
                        padding: 80px 20px;
                    }
                    .grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 16px;
                    }
                    .title {
                        font-size: 28px;
                    }
                    .appt-card {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 12px;
                    }
                    .card p {
                        font-size: 24px;
                    }
                }
                @media (max-width: 480px) {
                    .grid {
                        grid-template-columns: 1fr;
                    }
                }
                `}
            </style>
            <div className="page">
                <div className="title">Counselor Dashboard</div>
                {stats && (
                    <div className="grid">
                        <div className="card">
                            <h3>Total Cases</h3>
                            <p>{stats.totalCases || 0}</p>
                        </div>
                        <div className="card">
                            <h3>New</h3>
                            <p>{stats.new || 0}</p>
                        </div>
                        <div className="card">
                            <h3>Under Review</h3>
                            <p>{stats.review || 0}</p>
                        </div>
                        <div className="card">
                            <h3>Resolved</h3>
                            <p>{stats.resolved || 0}</p>
                        </div>
                    </div>
                )}
                <button
                    className="btn"
                    onClick={() => navigate("/counselor/cases")}
                >
                    View Cases Dashboard
                </button>

                <div className="section-title">Assigned Appointments</div>
                {appointments.length === 0 ? (
                    <div className="empty-state">
                        <p>💗 No upcoming appointments assigned.</p>
                        <p style={{ fontSize: "13px", marginTop: "8px", color: "#b86f88" }}>New appointments will appear here when assigned.</p>
                    </div>
                ) : (
                    appointments.map((appt, i) => (
                        <div key={i} className="appt-card">
                            <div className="appt-info">
                                <h4>{appt.student?.name || "Student"}</h4>
                                <p>📅 Date: {appt.date} | ⏰ Time: {appt.time} | 📞 Type: {appt.sessionType}</p>
                                <p>💬 Reason: {appt.reason || "No reason provided"}</p>
                            </div>
                            <div className="status-badge">{appt.status}</div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
};

export default CounselorDashboard;