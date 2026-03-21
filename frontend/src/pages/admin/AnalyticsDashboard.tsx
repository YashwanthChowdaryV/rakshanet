import { useState, useEffect } from "react";
import api from "../../services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#8B5CF6"];

export default function AnalyticsDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await api.get("/analytics/overview");
            setData(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    if (loading) return <><div style={{ paddingTop: "100px", textAlign: "center" }}>Loading analytics engine...</div></>;
    if (!data) return <><div style={{ paddingTop: "100px", textAlign: "center" }}>Failed to load data</div></>;

    return (
        <>
            <style>
                {`
                .dashboard-page { padding: 100px 40px; background: #f3f4f6; min-height: 100vh; font-family: 'Inter', sans-serif; }
                .top-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 25px; }
                .stat-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border-left: 4px solid #3B82F6; }
                .stat-card h4 { color: #6B7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 10px 0; }
                .stat-card .value { font-size: 32px; font-weight: 800; color: #111827; }
                .charts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; margin-bottom: 25px; }
                .chart-panel { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
                .chart-panel h3 { margin-top: 0; color: #374151; font-weight: 600; font-size: 18px; margin-bottom: 20px; }
                @media (max-width: 768px) {
                    .dashboard-page { padding: 80px 20px; }
                    .charts-grid { grid-template-columns: 1fr; }
                }
                `}
            </style>

            <div className="dashboard-page">
                <h1 style={{ marginBottom: "25px", color: "#111827", fontSize: "32px", fontWeight: "800" }}>🚀 Data & Analytics HQ</h1>

                {/* OVERVIEW CARDS */}
                <div className="top-grid">
                    <div className="stat-card" style={{ borderColor: "#3B82F6" }}>
                        <h4>Total Cases</h4>
                        <div className="value">{data.overview.totalCases}</div>
                    </div>
                    <div className="stat-card" style={{ borderColor: "#EF4444" }}>
                        <h4>Critical Escalations</h4>
                        <div className="value" style={{ color: "#EF4444" }}>{data.overview.criticalCases}</div>
                    </div>
                    <div className="stat-card" style={{ borderColor: "#10B981" }}>
                        <h4>Resolved Cases</h4>
                        <div className="value" style={{ color: "#10B981" }}>{data.overview.resolvedCases}</div>
                    </div>
                    <div className="stat-card" style={{ borderColor: "#8B5CF6" }}>
                        <h4>Counselor Sessions</h4>
                        <div className="value">{data.overview.sessionsCount}</div>
                    </div>
                    <div className="stat-card" style={{ borderColor: "#F59E0B" }}>
                        <h4>Appointments Booked</h4>
                        <div className="value">{data.overview.appointmentsCount}</div>
                    </div>
                </div>

                {/* CHARTS */}
                <div className="charts-grid">
                    <div className="chart-panel">
                        <h3>Cases Volatility (Monthly)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.casesPerMonth}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="cases" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-panel">
                        <h3>Severity Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={data.severityStats}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    label
                                >
                                    {data.severityStats.map((entry: any, index: number) => (
                                        <Cell key={"cell-" + index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip wrapperStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-panel" style={{ gridColumn: "1 / -1" }}>
                        <h3>System Status View</h3>
                        <ResponsiveContainer width="100%" height={150}>
                            <BarChart data={data.statusStats} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" width={100} tick={{ fill: '#4B5563', fontWeight: '500' }} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </>
    );
}