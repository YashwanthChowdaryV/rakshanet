import { useState, useEffect } from "react";

import api from "../../services/api";

const EvidenceVault = () => {
    const [evidence, setEvidence] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [verifying, setVerifying] = useState<{ [key: string]: boolean }>({});
    const [verificationResults, setVerificationResults] = useState<{ [key: string]: 'valid' | 'tampered' }>({});

    const verifyEvidence = async (caseId: string, fileName: string) => {
        try {
            setVerifying(prev => ({ ...prev, [fileName]: true }));
            const res = await api.get(`/cases/${caseId}/evidence/${fileName}/verify`);
            setVerificationResults(prev => ({ ...prev, [fileName]: res.data.valid ? 'valid' : 'tampered' }));
        } catch (err) {
            console.error("Verification error", err);
            alert("Verification failed");
        } finally {
            setVerifying(prev => ({ ...prev, [fileName]: false }));
        }
    };

    const fetchEvidence = async () => {
        try {
            setLoading(true);
            const res = await api.get("/cases/evidence");
            setEvidence(res.data);
            setError(null);
        } catch (err: any) {
            console.error("Error fetching evidence:", err);
            setError("Failed to load evidence files.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvidence();
    }, []);

    const filteredEvidence = evidence.filter((ev) =>
        ev.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ev.caseNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getFileIcon = (fileName: string) => {
        const ext = fileName.split(".").pop()?.toLowerCase();
        if (["jpg", "jpeg", "png", "gif"].includes(ext || "")) return "🖼️";
        if (ext === "pdf") return "📄";
        if (["mp4", "mov", "avi"].includes(ext || "")) return "🎥";
        return "📁";
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    if (loading) {
        return (
            <>
                <div className="vault-wrapper" style={{ paddingTop: "120px", textAlign: "center" }}>
                    <div className="loading-container">
                        <div className="loader"></div>
                        <p>Securing connection to Evidence Vault...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="vault-wrapper">
                <style>
                    {`
                        .vault-wrapper {
                            padding: 120px 40px 40px;
                            background-image: url('https://www.ascd.org/_next/image?url=https%3A%2F%2Flibrary.ascd.org%2Fm%2F60c0dc8ab2b0615a%2Fwebimage-Fisher-Frey-Sept-25.jpg%3Fq%3D90&w=3840&q=75');
                            background-size: cover;
                            background-position: center;
                            background-repeat: no-repeat;
                            background-attachment: fixed;
                            position: relative;
                            min-height: 100vh;
                        }
                        
                        /* Light overlay for readability */
                        .vault-wrapper::before {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background: rgba(255, 255, 255, 0.85);
                            z-index: 0;
                        }
                        
                        .vault-header {
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-end;
                            margin-bottom: 32px;
                            border-bottom: 2px solid #f97316;
                            padding-bottom: 16px;
                            flex-wrap: wrap;
                            gap: 20px;
                            position: relative;
                            z-index: 1;
                        }
                        .vault-title h2 {
                            font-size: 32px;
                            font-weight: 800;
                            color: #f97316;
                            margin-bottom: 4px;
                        }
                        .vault-title p {
                            color: #6b6b6b;
                            font-size: 16px;
                        }
                        .search-bar {
                            width: 350px;
                            position: relative;
                        }
                        .search-bar input {
                            width: 100%;
                            padding: 12px 16px 12px 40px;
                            border-radius: 12px;
                            border: 1px solid #f97316;
                            font-size: 14px;
                            background: #ffffff;
                            color: #1a1a1a;
                            transition: all 0.2s;
                        }
                        .search-bar input:focus {
                            outline: none;
                            border-color: #ff8c42;
                            box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.2);
                        }
                        .search-bar input::placeholder {
                            color: #9ca3af;
                        }
                        .search-bar::before {
                            content: "🔍";
                            position: absolute;
                            left: 14px;
                            top: 12px;
                            font-size: 16px;
                            opacity: 0.6;
                        }

                        .evidence-grid {
                            display: grid;
                            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                            gap: 24px;
                            position: relative;
                            z-index: 1;
                        }

                        .evidence-card {
                            background: #ffffff;
                            border-radius: 16px;
                            padding: 24px;
                            border: 1px solid #f97316;
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                            transition: transform 0.2s, box-shadow 0.2s;
                            display: flex;
                            flex-direction: column;
                            gap: 16px;
                        }
                        .evidence-card:hover {
                            transform: translateY(-4px);
                            box-shadow: 0 12px 24px rgba(249, 115, 22, 0.2);
                            border-color: #ff8c42;
                        }

                        .card-top {
                            display: flex;
                            align-items: center;
                            gap: 16px;
                        }
                        .file-icon {
                            font-size: 40px;
                            background: #fff7ed;
                            width: 64px;
                            height: 64px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border-radius: 12px;
                            border: 1px solid #f97316;
                        }
                        .file-info {
                            flex: 1;
                            overflow: hidden;
                        }
                        .file-name {
                            font-weight: 700;
                            color: #f97316;
                            font-size: 16px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        .file-meta {
                            font-size: 12px;
                            color: #6b6b6b;
                            margin-top: 2px;
                        }

                        .card-details {
                            background: #fff7ed;
                            padding: 12px;
                            border-radius: 10px;
                            font-size: 13px;
                            display: flex;
                            flex-direction: column;
                            gap: 8px;
                            border: 1px solid #fed7aa;
                        }
                        .detail-row {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        }
                        .detail-label {
                            color: #6b6b6b;
                            font-weight: 500;
                        }
                        .detail-value {
                            color: #1a1a1a;
                            font-weight: 600;
                        }

                        .verify-btn {
                            background: #f97316;
                            color: #ffffff;
                            border: none;
                            padding: 6px 12px;
                            border-radius: 20px;
                            font-size: 12px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.2s;
                        }
                        .verify-btn:hover:not(:disabled) {
                            background: #ff8c42;
                            transform: scale(1.05);
                        }
                        .verify-btn:disabled {
                            opacity: 0.5;
                            cursor: not-allowed;
                        }

                        .valid-badge {
                            color: #10b981;
                            font-weight: 600;
                            display: flex;
                            align-items: center;
                            gap: 4px;
                        }
                        .tampered-badge {
                            color: #ef4444;
                            font-weight: 600;
                            display: flex;
                            align-items: center;
                            gap: 4px;
                        }

                        .download-btn {
                            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
                            color: white;
                            border: none;
                            padding: 12px;
                            border-radius: 10px;
                            font-weight: 700;
                            cursor: pointer;
                            transition: all 0.2s;
                            text-align: center;
                            text-decoration: none;
                            display: block;
                            font-size: 14px;
                        }
                        .download-btn:hover {
                            background: linear-gradient(135deg, #ff8c42 0%, #f97316 100%);
                            transform: translateY(-1px);
                            box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4);
                        }

                        .empty-vault {
                            text-align: center;
                            padding: 80px;
                            background: #ffffff;
                            border-radius: 20px;
                            border: 2px dashed #f97316;
                            grid-column: 1 / -1;
                        }
                        .empty-vault h3 {
                            font-size: 24px;
                            color: #f97316;
                            margin-top: 16px;
                        }
                        .empty-vault p {
                            color: #6b6b6b;
                            margin-top: 8px;
                        }

                        .loading-container {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            height: 40vh;
                            color: #f97316;
                            background: rgba(255, 255, 255, 0.9);
                            border-radius: 20px;
                            padding: 40px;
                            max-width: 400px;
                            margin: 0 auto;
                        }
                        .loader {
                            border: 4px solid #fed7aa;
                            border-top: 4px solid #f97316;
                            border-radius: 50%;
                            width: 40px;
                            height: 40px;
                            animation: spin 1s linear infinite;
                            margin-bottom: 16px;
                        }
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }

                        .error-message {
                            color: #ef4444;
                            margin-bottom: 20px;
                            padding: 12px;
                            background: rgba(239, 68, 68, 0.1);
                            border-radius: 8px;
                            border-left: 3px solid #ef4444;
                            position: relative;
                            z-index: 1;
                        }

                        @media (max-width: 768px) {
                            .vault-wrapper {
                                padding: 100px 20px 40px;
                            }
                            .vault-header {
                                flex-direction: column;
                                align-items: flex-start;
                            }
                            .search-bar {
                                width: 100%;
                            }
                            .evidence-grid {
                                grid-template-columns: 1fr;
                            }
                            .empty-vault {
                                padding: 40px 20px;
                            }
                        }
                    `}
                </style>

                <div className="vault-header">
                    <div className="vault-title">
                        <h2>🛡️ Evidence Vault</h2>
                        <p>Encrypted clinical evidence repository • Blockchain-verified integrity</p>
                    </div>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search by filename or case ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="evidence-grid">
                    {filteredEvidence.length > 0 ? (
                        filteredEvidence.map((ev, idx) => (
                            <div key={idx} className="evidence-card">
                                <div className="card-top">
                                    <div className="file-icon">{getFileIcon(ev.fileName)}</div>
                                    <div className="file-info">
                                        <div className="file-name" title={ev.fileName}>{ev.fileName}</div>
                                        <div className="file-meta">{formatSize(ev.size)} • {new Date(ev.uploadedAt).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <div className="card-details">
                                    <div className="detail-row">
                                        <span className="detail-label">Case Number:</span>
                                        <span className="detail-value">{ev.caseNumber}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Platform:</span>
                                        <span className="detail-value">{ev.platform}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Integrity:</span>
                                        {verificationResults[ev.fileName] ? (
                                            <span className={verificationResults[ev.fileName] === 'valid' ? 'valid-badge' : 'tampered-badge'}>
                                                {verificationResults[ev.fileName] === 'valid' ? "✅ Verified" : "❌ Tampered"}
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => verifyEvidence(ev.caseId, ev.fileName)}
                                                className="verify-btn"
                                                disabled={verifying[ev.fileName]}
                                            >
                                                {verifying[ev.fileName] ? "Verifying..." : "Verify Hash"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <a
                                    href={`http://localhost:5000/uploads/${ev.storedName}`}
                                    download={ev.fileName}
                                    className="download-btn"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    📥 Download Secure Copy
                                </a>
                            </div>
                        ))
                    ) : !loading && (
                        <div className="empty-vault">
                            <span style={{ fontSize: "64px" }}>📂</span>
                            <h3>No evidence files found</h3>
                            <p>Upload evidence by reporting an incident on the dashboard.</p>
                            <p style={{ fontSize: "13px", marginTop: "8px" }}>All files are encrypted and integrity-verified</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default EvidenceVault;