import { useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import "bootstrap-icons/font/bootstrap-icons.css";

const LoginForm = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordToggled, setPasswordToggled] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/login", {
        username: userId,
        password: password,
      });

      const token = response.data.accessToken;
      const role = response.data.role;

      // Save credentials
      localStorage.setItem("accessToken", token);
      localStorage.setItem("role", role);

      // Navigate based on role
      if (role === "MASTER_ADMIN") {
        navigate("/admin");
      } else if (role === "DISPUTE_MANAGER") {
        navigate("/dashboard");
      } else if (role === "DISPUTE_USER") {
        navigate("/disputes");
      }

      toast.success("Login successful");
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        const message =
          typeof error.response.data === "string"
            ? error.response.data
            : error.response.data?.message || "Something went wrong";

        if (error.response.status === 401) {
          if (message.toLowerCase().includes("inactive")) {
            toast.error("Your account is inactive. Please contact the admin.");
          } else {
            toast.error("Invalid UserID or Password");
          }
        } else {
          toast.error(message);
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    }
    setLoading(false);
  };

  return (
    <>
      <div className="login-page-wrapper mt-5">
        <div className="login-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Welcome Dispute Team Member</h2>
            <p>Please sign in to access the dispute management platform</p>

            <div className="input-group">
              <label htmlFor="userid">
                Login ID <span>*</span>
              </label>
              <input
                type="text"
                id="userid"
                placeholder="Enter LoginId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </div>

            <div className="input-group password-group">
              <label htmlFor="password">
                Password <span>*</span>
              </label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => {
                    setShowPassword(!showPassword);
                    setPasswordToggled(true);
                    setTimeout(() => setPasswordToggled(false), 300);
                  }}
                >
                  {showPassword ? (
                    <i className="bi bi-eye"></i>
                  ) : (
                    <i className="bi bi-eye-slash"></i>
                  )}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className={`btn1 ${passwordToggled ? "btn-animated" : ""}`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="mt-2">
              Forgot your password?
              <span className="blu">Contact Administrator</span>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
