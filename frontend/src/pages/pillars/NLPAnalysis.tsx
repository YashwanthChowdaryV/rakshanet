import { useState } from "react";
import Navbar from "../../components/Navbar";

const NLPAnalysis = () => {
    const [inputText, setInputText] = useState("");
    const [sourceLang, setSourceLang] = useState("English");
    const [targetLang, setTargetLang] = useState("Hindi");
    const [translated, setTranslated] = useState("");
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

    // Demo abusive dictionary
    const abusiveDictionary: any = {
        English: {
            slut: {
                Hindi: "रंडी",
                Telugu: "వేశ్య",
                Tamil: "வெஷ்யை",
                Kannada: "ವೇಶ್ಯೆ",
                Malayalam: "വേശ്യ",
                Marathi: "रंडी",
                Gujarati: "વેશ્યા",
                Bengali: "বেশ্যা",
                Punjabi: "ਵੇਸ਼ਿਆ",
                Urdu: "طوائف"
            },
            kill: {
                Hindi: "मार डालूँगा",
                Telugu: "చంపేస్తా",
                Tamil: "கொன்றுவிடுவேன்",
                Kannada: "ಕೊಲ್ಲುತ್ತೇನೆ",
                Malayalam: "കൊല്ലും",
                Marathi: "मारून टाकीन",
                Gujarati: "मारी नાખીશ",
                Bengali: "মেরে ফেলবো",
                Punjabi: "ਮਾਰ ਦੇਵਾਂਗਾ",
                Urdu: "مار دوں گا"
            },
            blackmail: {
                Hindi: "ब्लैकमेल",
                Telugu: "బ్లాక్ మెయిల్",
                Tamil: "பிளாக்மெயில்",
                Kannada: "ಬ್ಲ್ಯಾಕ್‌ಮೇಲ್",
                Malayalam: "ബ്ലാക്ക്മെയിൽ",
                Marathi: "ब्लॅकमेल",
                Gujarati: "બ્લેકમેઈલ",
                Bengali: "ব্ল্যাকমেল",
                Punjabi: "ਬਲੈਕਮੇਲ",
                Urdu: "بلیک میل"
            },
            fuck: {
                Hindi: "चूतिया",
                Telugu: "లౌడ్",
                Tamil: "புண்ட",
                Kannada: "ಸುಳ್ಳ",
                Malayalam: "പട്ടി",
                Marathi: "भोसडीचा",
                Gujarati: "ચુતિયો",
                Bengali: "চুদির",
                Punjabi: "ਚੂਤ",
                Urdu: "چوت"
            },
            rape: {
                Hindi: "बलात्कार",
                Telugu: "అత్యాచారం",
                Tamil: "கற்பழிப்பு",
                Kannada: "ಅತ್ಯಾಚಾರ",
                Malayalam: "ബലാത്സംഗം",
                Marathi: "बलात्कार",
                Gujarati: "બળાત્કાર",
                Bengali: "ধর্ষণ",
                Punjabi: "ਬਲਾਤਕਾਰ",
                Urdu: "عصمت دری"
            }
        }
    };

    const handleTranslate = () => {
        const lower = inputText.toLowerCase().trim();

        if (!inputText) {
            alert("Please enter a word to translate");
            return;
        }

        let translationFound = false;
        let engKey = "";

        // If source is English, just find it directly
        if (sourceLang === "English") {
            if (abusiveDictionary["English"][lower]) {
                engKey = lower;
                translationFound = true;
            }
        } else {
            // Find which english key has this word in the source language
            for (const [key, translations] of Object.entries(abusiveDictionary["English"])) {
                if ((translations as any)[sourceLang] === lower || (translations as any)[sourceLang] === inputText.trim()) {
                    engKey = key;
                    translationFound = true;
                    break;
                }
            }
        }

        if (translationFound && engKey) {
            if (targetLang === "English") {
                setTranslated(engKey);
            } else {
                setTranslated(abusiveDictionary["English"][engKey][targetLang] || "Translation not available");
            }
        } else {
            setTranslated("⚠️ Word not found in dictionary. Try: slut, kill, blackmail, fuck, rape (in English or their regional translations)");
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

                    .nlp-wrapper {
                        padding-top: 100px;
                        padding-left: 40px;
                        padding-right: 40px;
                        padding-bottom: 80px;
                        min-height: 100vh;
                        background-color: #f3f4f6;
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
                        color: #111827;
                        margin-bottom: 8px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }

                    .subtitle {
                        color: #6b7280;
                        font-size: 16px;
                        line-height: 1.5;
                        margin-bottom: 24px;
                    }

                    /* Info Box */
                    .info-box {
                        background: #e0f2fe;
                        border-left: 4px solid #0891b2;
                        padding: 16px 20px;
                        border-radius: 8px;
                        margin-bottom: 30px;
                    }

                    .info-box strong {
                        color: #0369a1;
                    }

                    /* Card */
                    .card {
                        background: white;
                        border-radius: 16px;
                        padding: 28px;
                        border: 1px solid #e5e7eb;
                        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                        margin-bottom: 30px;
                        transition: all 0.3s ease;
                    }

                    .card:hover {
                        box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
                    }

                    .card-header {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        margin-bottom: 20px;
                        padding-bottom: 16px;
                        border-bottom: 1px solid #e5e7eb;
                    }

                    .card-icon {
                        font-size: 28px;
                    }

                    .card-title {
                        font-size: 20px;
                        font-weight: 600;
                        color: #111827;
                    }

                    /* Input Groups */
                    .input-group {
                        margin-bottom: 20px;
                    }

                    .input-label {
                        display: block;
                        font-size: 14px;
                        font-weight: 500;
                        color: #4b5563;
                        margin-bottom: 8px;
                    }

                    .text-input {
                        width: 100%;
                        max-width: 400px;
                        padding: 12px 16px;
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                        font-size: 15px;
                        transition: all 0.2s ease;
                    }

                    .text-input:focus {
                        outline: none;
                        border-color: #0891b2;
                        box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
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
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                        font-size: 14px;
                        background: white;
                        min-width: 150px;
                        cursor: pointer;
                        appearance: none;
                        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
                        background-repeat: no-repeat;
                        background-position: right 12px center;
                        background-size: 16px;
                        padding-right: 40px;
                    }

                    .select:focus {
                        outline: none;
                        border-color: #0891b2;
                    }

                    .arrow-icon {
                        font-size: 20px;
                        color: #9ca3af;
                    }

                    /* Buttons */
                    .primary-btn {
                        background: #0891b2;
                        color: white;
                        border: none;
                        padding: 12px 28px;
                        border-radius: 8px;
                        font-weight: 600;
                        font-size: 16px;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    }

                    .primary-btn:hover {
                        background: #0e7490;
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(8, 145, 178, 0.3);
                    }

                    /* File Upload */
                    .file-input-wrapper {
                        margin-bottom: 20px;
                    }

                    .file-input {
                        width: 100%;
                        padding: 40px 20px;
                        border: 2px dashed #cbd5e1;
                        border-radius: 8px;
                        background: #f8fafc;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        color: #64748b;
                        font-size: 14px;
                        text-align: center;
                    }

                    .file-input:hover {
                        border-color: #0891b2;
                        background: #f1f5f9;
                    }

                    .file-name {
                        margin-top: 8px;
                        font-size: 14px;
                        color: #0891b2;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                    }

                    /* Translation Result */
                    .translation-result {
                        margin-top: 20px;
                        background: #ecfdf5;
                        border-left: 4px solid #10b981;
                        padding: 20px;
                        border-radius: 8px;
                        animation: slideIn 0.3s ease;
                    }

                    .translation-text {
                        font-size: 18px;
                        font-weight: 500;
                        color: #065f46;
                        margin-top: 8px;
                        padding: 12px;
                        background: white;
                        border-radius: 6px;
                        border: 1px solid #a7f3d0;
                    }

                    /* Image Result */
                    .image-result {
                        margin-top: 20px;
                        background: #fef3c7;
                        border-left: 4px solid #f59e0b;
                        padding: 20px;
                        border-radius: 8px;
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
                        color: #6b7280;
                        margin-bottom: 12px;
                    }

                    .extracted-text {
                        background: white;
                        padding: 16px;
                        border-radius: 8px;
                        border: 1px solid #fde68a;
                        font-style: italic;
                        margin: 16px 0;
                    }

                    .words-container {
                        display: flex;
                        gap: 8px;
                        flex-wrap: wrap;
                        margin: 16px 0;
                    }

                    .word-tag {
                        background: #fee2e2;
                        color: #b91c1c;
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
                        background: #e5e7eb;
                        border-radius: 3px;
                        overflow: hidden;
                    }

                    .confidence-fill {
                        height: 100%;
                        background: #0891b2;
                        border-radius: 3px;
                        transition: width 0.3s ease;
                    }

                    /* Helper Text */
                    .helper-text {
                        font-size: 13px;
                        color: #9ca3af;
                        margin-top: 8px;
                    }

                    .suggestion-box {
                        background: #f3f4f6;
                        padding: 12px;
                        border-radius: 6px;
                        font-size: 13px;
                        color: #4b5563;
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
                        border-radius: 12px;
                        border: 1px solid #e5e7eb;
                        text-align: center;
                    }

                    .stat-icon {
                        font-size: 24px;
                        margin-bottom: 8px;
                    }

                    .stat-number {
                        font-weight: 600;
                        font-size: 18px;
                        color: #111827;
                    }

                    .stat-label {
                        font-size: 14px;
                        color: #6b7280;
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
                                    {languages.map((lang) => (
                                        <option key={lang} value={lang}>{lang}</option>
                                    ))}
                                </select>
                            </div>

                            <span className="arrow-icon">→</span>

                            <div className="select-wrapper">
                                <select
                                    value={targetLang}
                                    onChange={(e) => setTargetLang(e.target.value)}
                                    className="select"
                                >
                                    {languages.map((lang) => (
                                        <option key={lang} value={lang}>{lang}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleTranslate}
                            className="primary-btn"
                        >
                            Translate
                        </button>

                        {translated && (
                            <div className="translation-result">
                                <strong>Translated Text:</strong>
                                <div className="translation-text">
                                    {translated}
                                </div>
                                <div className="helper-text" style={{ marginTop: "8px" }}>
                                    Source: {sourceLang} → Target: {targetLang}
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

                                <h4 style={{ marginBottom: "8px" }}>🔍 Extracted Text:</h4>
                                <div className="extracted-text">
                                    "{imageResult.extractedText}"
                                </div>

                                <h4 style={{ margin: "16px 0 8px" }}>⚠️ Detected Abusive Words:</h4>
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
                                    <span style={{ fontSize: "14px", color: "#4b5563" }}>
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
                                        borderRadius: "6px",
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
                                        borderRadius: "6px",
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