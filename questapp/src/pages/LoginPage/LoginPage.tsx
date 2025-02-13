import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login Failed");
      }

      const data = await response.json();
      if (data.token) {
        login(data.token);
      }

      const prevUrl = localStorage.getItem("returnTo");
      if (prevUrl) {
        localStorage.removeItem("returnTo");
        navigate(prevUrl);
      } else {
        navigate("/jobs");
      }
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Check in with the Guild</h1>
        {errorMessage && <span className="error-message">{errorMessage}</span>}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Check In
          </button>
        </form>
        <p className="register-link">
          First time at the Guild? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
