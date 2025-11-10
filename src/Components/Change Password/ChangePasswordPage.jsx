import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./ChangePasswordPage.css";
import "bootstrap/dist/css/bootstrap.min.css";

const ForgetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token"); // Get token from URL

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  // Password validation function
  const validatePassword = (password) => {
    const validationErrors = [];
    if (password.length < 8) validationErrors.push("At least 8 characters");
    if (!/[A-Z]/.test(password))
      validationErrors.push("At least one uppercase letter");
    if (!/[a-z]/.test(password))
      validationErrors.push("At least one lowercase letter");
    if (!/[0-9]/.test(password)) validationErrors.push("At least one number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      validationErrors.push("At least one special character (!@#$...)");
    if (/\s/.test(password)) validationErrors.push("No spaces allowed");
    return validationErrors;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validate password fields
    let validationErrors = validatePassword(newPassword);
    if (newPassword !== confirmPassword)
      validationErrors.push("Passwords do not match");
    setErrors(validationErrors);

    if (validationErrors.length > 0) return;
    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/forget-password",
        {
          token,
          newPassword,
        }
      );

      toast.success(response.data.message || "Password changed successfully!");
      setNewPassword("");
      setConfirmPassword("");

      localStorage.removeItem("accessToken");
      localStorage.removeItem("role");
      setTimeout(() => navigate("/loginPage"), 1500);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-page">
      <div className="change-card shadow">
        <div className="change-left">
          <img
            src="https://bootdey.com/img/Content/avatar/avatar7.png"
            alt="User Avatar"
            className="change-avatar"
          />
          <h2 className="change-welcome">Change Your Password</h2>
          <p className="change-info">Securely update your account password</p>
        </div>

        <div className="change-right">
          <form onSubmit={handleChangePassword}>
            {/* New Password */}
            <div className="form-group mb-4">
              <label htmlFor="newPassword">New Password</label>
              <div className="password-wrapper">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-control password-input"
                />
                <i
                  className={`bi ${
                    showNewPassword ? "bi-eye" : "bi-eye-slash"
                  } password-eye`}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                ></i>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="form-group mb-4">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-control password-input"
                />
                <i
                  className={`bi ${
                    showConfirmPassword ? "bi-eye" : "bi-eye-slash"
                  } password-eye`}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                ></i>
              </div>
            </div>

            {/* Validation Errors */}
            {errors.length > 0 && (
              <ul className="text-danger mb-3">
                {errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-change"
              disabled={loading}
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
