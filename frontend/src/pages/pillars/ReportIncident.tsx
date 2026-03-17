import { useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../services/api";

const ReportIncident = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        category: "",
        incidentDate: "",
        incidentTime: "",
        location: "",
        description: "",
        offenderName: "",
        offenderUsername: "",
        offenderPlatform: "",
        offenderUrl: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const generateReport = async () => {
        setLoading(true);
        try {
            const form = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                form.append(key, value as string);
            });

            files.forEach((file) => {
                form.append("evidenceFiles", file);
            });

            const res = await api.post("/cases", form, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert(res.data.message || "Incident Reported Successfully. Case created.");
            // Reset form or handle navigation if needed
        } catch (error) {
            alert("Error reporting incident. Please ensure all details are provided.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <style>
                {`
          /* ========== Global Styles ========== */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background-color: #f5f7fa;
          }

          .page-wrapper {
            padding-top: 100px;
            padding-left: 40px;
            padding-right: 40px;
            padding-bottom: 60px;
            min-height: 100vh;
            background-color: #f5f7fa;
            display: flex;
            justify-content: center;
          }

          .container {
            max-width: 800px;
            width: 100%;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
            padding: 40px;
          }

          /* ========== Header Styles ========== */
          .header-section {
            margin-bottom: 32px;
            padding-bottom: 20px;
            border-bottom: 2px solid #eef2f6;
          }

          h2 {
            font-size: 28px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 8px;
            letter-spacing: -0.3px;
          }

          .subtitle {
            color: #64748b;
            font-size: 15px;
            line-height: 1.5;
          }

          /* ========== Form Section Styles ========== */
          .form-section {
            margin-bottom: 32px;
          }

          h3 {
            font-size: 16px;
            font-weight: 600;
            color: #334155;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 1px solid #eef2f6;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }

          .field-group {
            margin-bottom: 20px;
          }

          label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #475569;
            margin-bottom: 6px;
          }

          .required {
            color: #ef4444;
            margin-left: 4px;
          }

          input, textarea {
            width: 100%;
            padding: 12px 16px;
            font-size: 15px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            background: #ffffff;
            transition: all 0.2s ease;
            font-family: inherit;
          }

          input:hover, textarea:hover {
            border-color: #94a3b8;
          }

          input:focus, textarea:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }

          textarea {
            resize: vertical;
            min-height: 120px;
          }

          /* ========== Grid Layout ========== */
          .row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }

          /* ========== File Upload Styles ========== */
          .file-upload-section {
            margin-bottom: 32px;
          }

          .file-input-wrapper {
            position: relative;
            margin-bottom: 12px;
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
            border-color: #2563eb;
            background: #f1f5f9;
          }

          .file-input::file-selector-button {
            display: none;
          }

          .file-list {
            margin-top: 16px;
            background: #f8fafc;
            border-radius: 8px;
            padding: 16px;
          }

          .file-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            margin-bottom: 8px;
          }

          .file-item:last-child {
            margin-bottom: 0;
          }

          .file-name {
            font-size: 14px;
            color: #334155;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .file-name::before {
            content: "📎";
            font-size: 14px;
          }

          .file-size {
            font-size: 12px;
            color: #94a3b8;
          }

          /* ========== Button Styles ========== */
          .button-group {
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #eef2f6;
          }

          button {
            padding: 14px 32px;
            font-size: 16px;
            font-weight: 500;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
            font-family: inherit;
            background: #2563eb;
            color: white;
            width: 100%;
          }

          button:hover:not(:disabled) {
            background: #1d4ed8;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
          }

          button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          /* ========== Loading Spinner ========== */
          .spinner {
            display: inline-block;
            width: 18px;
            height: 18px;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 0.8s linear infinite;
            margin-right: 8px;
            vertical-align: middle;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          /* ========== Download Link ========== */
          .download-section {
            margin-top: 24px;
            padding: 20px;
            background: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 8px;
            text-align: center;
          }

          .download-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #0369a1;
            text-decoration: none;
            font-weight: 500;
            font-size: 16px;
            padding: 10px 20px;
            background: white;
            border-radius: 6px;
            border: 1px solid #bae6fd;
            transition: all 0.2s ease;
          }

          .download-link:hover {
            background: #f0f9ff;
            border-color: #0369a1;
          }

          .download-link::before {
            content: "📥";
            font-size: 18px;
          }

          /* ========== Helper Text ========== */
          .helper-text {
            font-size: 13px;
            color: #94a3b8;
            margin-top: 4px;
          }

          /* ========== Responsive Design ========== */
          @media (max-width: 768px) {
            .page-wrapper {
              padding: 80px 16px 40px;
            }

            .container {
              padding: 24px;
            }

            h2 {
              font-size: 24px;
            }

            .row {
              grid-template-columns: 1fr;
              gap: 0;
            }
          }

          /* ========== File Count Badge ========== */
          .file-count {
            display: inline-block;
            background: #2563eb;
            color: white;
            font-size: 12px;
            padding: 2px 8px;
            border-radius: 12px;
            margin-left: 8px;
          }

          /* ========== Category Input Specific ========== */
          input[name="category"] {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 16px center;
            background-size: 18px;
          }
        `}
            </style>

            <div className="page-wrapper">
                <div className="container">
                    <div className="header-section">
                        <h2>Cyber Incident Escalation Report</h2>
                        <p className="subtitle">
                            Generate a comprehensive incident report with evidence attachments for institutional escalation.
                        </p>
                    </div>

                    {/* Category Section */}
                    <div className="form-section">
                        <h3>Incident Category</h3>
                        <div className="field-group">
                            <label>
                                Category <span className="required">*</span>
                            </label>
                            <input
                                name="category"
                                placeholder="e.g., Cyber Stalking, Online Harassment, Blackmail"
                                onChange={handleChange}
                                value={formData.category}
                            />
                            <span className="helper-text">Specify the type of cyber incident</span>
                        </div>
                    </div>

                    {/* Date & Time Section */}
                    <div className="form-section">
                        <h3>Date & Time of Incident</h3>
                        <div className="row">
                            <div className="field-group">
                                <label>
                                    Date <span className="required">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="incidentDate"
                                    onChange={handleChange}
                                    value={formData.incidentDate}
                                />
                            </div>
                            <div className="field-group">
                                <label>
                                    Time <span className="required">*</span>
                                </label>
                                <input
                                    type="time"
                                    name="incidentTime"
                                    onChange={handleChange}
                                    value={formData.incidentTime}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location Section */}
                    <div className="form-section">
                        <h3>Location</h3>
                        <div className="field-group">
                            <label>
                                Where did this occur? <span className="required">*</span>
                            </label>
                            <input
                                name="location"
                                placeholder="e.g., Instagram, College Campus, Hostel Room"
                                onChange={handleChange}
                                value={formData.location}
                            />
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="form-section">
                        <h3>Incident Description</h3>
                        <div className="field-group">
                            <label>
                                Detailed Description <span className="required">*</span>
                            </label>
                            <textarea
                                name="description"
                                placeholder="Provide a detailed account of what happened. Include timeline, what was said/done, and any other relevant details..."
                                onChange={handleChange}
                                value={formData.description}
                            />
                            <span className="helper-text">Be as specific as possible</span>
                        </div>
                    </div>

                    {/* Offender Details Section */}
                    <div className="form-section">
                        <h3>Offender Details</h3>
                        <div className="field-group">
                            <label>Full Name (if known)</label>
                            <input
                                name="offenderName"
                                placeholder="Enter offender's name"
                                onChange={handleChange}
                                value={formData.offenderName}
                            />
                        </div>

                        <div className="row">
                            <div className="field-group">
                                <label>Username/Handle</label>
                                <input
                                    name="offenderUsername"
                                    placeholder="@username"
                                    onChange={handleChange}
                                    value={formData.offenderUsername}
                                />
                            </div>
                            <div className="field-group">
                                <label>Platform</label>
                                <input
                                    name="offenderPlatform"
                                    placeholder="e.g., Instagram, LinkedIn"
                                    onChange={handleChange}
                                    value={formData.offenderPlatform}
                                />
                            </div>
                        </div>

                        <div className="field-group">
                            <label>Profile URL</label>
                            <input
                                name="offenderUrl"
                                placeholder="https://..."
                                onChange={handleChange}
                                value={formData.offenderUrl}
                            />
                        </div>
                        <span className="helper-text">Provide any known details about the offender</span>
                    </div>

                    {/* Evidence Upload Section */}
                    <div className="file-upload-section">
                        <h3>Supporting Evidence</h3>
                        <div className="file-input-wrapper">
                            <input
                                type="file"
                                multiple
                                accept="image/*,video/*,.pdf,.txt"
                                onChange={handleFileChange}
                                className="file-input"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="file-input">
                                {files.length > 0
                                    ? `${files.length} file(s) selected`
                                    : "Click to upload or drag and drop"}
                            </label>
                        </div>

                        {files.length > 0 && (
                            <div className="file-list">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <span style={{ fontWeight: 500, color: '#334155' }}>
                                        Selected Files
                                    </span>
                                    <span className="file-count">{files.length}</span>
                                </div>
                                {files.map((file, index) => (
                                    <div key={index} className="file-item">
                                        <span className="file-name">{file.name}</span>
                                        <span className="file-size">
                                            {(file.size / 1024).toFixed(1)} KB
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <span className="helper-text">
                            Accepted formats: Images, Videos, PDF, TXT (Max 10MB per file)
                        </span>
                    </div>

                    {/* Generate Button */}
                    <div className="button-group">
                        <button
                            onClick={generateReport}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Generating Report...
                                </>
                            ) : (
                                "Generate Escalation-Ready Report"
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default ReportIncident;