import { useState } from "react";

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

  const [additionalInputs, setAdditionalInputs] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdditionalChange = (index: number, value: string) => {
    const newInputs = [...additionalInputs];
    newInputs[index] = value;
    setAdditionalInputs(newInputs);
  };

  const addMoreText = () => {
    setAdditionalInputs([...additionalInputs, ""]);
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

      // Append multiple inputs array
      additionalInputs.forEach((input) => {
        if (input.trim()) {
          form.append("multipleInputs[]", input);
        }
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
            background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
          }

          .page-wrapper {
            padding-top: 100px;
            padding-left: 40px;
            padding-right: 40px;
            padding-bottom: 60px;
            min-height: 100vh;
            display: flex;
            justify-content: center;
          }

          .container {
            max-width: 800px;
            width: 100%;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(139, 92, 246, 0.15);
            padding: 40px;
            border: 1px solid #e9d5ff;
          }

          /* ========== Header Styles ========== */
          .header-section {
            margin-bottom: 32px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f3e8ff;
          }

          h2 {
            font-size: 28px;
            font-weight: 700;
            background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 8px;
            letter-spacing: -0.3px;
          }

          .subtitle {
            color: #6b7280;
            font-size: 15px;
            line-height: 1.5;
          }

          /* ========== Form Section Styles ========== */
          .form-section {
            margin-bottom: 32px;
          }

          h3 {
            font-size: 16px;
            font-weight: 700;
            color: #7c3aed;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 2px solid #f3e8ff;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .field-group {
            margin-bottom: 20px;
          }

          label {
            display: block;
            font-size: 14px;
            font-weight: 600;
            color: #5b21b6;
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
            border: 2px solid #f3e8ff;
            border-radius: 12px;
            background: #ffffff;
            transition: all 0.2s ease;
            font-family: inherit;
          }

          input:hover, textarea:hover {
            border-color: #c084fc;
          }

          input:focus, textarea:focus {
            outline: none;
            border-color: #a855f7;
            box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.1);
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
            border: 2px dashed #e9d5ff;
            border-radius: 12px;
            background: #faf5ff;
            cursor: pointer;
            transition: all 0.2s ease;
            color: #8b5cf6;
            font-size: 14px;
            text-align: center;
          }

          .file-input:hover {
            border-color: #a855f7;
            background: #f5f0ff;
          }

          .file-input::file-selector-button {
            display: none;
          }

          .file-list {
            margin-top: 16px;
            background: #faf5ff;
            border-radius: 12px;
            padding: 16px;
          }

          .file-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
            background: #ffffff;
            border: 1px solid #e9d5ff;
            border-radius: 8px;
            margin-bottom: 8px;
          }

          .file-item:last-child {
            margin-bottom: 0;
          }

          .file-name {
            font-size: 14px;
            color: #5b21b6;
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
            color: #9ca3af;
          }

          /* ========== Button Styles ========== */
          .button-group {
            margin-top: 32px;
            padding-top: 24px;
            border-top: 2px solid #f3e8ff;
          }

          button {
            padding: 14px 32px;
            font-size: 16px;
            font-weight: 700;
            border-radius: 40px;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: inherit;
            background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
            color: white;
            width: 100%;
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
          }

          button:hover:not(:disabled) {
            background: linear-gradient(135deg, #b86eff 0%, #8b5cf6 100%);
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
          }

          button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
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
            background: #faf5ff;
            border: 1px solid #e9d5ff;
            border-radius: 12px;
            text-align: center;
          }

          .download-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #7c3aed;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            padding: 10px 20px;
            background: white;
            border-radius: 40px;
            border: 1px solid #e9d5ff;
            transition: all 0.2s ease;
          }

          .download-link:hover {
            background: #faf5ff;
            border-color: #a855f7;
            color: #6d28d9;
          }

          .download-link::before {
            content: "📥";
            font-size: 18px;
          }

          /* ========== Helper Text ========== */
          .helper-text {
            font-size: 13px;
            color: #9ca3af;
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
            background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
            color: white;
            font-size: 12px;
            padding: 2px 8px;
            border-radius: 20px;
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

            {additionalInputs.map((input, index) => (
              <div className="field-group" key={index} style={{ marginTop: "12px" }}>
                <label>Additional Text Evidence {index + 1}</label>
                <textarea
                  placeholder="Paste more messages, emails, or threats here..."
                  value={input}
                  onChange={(e) => handleAdditionalChange(index, e.target.value)}
                  style={{ minHeight: "80px" }}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={addMoreText}
              style={{
                width: "auto",
                padding: "8px 16px",
                fontSize: "14px",
                background: "#faf5ff",
                color: "#7c3aed",
                border: "1px dashed #c084fc",
                marginTop: "10px",
                borderRadius: "40px",
                cursor: "pointer",
                boxShadow: "none"
              }}
            >
              + Add more text evidence
            </button>
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
                  <span style={{ fontWeight: 500, color: '#5b21b6' }}>
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