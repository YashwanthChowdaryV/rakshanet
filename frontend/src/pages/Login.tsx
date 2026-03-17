import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post("/auth/login", {
                email,
                password,
            });

            const { accessToken, refreshToken, user } = response.data;

            // Store tokens
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("user", JSON.stringify(user));

            alert("Login Successful ✅");

            // Redirect to dashboard
            navigate("/dashboard");
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || "Login Failed ❌");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>
                {`
          body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            background-color: #f9fafb;
          }

          .page-wrapper {
            padding-top: 120px;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .form-card {
            background: white;
            padding: 40px;
            border-radius: 10px;
            width: 400px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          }

          .form-card h2 {
            margin-bottom: 25px;
            text-align: center;
            color: #111827;
          }

          .form-group {
            margin-bottom: 20px;
          }

          .form-group input {
            width: 100%;
            padding: 10px;
            border-radius: 6px;
            border: 1px solid #d1d5db;
            font-size: 14px;
          }

          .form-group input:focus {
            outline: none;
            border-color: #2563eb;
          }

          .btn-primary {
            width: 100%;
            padding: 10px;
            border-radius: 6px;
            border: none;
            background-color: #2563eb;
            color: white;
            font-weight: 500;
            cursor: pointer;
            transition: 0.3s;
          }

          .btn-primary:hover {
            background-color: #1d4ed8;
          }

          .btn-primary:disabled {
            background-color: #9ca3af;
            cursor: not-allowed;
          }

          .form-footer {
            text-align: center;
            margin-top: 15px;
            font-size: 14px;
          }

          .form-footer a {
            color: #2563eb;
            text-decoration: none;
          }

          .form-footer a:hover {
            text-decoration: underline;
          }
        `}
            </style>

            <Navbar />

            <div className="page-wrapper">
                <form className="form-card" onSubmit={handleSubmit}>
                    <h2>Login to RakshaNet</h2>

                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <div className="form-footer">
                        Don’t have an account? <Link to="/register">Register</Link>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Login;