import { useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const LoginForm = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordToggled, setPasswordToggled] = useState(false);

  const [errors, setErrors] = useState({ userId: "", password: "" });

  const navigate = useNavigate();

  // Validation functions
  const validateUserId = (value) => {
    const regex = /^[A-Za-z0-9_]{4,20}$/;
    if (!value) return "Login ID is required";
    if (!regex.test(value))
      return "Login ID must be 4–20 characters and can contain letters, numbers, and underscores only";
    return "";
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required";
    if (value.length < 4 || value.length > 10)
      return "Password must be 4–10 characters long";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs before sending API request
    const userIdError = validateUserId(userId);
    const passwordError = validatePassword(password);
    setErrors({ userId: userIdError, password: passwordError });

    if (userIdError || passwordError) return; // stop if validation fails

    setLoginLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/login", {
        username: userId,
        password: password,
      });

      const token = response.data.accessToken;
      const role = response.data.role;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");

      localStorage.setItem("accessToken", token);
      localStorage.setItem("role", role);

      if (role === "MASTER_ADMIN") navigate("/admin");
      else if (role === "DISPUTE_MANAGER") navigate("/dashboard");
      else if (role === "DISPUTE_AGENT") navigate("/disputes");

      toast.success("Login successful");
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        const message = "Something went wrong";

        if (error.response.status === 401) {
          if (message.toLowerCase().includes("inactive")) {
            toast.error("Your account is inactive. Please contact the admin.");
          } else {
            toast.error("Invalid UserID or Password");
          }
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    }
    setLoginLoading(false);
  };

  const handleResetPassword = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    setResetLoading(true);
    try {
      await axios.post("http://localhost:8080/reset-link", { email });
      toast.success("Password reset link sent to your email");
      setEmail("");
      
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to send reset email");
      }
    } finally {
      setResetLoading(false);
    }
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
                placeholder="Enter Login ID"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  setErrors({
                    ...errors,
                    userId: validateUserId(e.target.value),
                  });
                }}
                className={errors.userId ? "invalid-input" : ""}
              />
              {errors.userId && <p className="error">{errors.userId}</p>}
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({
                      ...errors,
                      password: validatePassword(e.target.value),
                    });
                  }}
                  className={errors.password ? "invalid-input" : ""}
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
              {errors.password && <p className="error">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className={`btn1 ${passwordToggled ? "btn-animated" : ""}`}
              disabled={loginLoading}
            >
              {loginLoading ? "Logging in..." : "Login"}
            </button>

            <p className="mt-2">
              Forgot your password?
              <span
                className="blu"
                data-bs-toggle="modal"
                data-bs-target="#resetPasswordModal"
                style={{ cursor: "pointer" }}
              >
                {" "}
                Reset Password
              </span>
            </p>
          </form>
        </div>
      </div>

      {/* PASSWORD RESET MODAL */}
      <div
        className="modal fade"
        id="resetPasswordModal"
        tabIndex="-1"
        aria-labelledby="resetPasswordModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" style={{ maxWidth: "350px" }}>
          <div className="modal-content text-center">
            <div className="modal-header h5 text-white bg-primary justify-content-center">
              Password Reset
            </div>
            <div className="modal-body px-4">
              <p className="py-2">
                Enter your email address and we'll send you instructions to
                reset your password.
              </p>

              <div className="mb-3 text-start">
                <label htmlFor="resetEmail" className="form-label fw-semibold">
                  Email address
                </label>
                <input
                  type="email"
                  id="resetEmail"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              <button
                className="btn btn-primary w-100"
                onClick={handleResetPassword}
                disabled={resetLoading}
              >
                {resetLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Sending...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>

              <div className="mt-4">
                <a href="/loginPage" className="text-decoration-none text-dark">
                  Back to Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
