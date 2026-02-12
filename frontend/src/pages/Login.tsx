import { useState, type ChangeEvent, type FormEvent } from "react";
import { authApi } from "../api/authApi";
import "./Login.css";
import { useNavigate } from "react-router-dom";

import logoMedi from "../assets/logos/MediBookLogo.svg";
import doctorImg from "../assets/images/login-banner.jpg";
import userIcon from "../assets/icons/person.svg";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const data = (await authApi.login(formData)) as any;

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
      }

      if (data.user && data.user.id) {
        const userId = data.user.id;
        const role = data.user.role;

        localStorage.setItem("userId", userId);

        if (role === "doctor") {
          localStorage.setItem("doctorId", userId);
          navigate("/doctor/dashboard");
        } else if (role === "patient") {
          navigate("/patient/dashboard");
        }
           else {
          navigate("/");
        }
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      setErrorMsg(
        error.response?.data?.message || "Invalid username or password!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="login-card">
        {/* Left Side: Form */}
        <div className="login-left">
          <div className="content-box">
            <img src={logoMedi} alt="MediBook Logo" className="logo" />

            <div className="welcome-text">
              <h1>Welcome back 👋</h1>
              <p>Please enter your details to login</p>
            </div>

            {errorMsg && (
              <div
                className="error-alert"
                style={{ color: "#ff4d4f", marginBottom: "10px" }}
              >
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>Username</label>
                <div className="input-field">
                  <img src={userIcon} alt="user" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Password</label>
                <div className="input-field">
                  <input
                    type="password"
                    name="password"
                    placeholder="**********"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? "Processing..." : "Login"}
              </button>

              <div className="divider">Or</div>

              <button
                type="button"
                className="btn-signup"
                onClick={() => navigate("/register")} // Link này phải khớp với path trong App.tsx
              >
                Sign up
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Banner Image */}
        <div className="login-right">
          <img src={doctorImg} alt="Doctors" className="banner-img" />
        </div>
      </div>
    </div>
  );
};

export default Login;
