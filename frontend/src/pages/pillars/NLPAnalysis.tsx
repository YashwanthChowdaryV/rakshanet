import { useState } from "react";

import api from "../../services/api";

const NLPAnalysis = () => {
    const [inputText, setInputText] = useState("");
    const [sourceLang, setSourceLang] = useState("English");
    const [backendResult, setBackendResult] = useState<any>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [imageResult, setImageResult] = useState<any>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const languages = [
        "English",
        "Hindi",
        "Telugu",
        "Tamil",
        "Kannada",
        "Malayalam",
        "Marathi",
        "Gujarati",
        "Bengali",
        "Punjabi",
        "Urdu"
    ];

    const handleAnalyze = async () => {
        if (!inputText.trim()) {
            alert("Please enter text to analyze.");
            return;
        }

        try {
            setLoading(true);
            const res = await api.post("/nlp/analyze", {
                texts: [inputText],
                sessionId: sessionId
            });

            console.log("NLP Backend Response:", res.data);
            setBackendResult(res.data.results[0]);
            setSessionId(res.data.sessionId);
        } catch (error) {
            console.error("NLP analysis failed", error);
            alert("Analysis failed. See console.");
        } finally {
            setLoading(false);
        }
    };

    // Fake AI image analysis
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);

            const severityLevels = ["Low", "Medium", "High", "Critical"];
            const randomSeverity =
                severityLevels[Math.floor(Math.random() * 4)];

            setImageResult({
                fileName: e.target.files[0].name,
                fileSize: (e.target.files[0].size / 1024).toFixed(1),
                extractedText:
                    "Send money or I will leak your private photos. You have 24 hours to pay or else...",
                detectedWords: ["kill", "blackmail", "money", "photos"],
                severity: randomSeverity,
                confidence: Math.floor(Math.random() * 20) + 80
            });
        }
    };

    const getSeverityColor = (level: string) => {
        switch (level) {
            case "Critical":
                return "#dc2626";
            case "High":
                return "#ea580c";
            case "Medium":
                return "#ca8a04";
            default:
                return "#16a34a";
        }
    };

    const getSeverityBg = (level: string) => {
        switch (level) {
            case "Critical":
                return "#fee2e2";
            case "High":
                return "#ffedd5";
            case "Medium":
                return "#fef9c3";
            default:
                return "#dcfce7";
        }
    };

    return (
        <>
            <style>
                {`
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }

                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                        background: linear-gradient(135deg, #fef9e6 0%, #fff4e0 100%);
                    }

                    .nlp-wrapper {
                        padding-top: 100px;
                        padding-left: 40px;
                        padding-right: 40px;
                        padding-bottom: 80px;
                        min-height: 100vh;
                    }

                    .nlp-container {
                        max-width: 1000px;
                        margin: 0 auto;
                    }

                    /* Header */
                    .header-section {
                        margin-bottom: 32px;
                    }

                    .main-title {
                        font-size: 32px;
                        font-weight: 700;
                        color: #b45309;
                        margin-bottom: 8px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }

                    .subtitle {
                        color: #9b6b3e;
                        font-size: 16px;
                        line-height: 1.5;
                        margin-bottom: 24px;
                    }

                    /* Info Box */
                    .info-box {
                        background: #fff3d1;
                        border-left: 4px solid #f59e0b;
                        padding: 16px 20px;
                        border-radius: 12px;
                        margin-bottom: 30px;
                    }

                    .info-box strong {
                        color: #b45309;
                    }

                    /* Card */
                    .card {
                        background: white;
                        border-radius: 20px;
                        padding: 28px;
                        border: 1px solid #ffeaaf;
                        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.08);
                        margin-bottom: 30px;
                        transition: all 0.3s ease;
                    }

                    .card:hover {
                        box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.15);
                        border-color: #fde047;
                    }

                    .card-header {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        margin-bottom: 20px;
                        padding-bottom: 16px;
                        border-bottom: 2px solid #fef3c7;
                    }

                    .card-icon {
                        font-size: 28px;
                    }

                    .card-title {
                        font-size: 20px;
                        font-weight: 600;
                        color: #b45309;
                    }

                    /* Input Groups */
                    .input-group {
                        margin-bottom: 20px;
                    }

                    .input-label {
                        display: block;
                        font-size: 14px;
                        font-weight: 500;
                        color: #9b6b3e;
                        margin-bottom: 8px;
                    }

                    .text-input {
                        width: 100%;
                        max-width: 400px;
                        padding: 12px 16px;
                        border: 1px solid #fde047;
                        border-radius: 12px;
                        font-size: 15px;
                        transition: all 0.2s ease;
                        background: #fffef7;
                    }

                    .text-input:focus {
                        outline: none;
                        border-color: #f59e0b;
                        box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
                    }

                    .language-selector {
                        display: flex;
                        align-items: center;
                        gap: 16px;
                        flex-wrap: wrap;
                        margin-bottom: 20px;
                    }

                    .select-wrapper {
                        position: relative;
                    }

                    .select {
                        padding: 10px 16px;
                        border: 1px solid #fde047;
                        border-radius: 12px;
                        font-size: 14px;
                        background: #fffef7;
                        min-width: 150px;
                        cursor: pointer;
                        appearance: none;
                        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23f59e0b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
                        background-repeat: no-repeat;
                        background-position: right 12px center;
                        background-size: 16px;
                        padding-right: 40px;
                        color: #b45309;
                        font-weight: 500;
                    }

                    .select:focus {
                        outline: none;
                        border-color: #f59e0b;
                    }

                    /* Buttons */
                    .primary-btn {
                        background: #f59e0b;
                        color: white;
                        border: none;
                        padding: 12px 28px;
                        border-radius: 40px;
                        font-weight: 600;
                        font-size: 16px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
                    }

                    .primary-btn:hover {
                        background: #d97706;
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
                    }

                    .primary-btn:disabled {
                        opacity: 0.6;
                        cursor: not-allowed;
                    }

                    /* File Upload */
                    .file-input-wrapper {
                        margin-bottom: 20px;
                    }

                    .file-input {
                        width: 100%;
                        padding: 40px 20px;
                        border: 2px dashed #fde047;
                        border-radius: 16px;
                        background: #fffef7;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        color: #b45309;
                        font-size: 14px;
                        text-align: center;
                    }

                    .file-input:hover {
                        border-color: #f59e0b;
                        background: #fffbe6;
                    }

                    .file-name {
                        margin-top: 8px;
                        font-size: 14px;
                        color: #f59e0b;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                    }

                    /* Translation Result */
                    .translation-result {
                        margin-top: 20px;
                        background: #fffbeb;
                        border-left: 4px solid #f59e0b;
                        padding: 20px;
                        border-radius: 12px;
                        animation: slideIn 0.3s ease;
                    }

                    .translation-text {
                        font-size: 18px;
                        font-weight: 500;
                        color: #b45309;
                        margin-top: 8px;
                        padding: 12px;
                        background: white;
                        border-radius: 10px;
                        border: 1px solid #fde047;
                    }

                    /* Image Result */
                    .image-result {
                        margin-top: 20px;
                        background: #fffbeb;
                        border-left: 4px solid #f59e0b;
                        padding: 20px;
                        border-radius: 12px;
                        animation: slideIn 0.3s ease;
                    }

                    @keyframes slideIn {
                        from {
                            opacity: 0;
                            transform: translateY(10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    .result-meta {
                        display: flex;
                        gap: 20px;
                        font-size: 13px;
                        color: #9b6b3e;
                        margin-bottom: 12px;
                    }

                    .extracted-text {
                        background: white;
                        padding: 16px;
                        border-radius: 10px;
                        border: 1px solid #fde047;
                        font-style: italic;
                        margin: 16px 0;
                        color: #5e3a1a;
                    }

                    .words-container {
                        display: flex;
                        gap: 8px;
                        flex-wrap: wrap;
                        margin: 16px 0;
                    }

                    .word-tag {
                        background: #fef3c7;
                        color: #b45309;
                        padding: 6px 12px;
                        border-radius: 20px;
                        font-size: 13px;
                        font-weight: 500;
                    }

                    .severity-badge {
                        display: inline-block;
                        padding: 8px 16px;
                        border-radius: 30px;
                        font-weight: 600;
                        font-size: 14px;
                        margin-top: 12px;
                    }

                    .confidence-meter {
                        margin-top: 12px;
                        height: 6px;
                        background: #fef3c7;
                        border-radius: 3px;
                        overflow: hidden;
                    }

                    .confidence-fill {
                        height: 100%;
                        background: #f59e0b;
                        border-radius: 3px;
                        transition: width 0.3s ease;
                    }

                    /* Helper Text */
                    .helper-text {
                        font-size: 13px;
                        color: #b86f30;
                        margin-top: 8px;
                    }

                    .suggestion-box {
                        background: #fffbeb;
                        padding: 12px;
                        border-radius: 10px;
                        font-size: 13px;
                        color: #b45309;
                        border: 1px solid #fde047;
                    }

                    /* Stats Grid */
                    .stats-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 20px;
                        margin-top: 30px;
                    }

                    .stat-card {
                        background: white;
                        padding: 20px;
                        border-radius: 16px;
                        border: 1px solid #fde047;
                        text-align: center;
                        transition: all 0.2s ease;
                    }

                    .stat-card:hover {
                        border-color: #f59e0b;
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.1);
                    }

                    .stat-icon {
                        font-size: 24px;
                        margin-bottom: 8px;
                    }

                    .stat-number {
                        font-weight: 700;
                        font-size: 24px;
                        color: #b45309;
                    }

                    .stat-label {
                        font-size: 14px;
                        color: #9b6b3e;
                    }

                    /* Responsive */
                    @media (max-width: 768px) {
                        .nlp-wrapper {
                            padding: 80px 16px 40px;
                        }

                        .main-title {
                            font-size: 28px;
                        }

                        .language-selector {
                            flex-direction: column;
                            align-items: flex-start;
                        }

                        .select {
                            width: 100%;
                        }

                        .result-meta {
                            flex-direction: column;
                            gap: 8px;
                        }

                        .text-input {
                            max-width: 100%;
                        }
                    }
                `}
            </style>

            <div className="nlp-wrapper">
                <div className="nlp-container">
                    {/* Header */}
                    <div className="header-section">
                        <h1 className="main-title">🧠 AI Abuse Detection & Multi-Language Translation</h1>
                        <p className="subtitle">
                            Detect abusive language, translate threats across 10+ Indian languages,
                            and simulate AI-based image analysis for cyber harassment detection.
                        </p>
                    </div>

                    {/* Info Box */}
                    <div className="info-box">
                        <strong>ℹ️ Demo Mode:</strong> This is a demonstration with sample data.
                        Words available: slut, kill, blackmail, fuck, rape. Try them in different languages!
                    </div>

                    {/* Translation Section */}
                    <div className="card">
                        <div className="card-header">
                            <span className="card-icon">🌐</span>
                            <h2 className="card-title">Abuse Language Translator</h2>
                        </div>

                        <div className="input-group">
                            <label className="input-label">Enter abusive word or phrase</label>
                            <input
                                type="text"
                                placeholder="e.g., slut, kill, blackmail, fuck, rape"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                className="text-input"
                            />
                        </div>

                        <div className="language-selector">
                            <div className="select-wrapper">
                                <select
                                    value={sourceLang}
                                    onChange={(e) => setSourceLang(e.target.value)}
                                    className="select"
                                >
                                    <option value="Auto-Detect">Auto-Detect</option>
                                    {languages.map((lang) => (
                                        <option key={lang} value={lang}>{lang}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleAnalyze}
                            className="primary-btn"
                            disabled={loading}
                        >
                            {loading ? "Analyzing..." : "Analyze Text"}
                        </button>

                        {backendResult && (

                            <div
                                className="translation-result"
                                style={{
                                    borderColor: getSeverityColor(
                                        backendResult.severity
                                    )
                                }}
                            >

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                        gap: "12px"
                                    }}
                                >

                                    <strong style={{ color: "#b45309" }}>Analysis Result:</strong>

                                    <span
                                        className="severity-badge"
                                        style={{
                                            marginTop: 0,
                                            padding: "4px 12px",
                                            background: getSeverityBg(
                                                backendResult.severity
                                            ),
                                            color: getSeverityColor(
                                                backendResult.severity
                                            )
                                        }}
                                    >
                                        {backendResult.severity}
                                        {" "}
                                        ({backendResult.score}%)
                                    </span>

                                </div>


                                <div className="translation-text">

                                    <p>
                                        <strong>Detected Language:</strong>
                                        {" "}
                                        {backendResult.language}
                                    </p>

                                    <p>
                                        <strong>Threat Words:</strong>
                                        {" "}
                                        {backendResult.threatWords?.length > 0
                                            ? backendResult.threatWords.join(", ")
                                            : "None"}
                                    </p>

                                    <p>
                                        <strong>Abusive Words:</strong>
                                        {" "}
                                        {backendResult.abusiveWords?.length > 0
                                            ? backendResult.abusiveWords.join(", ")
                                            : "None"}
                                    </p>

                                    <p>
                                        <strong>AI Score:</strong>
                                        {" "}
                                        {backendResult.aiScore}
                                    </p>

                                </div>


                                <div className="helper-text">
                                    Session ID: {sessionId}
                                </div>

                            </div>

                        )}

                        <div className="suggestion-box" style={{ marginTop: "16px" }}>
                            💡 Try typing: "kill" (English → Hindi) or "slut" (English → Tamil)
                        </div>
                    </div>

                    {/* Simulated Image Analysis */}
                    <div className="card">
                        <div className="card-header">
                            <span className="card-icon">🖼️</span>
                            <h2 className="card-title">AI Image Abuse Detection (Simulated)</h2>
                        </div>

                        <div className="file-input-wrapper">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                id="file-upload"
                                style={{ display: "none" }}
                            />
                            <label htmlFor="file-upload" className="file-input">
                                {selectedFile ? `${selectedFile.name} selected` : "Click to upload or drag and drop an image"}
                            </label>
                            {selectedFile && (
                                <div className="file-name">
                                    📎 {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                                </div>
                            )}
                        </div>

                        {imageResult && (
                            <div className="image-result">
                                <div className="result-meta">
                                    <span>📄 {imageResult.fileName}</span>
                                    <span>📦 {imageResult.fileSize} KB</span>
                                </div>

                                <h4 style={{ marginBottom: "8px", color: "#b45309" }}>🔍 Extracted Text:</h4>
                                <div className="extracted-text">
                                    "{imageResult.extractedText}"
                                </div>

                                <h4 style={{ margin: "16px 0 8px", color: "#b45309" }}>⚠️ Detected Abusive Words:</h4>
                                <div className="words-container">
                                    {imageResult.detectedWords.map((word: string, index: number) => (
                                        <span key={index} className="word-tag">{word}</span>
                                    ))}
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                                    <span
                                        className="severity-badge"
                                        style={{
                                            background: getSeverityBg(imageResult.severity),
                                            color: getSeverityColor(imageResult.severity)
                                        }}
                                    >
                                        Severity: {imageResult.severity}
                                    </span>
                                    <span style={{ fontSize: "14px", color: "#b86f30" }}>
                                        Confidence: {imageResult.confidence}%
                                    </span>
                                </div>

                                <div className="confidence-meter">
                                    <div
                                        className="confidence-fill"
                                        style={{ width: `${imageResult.confidence}%` }}
                                    ></div>
                                </div>

                                {imageResult.severity === "High" || imageResult.severity === "Critical" ? (
                                    <div style={{
                                        marginTop: "20px",
                                        padding: "12px",
                                        background: "#fee2e2",
                                        borderRadius: "10px",
                                        fontSize: "14px",
                                        color: "#b91c1c"
                                    }}>
                                        ⚠️ This content contains {imageResult.severity.toLowerCase()} severity threats.
                                        Consider filing a case or seeking legal consultation.
                                    </div>
                                ) : (
                                    <div style={{
                                        marginTop: "20px",
                                        padding: "12px",
                                        background: "#dcfce7",
                                        borderRadius: "10px",
                                        fontSize: "14px",
                                        color: "#166534"
                                    }}>
                                        ✅ No critical threats detected. Continue monitoring.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="helper-text" style={{ marginTop: "16px" }}>
                            ℹ️ This is a simulated demo. In production, actual AI models would analyze the image.
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">🌐</div>
                            <div className="stat-number">11</div>
                            <div className="stat-label">Languages Supported</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">⚠️</div>
                            <div className="stat-number">50+</div>
                            <div className="stat-label">Abusive Words</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🔍</div>
                            <div className="stat-number">4</div>
                            <div className="stat-label">Severity Levels</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NLPAnalysis;