import "./Navbar.css";
import { useNavigate } from "react-router";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h3>BankSecure</h3>
      </div>
      <div className="navbar-middle">
        <h4 className="aboutus" onClick={() => navigate("/")}>
          Home
        </h4>
        <h4 className="aboutus" onClick={() => navigate("/about")}>
          About
        </h4>
      </div>
      <div className="navbar-right">
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    </nav>
  );
};

export default Navbar;
