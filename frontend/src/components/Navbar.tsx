import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
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

          .navbar {
            width: 100%;
            background-color: #ffffff;
            border-bottom: 1px solid #e5e7eb;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1000;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
          }

          .navbar-container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 16px 32px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .logo {
            font-size: 24px;
            font-weight: 700;
            color: #2563eb;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            letter-spacing: -0.5px;
          }

          .logo span {
            background: #2563eb;
            color: white;
            font-size: 12px;
            padding: 2px 8px;
            border-radius: 20px;
            font-weight: 500;
            letter-spacing: 0;
          }

          .nav-links {
            display: flex;
            gap: 28px;
            align-items: center;
          }

          .nav-links a {
            text-decoration: none;
            color: #4b5563;
            font-weight: 500;
            font-size: 15px;
            transition: all 0.2s ease;
            position: relative;
          }

          .nav-links a:hover {
            color: #2563eb;
          }

          .nav-links a::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: -4px;
            left: 0;
            background-color: #2563eb;
            transition: width 0.2s ease;
          }

          .nav-links a:hover::after {
            width: 100%;
          }

          .btn-primary {
            background-color: #2563eb;
            color: white !important;
            padding: 8px 20px;
            border-radius: 8px;
            font-weight: 500;
            transition: all 0.2s ease !important;
            box-shadow: 0 2px 4px rgba(37, 99, 235, 0.1);
          }

          .btn-primary:hover {
            background-color: #1d4ed8;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(37, 99, 235, 0.2);
          }

          .btn-primary:hover::after {
            display: none;
          }

          .btn-outline {
            border: 1px solid #e5e7eb;
            padding: 8px 20px;
            border-radius: 8px;
            background: white;
            color: #4b5563;
            font-weight: 500;
            font-size: 15px;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .btn-outline:hover {
            background-color: #f9fafb;
            border-color: #d1d5db;
          }

          /* Dropdown Styles */
          .dropdown-container {
            position: relative;
          }

          .dropdown-trigger {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #4b5563;
            font-weight: 500;
            font-size: 15px;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 6px;
            transition: background-color 0.2s;
          }

          .dropdown-trigger:hover {
            background-color: #f3f4f6;
          }

          .dropdown-trigger svg {
            width: 16px;
            height: 16px;
            transition: transform 0.2s;
          }

          .dropdown-trigger.active svg {
            transform: rotate(180deg);
          }

          .dropdown-menu {
            position: absolute;
            top: 100%;
            right: 0;
            margin-top: 8px;
            background: white;
            min-width: 240px;
            border-radius: 10px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
            border: 1px solid #eef2f6;
            overflow: hidden;
            z-index: 1001;
            animation: dropdownFade 0.2s ease;
          }

          @keyframes dropdownFade {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .dropdown-menu a {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 16px;
            color: #4b5563;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
            border-left: 3px solid transparent;
          }

          .dropdown-menu a:hover {
            background-color: #f8fafc;
            border-left-color: #2563eb;
            color: #2563eb;
          }

          .dropdown-menu a:hover::after {
            display: none;
          }

          .dropdown-menu a svg {
            width: 18px;
            height: 18px;
            color: #9ca3af;
          }

          .dropdown-menu a:hover svg {
            color: #2563eb;
          }

          .dropdown-divider {
            height: 1px;
            background-color: #eef2f6;
            margin: 8px 0;
          }

          /* Mobile Menu */
          .mobile-menu-btn {
            display: none;
            flex-direction: column;
            gap: 6px;
            cursor: pointer;
            padding: 8px;
          }

          .mobile-menu-btn span {
            width: 24px;
            height: 2px;
            background-color: #4b5563;
            transition: all 0.2s;
          }

          .mobile-menu {
            display: none;
          }

          /* Responsive Design */
          @media (max-width: 1024px) {
            .navbar-container {
              padding: 14px 24px;
            }

            .nav-links {
              gap: 20px;
            }
          }

          @media (max-width: 768px) {
            .mobile-menu-btn {
              display: flex;
            }

            .nav-links {
              display: none;
            }

            .mobile-menu {
              display: block;
              position: fixed;
              top: 72px;
              left: 0;
              right: 0;
              background: white;
              border-bottom: 1px solid #eef2f6;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              padding: 16px 24px;
              animation: slideDown 0.3s ease;
            }

            @keyframes slideDown {
              from {
                opacity: 0;
                transform: translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .mobile-menu .nav-links-mobile {
              display: flex;
              flex-direction: column;
              gap: 16px;
            }

            .mobile-menu a {
              text-decoration: none;
              color: #4b5563;
              font-weight: 500;
              font-size: 16px;
              padding: 8px 0;
              border-bottom: 1px solid #f3f4f6;
            }

            .mobile-menu a:last-child {
              border-bottom: none;
            }

            .mobile-menu .btn-primary,
            .mobile-menu .btn-outline {
              text-align: center;
              margin-top: 8px;
            }
          }

          /* Icon Styles */
          .icon-dashboard { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='7' height='7'%3E%3C/rect%3E%3Crect x='14' y='3' width='7' height='7'%3E%3C/rect%3E%3Crect x='3' y='14' width='7' height='7'%3E%3C/rect%3E%3Crect x='14' y='14' width='7' height='7'%3E%3C/rect%3E%3C/svg%3E"); }
          .icon-report { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'%3E%3C/path%3E%3Cpolyline points='14 2 14 8 20 8'%3E%3C/polyline%3E%3Cline x1='16' y1='13' x2='8' y2='13'%3E%3C/line%3E%3Cline x1='16' y1='17' x2='8' y2='17'%3E%3C/line%3E%3Cpolyline points='10 9 9 9 8 9'%3E%3C/polyline%3E%3C/svg%3E"); }
          .icon-cases { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 7h-4.5L15 4H9L8.5 7H4v2h16V7z'%3E%3C/path%3E%3Crect x='4' y='11' width='16' height='10' rx='2'%3E%3C/rect%3E%3C/svg%3E"); }
          .icon-evidence { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'%3E%3C/path%3E%3Cpolyline points='7 10 12 15 17 10'%3E%3C/polyline%3E%3Cline x1='12' y1='15' x2='12' y2='3'%3E%3C/line%3E%3C/svg%3E"); }
          .icon-legal { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'%3E%3C/path%3E%3C/svg%3E"); }
          .icon-therapy { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E"); }
          .icon-academic { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'%3E%3C/path%3E%3Cpath d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'%3E%3C/path%3E%3C/svg%3E"); }
          .icon-resources { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cline x1='12' y1='16' x2='12' y2='12'%3E%3C/line%3E%3Cline x1='12' y1='8' x2='12.01' y2='8'%3E%3C/line%3E%3C/svg%3E"); }
        `}
            </style>

            <header className="navbar">
                <div className="navbar-container">
                    <div className="logo" onClick={() => navigate("/")}>
                        🛡️ RakshaNet
                        <span>BETA</span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="nav-links">
                        <Link to="/">Home</Link>

                        {!token ? (
                            <>
                                <Link to="/login">Login</Link>
                                <Link to="/register" className="btn-primary">
                                    Get Started
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/dashboard">Dashboard</Link>

                                <div className="dropdown-container">
                                    <div
                                        className="dropdown-trigger"
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                    >
                                        Modules
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </div>

                                    {dropdownOpen && (
                                        <>
                                            <div className="dropdown-menu">
                                                <Link to="/report">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                        <polyline points="14 2 14 8 20 8" />
                                                        <line x1="16" y1="13" x2="8" y2="13" />
                                                        <line x1="16" y1="17" x2="8" y2="17" />
                                                        <polyline points="10 9 9 9 8 9" />
                                                    </svg>
                                                    Report Incident
                                                </Link>
                                                <Link to="/cases">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path d="M20 7h-4.5L15 4H9L8.5 7H4v2h16V7z" />
                                                        <rect x="4" y="11" width="16" height="10" rx="2" />
                                                    </svg>
                                                    Case Management
                                                </Link>
                                                <Link to="/evidence">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                        <polyline points="7 10 12 15 17 10" />
                                                        <line x1="12" y1="15" x2="12" y2="3" />
                                                    </svg>
                                                    Evidence Vault
                                                </Link>
                                                <Link to="/legal">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                                    </svg>
                                                    Legal Consultation
                                                </Link>
                                                <Link to="/therapy">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                        <circle cx="12" cy="7" r="4" />
                                                    </svg>
                                                    Therapy Support
                                                </Link>
                                                <Link to="/academic">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                                                    </svg>
                                                    Academic Support
                                                </Link>
                                                <div className="dropdown-divider"></div>
                                                <Link to="/resources">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <circle cx="12" cy="12" r="10" />
                                                        <line x1="12" y1="16" x2="12" y2="12" />
                                                        <line x1="12" y1="8" x2="12.01" y2="8" />
                                                    </svg>
                                                    Awareness & Resources
                                                </Link>
                                                <Link to="/nlp">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                                        <line x1="12" y1="22.08" x2="12" y2="12" />
                                                    </svg>
                                                    AI Abuse Detection
                                                </Link>
                                                <Link to="/linkedin-report">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                                    </svg>
                                                    LinkedIn Report
                                                </Link>
                                            </div>
                                            <div
                                                style={{
                                                    position: 'fixed',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    zIndex: 1000
                                                }}
                                                onClick={() => setDropdownOpen(false)}
                                            />
                                        </>
                                    )}
                                </div>

                                <button className="btn-outline" onClick={handleLogout}>
                                    Logout
                                </button>
                            </>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <div
                        className="mobile-menu-btn"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {dropdownOpen && (
                    <div className="mobile-menu">
                        <div className="nav-links-mobile">
                            <Link to="/" onClick={() => setDropdownOpen(false)}>Home</Link>

                            {!token ? (
                                <>
                                    <Link to="/login" onClick={() => setDropdownOpen(false)}>Login</Link>
                                    <Link to="/register" className="btn-primary" onClick={() => setDropdownOpen(false)}>
                                        Get Started
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/dashboard" onClick={() => setDropdownOpen(false)}>Dashboard</Link>
                                    <Link to="/report" onClick={() => setDropdownOpen(false)}>Report Incident</Link>
                                    <Link to="/cases" onClick={() => setDropdownOpen(false)}>Case Management</Link>
                                    <Link to="/legal" onClick={() => setDropdownOpen(false)}>Legal Consultation</Link>
                                    <Link to="/therapy" onClick={() => setDropdownOpen(false)}>Therapy Support</Link>

                                    <button className="btn-outline" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </header>
        </>
    );
};

export default Navbar;