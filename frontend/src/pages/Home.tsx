import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <>
            <style>
                {`
          body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            background-color: #f9fafb;
          }

          .home-wrapper {
            padding-top: 100px; /* space for fixed navbar */
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            text-align: center;
          }

          .hero-content {
            max-width: 800px;
          }

          .hero-content h1 {
            font-size: 42px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 20px;
          }

          .hero-content h1 span {
            display: block;
            color: #2563eb;
            margin-top: 10px;
          }

          .hero-content p {
            font-size: 18px;
            color: #4b5563;
            margin-bottom: 40px;
            line-height: 1.6;
          }

          .hero-buttons {
            display: flex;
            justify-content: center;
            gap: 20px;
          }

          .btn-primary {
            background-color: #2563eb;
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            text-decoration: none;
          }

          .btn-primary:hover {
            background-color: #1d4ed8;
          }

          .btn-secondary {
            border: 1px solid #d1d5db;
            padding: 10px 20px;
            border-radius: 6px;
            text-decoration: none;
            color: #374151;
          }

          .btn-secondary:hover {
            background-color: #f3f4f6;
          }
        `}
            </style>

            <Navbar />

            <div className="home-wrapper">
                <div className="hero-content">
                    <h1>
                        Intelligent Cyber Safety
                        <span>Built for Institutions</span>
                    </h1>

                    <p>
                        RakshaNet empowers students and organizations with AI-driven
                        harassment reporting, legal support, therapy sessions, and
                        secure case management — all in one unified platform.
                    </p>

                    <div className="hero-buttons">
                        <Link to="/register" className="btn-primary">
                            Get Started
                        </Link>

                        <Link to="/login" className="btn-secondary">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;