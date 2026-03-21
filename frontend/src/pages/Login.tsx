import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

      const role = user.role;

      localStorage.setItem("role", role);

      // role based redirect
      if (role === "counselor") {
        navigate("/counselor");
      }
      else if (role === "lawyer") {
        navigate("/lawyer");
      }
      else if (role === "admin") {
        navigate("/admin");
      }
      else {
        navigate("/dashboard");
      }
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
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-image: url('https://images.unsplash.com/photo-1497864149936-d3163f0c0f4b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bG9naW58ZW58MHx8MHx8fDA%3D');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            background-attachment: fixed;
            min-height: 100vh;
          }

          .page-wrapper {
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
          }

          .form-card {
            background: white;
            padding: 40px;
            border-radius: 20px;
            width: 100%;
            max-width: 450px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: 1px solid rgba(0, 0, 0, 0.05);
          }

          .form-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          }

          .form-card h2 {
            margin-bottom: 30px;
            text-align: center;
            color: #1e40af;
            font-size: 28px;
            font-weight: 600;
            letter-spacing: -0.5px;
            position: relative;
          }

          .form-card h2::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 50px;
            height: 3px;
            background: linear-gradient(90deg, #3b82f6, #1e40af);
            border-radius: 2px;
          }

          .form-group {
            margin-bottom: 25px;
          }

          .form-group input {
            width: 100%;
            padding: 12px 15px;
            border-radius: 12px;
            border: 2px solid #e2e8f0;
            font-size: 15px;
            transition: all 0.3s ease;
            background: white;
            font-family: inherit;
          }

          .form-group input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }

          .form-group input::placeholder {
            color: #94a3b8;
          }

          .btn-primary {
            width: 100%;
            padding: 12px;
            border-radius: 12px;
            border: none;
            background: linear-gradient(135deg, #3b82f6, #1e40af);
            color: white;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: inherit;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
          }

          .btn-primary:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
            background: linear-gradient(135deg, #2563eb, #1e3a8a);
          }

          .btn-primary:active:not(:disabled) {
            transform: translateY(0);
          }

          .btn-primary:disabled {
            background: linear-gradient(135deg, #9ca3af, #6b7280);
            cursor: not-allowed;
            box-shadow: none;
          }

          .form-footer {
            text-align: center;
            margin-top: 25px;
            font-size: 14px;
            color: #4b5563;
          }

          .form-footer a {
            color: #3b82f6;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s ease;
          }

          .form-footer a:hover {
            color: #1e40af;
            text-decoration: underline;
          }

          @media (max-width: 480px) {
            .form-card {
              padding: 30px 25px;
              margin: 0 15px;
            }
            
            .form-card h2 {
              font-size: 24px;
            }
            
            .form-group input {
              padding: 10px 12px;
            }
          }
        `}
      </style>

      <div className="page-wrapper">
        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Welcome Back</h2>
          <p style={{ textAlign: 'center', marginBottom: '25px', color: '#6b7280', fontSize: '14px' }}>
            Login to your RakshaNet account
          </p>

          <div className="form-group">
            <input
              type="email"
              placeholder="📧 Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="🔒 Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "⏳ Logging in..." : "🔐 Login"}
          </button>

          <div className="form-footer">
            Don't have an account? <Link to="/register">Create Account</Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;