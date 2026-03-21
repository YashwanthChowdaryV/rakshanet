import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is trying to register as admin
    if (formData.role === "admin") {
      alert("❌ Sorry, you cannot register as an admin. Admin accounts are created by system administrators only.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", formData);

      const { accessToken, refreshToken, user } = response.data;

      // Store tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      alert("Registration Successful ✅");

      // Redirect to home (or dashboard later)
      navigate("/");
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Registration Failed ❌");
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
            font-family: Arial, Helvetica, sans-serif;
            background-image: url('https://marketplace.canva.com/EAFnfGcKtiM/1/0/1600w/canva-green-illustrative-organic-plant-zoom-virtual-background-fpJFOduK3w4.jpg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            background-attachment: fixed;
            height: 100vh;
            overflow: hidden;
          }

          .page-wrapper {
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
          }

          .form-card {
            background: white;
            padding: 40px;
            border-radius: 10px;
            width: 420px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          }

          .form-card h2 {
            margin-bottom: 25px;
            text-align: center;
            color: #166534;
          }

          .form-group {
            margin-bottom: 20px;
          }

          .form-group input,
          .form-group select {
            width: 100%;
            padding: 10px;
            border-radius: 6px;
            border: 1px solid #d1d5db;
            font-size: 14px;
          }

          .form-group input:focus,
          .form-group select:focus {
            outline: none;
            border-color: #16a34a;
          }

          .btn-primary {
            width: 100%;
            padding: 10px;
            border-radius: 6px;
            border: none;
            background-color: #16a34a;
            color: white;
            font-weight: 500;
            cursor: pointer;
            transition: 0.3s;
          }

          .btn-primary:hover {
            background-color: #15803d;
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
            color: #16a34a;
            text-decoration: none;
          }

          .form-footer a:hover {
            text-decoration: underline;
          }
        `}
      </style>



      <div className="page-wrapper">
        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Create RakshaNET Account</h2>

          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="counselor">Counselor</option>

              <option value="lawyer">Lawyer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          <div className="form-footer">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;