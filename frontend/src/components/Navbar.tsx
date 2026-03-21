import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import NotificationBell from "./NotificationBell";

const Navbar = () => {

  const navigate = useNavigate();

  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

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

/* NAVBAR */

.navbar {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;

  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(6px);

  border-bottom: 1px solid rgba(255,255,255,0.15);
}


/* container */

.navbar-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 16px 32px;

  display: flex;
  justify-content: space-between;
  align-items: center;
}


/* LOGO */

.logo {
  font-size: 24px;
  font-weight: 700;
  color: white;
  cursor: pointer;
}

.logo span {
  background: #dc2626;
  color: white;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 20px;
  margin-left: 6px;
}


/* LINKS */

.nav-links {
  display: flex;
  gap: 28px;
  align-items: center;
}

.nav-links a {
  text-decoration: none;
  color: white;
  font-weight: 500;
  font-size: 15px;
  transition: 0.2s;
}

.nav-links a:hover {
  color: #f87171;
}


/* PRIMARY */

.btn-primary {
  background: #dc2626;
  color: white !important;
  padding: 8px 18px;
  border-radius: 6px;
}

.btn-primary:hover {
  background: #b91c1c;
}


/* OUTLINE */

.btn-outline {
  border: 1px solid white;
  background: transparent;
  color: white;
  padding: 8px 18px;
  border-radius: 6px;
}

.btn-outline:hover {
  background: rgba(255,255,255,0.2);
}


/* DROPDOWN */

.dropdown-container {
  position: relative;
}

.dropdown-trigger {
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.dropdown-trigger svg {
  width: 16px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;

  background: white;
  min-width: 240px;

  border-radius: 8px;
  overflow: hidden;

  box-shadow: 0 10px 25px rgba(0,0,0,0.25);
}

.dropdown-menu a {
  display: block;
  padding: 10px 14px;
  text-decoration: none;
  color: #374151;
}

.dropdown-menu a:hover {
  background: #f3f4f6;
  color: #dc2626;
}

.dropdown-divider {
  height: 1px;
  background: #e5e7eb;
}


/* MOBILE */

.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
}

.mobile-menu-btn span {
  width: 24px;
  height: 2px;
  background: white;
}

.mobile-menu {
  display: none;
}


/* RESPONSIVE */

@media (max-width: 768px) {

  .nav-links {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .mobile-menu {
    display: block;
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;

    background: rgba(0,0,0,0.9);
    padding: 20px;
  }

  .mobile-menu a {
    display: block;
    color: white;
    padding: 10px 0;
    text-decoration: none;
  }

}

`}
      </style>

      <header className="navbar">

        <div className="navbar-container">


          {/* LOGO */}

          <div
            className="logo"
            onClick={() => {

              if (!role) navigate("/");

              else if (role === "counselor")
                navigate("/counselor");

              else if (role === "lawyer")
                navigate("/lawyer");

              else if (role === "admin")
                navigate("/admin");

              else
                navigate("/dashboard");

            }}
          >
            🛡️ RakshaNet <span>BETA</span>
          </div>


          {/* NAV LINKS */}

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

                {/* DASHBOARD ROLE BASED */}

                {role === "student" && <Link to="/dashboard">Dashboard</Link>}
                {role === "counselor" && <Link to="/counselor">Dashboard</Link>}
                {role === "lawyer" && <Link to="/lawyer">Dashboard</Link>}
                {role === "admin" && <Link to="/admin">Dashboard</Link>}


                {/* COUNSELOR MENU */}

                {role === "counselor" && (
                  <>
                    <Link to="/counselor/cases">Cases</Link>
                  </>
                )}

                {/* LAWYER MENU */}

                {role === "lawyer" && (
                  <>
                    <Link to="/lawyer/cases">Cases</Link>
                  </>
                )}

                {/* ADMIN MENU */}
                {role === "admin" && (
                  <>
                    <Link to="/admin/analytics">Analytics</Link>
                    <Link to="/admin/users">Users</Link>
                    <Link to="/admin/logs">Logs</Link>
                  </>
                )}

                {/* STUDENT MODULES ONLY */}

                {role === "student" && (

                  <div className="dropdown-container">

                    <div
                      className="dropdown-trigger"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      Modules
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>

                    {dropdownOpen && (
                      <div className="dropdown-menu">

                        <Link to="/report">Report Incident</Link>
                        <Link to="/cases">Case Management</Link>
                        <Link to="/evidence">Evidence Vault</Link>
                        <Link to="/legal">Legal Consultation</Link>
                        <Link to="/therapy">Therapy Support</Link>
                        <Link to="/academic">Academic Support</Link>

                        <div className="dropdown-divider"></div>

                        <Link to="/resources">Resources</Link>
                        <Link to="/nlp">AI Abuse Detection</Link>
                        <Link to="/linkedin-report">LinkedIn Report</Link>

                      </div>
                    )}

                  </div>

                )}


                <NotificationBell />

                <button
                  className="btn-outline"
                  onClick={handleLogout}
                >
                  Logout
                </button>

              </>
            )}

          </nav>


          <div className="mobile-menu-btn">
            <span></span>
            <span></span>
            <span></span>
          </div>


        </div>

      </header>

    </>
  );
};

export default Navbar;