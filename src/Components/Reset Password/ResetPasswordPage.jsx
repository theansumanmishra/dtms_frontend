import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./ResetPasswordPage.css";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const [tempPassword, settempPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTempPassword, setShowTempPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    const token = new URLSearchParams(window.location.search).get("token");

    if (!tempPassword || !newPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/reset-password",
        {
          token,
          tempPassword,
          newPassword,
        }
      );
      toast.success(response.data || "Password changed successfully!");
      settempPassword("");
      setNewPassword("");

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="reset-page">
        <div className="reset-card shadow">
          <div className="reset-left">
            <img
              src="https://bootdey.com/img/Content/avatar/avatar7.png"
              alt="User Avatar"
              className="reset-avatar"
            />
            <h2 className="reset-welcome">Reset Your Password</h2>
            <p className="reset-info">Securely update your account password.</p>
          </div>
          <div className="reset-right">
            <form onSubmit={handleReset}>
              
              {/* Current Password */}
              <div className="form-group mb-4 position-relative">
                <label htmlFor="tempPassword">Current Password</label>
                <div className="password-wrapper">
                  <input
                    type={showTempPassword ? "text" : "password"}
                    id="tempPassword"
                    placeholder="Enter current password"
                    value={tempPassword}
                    onChange={(e) => settempPassword(e.target.value)}
                    className="form-control password-input"
                  />
                  <i
                    className={`bi ${
                      showTempPassword ? "bi-eye" : "bi-eye-slash"
                    } password-eye`}
                    onClick={() => setShowTempPassword(!showTempPassword)}
                  ></i>
                </div>
              </div>

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

              <button
                type="submit"
                className="btn btn-primary btn-reset"
                disabled={loading}
              >
                {loading ? "Saving..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
