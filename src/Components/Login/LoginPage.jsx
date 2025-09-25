import { useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

const LoginForm = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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
      
      localStorage.setItem("accessToken", token);
      localStorage.setItem("role", role);

      if (role === "DISPUTE_ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
      toast.success("Login successful 🎉");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Invalid UserID or Password ❌");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-page">
        <div className="login-left">
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

              <div className="input-group">
                <label htmlFor="password">
                  Password <span>*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn1" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>

              <p>
                Forgot your password ?
                <span className="blu"> Contact Administrator</span>
              </p>
            </form>
          </div>
        </div>
        <div className="login-right"></div>
      </div>
    </>
  );
};

export default LoginForm;
