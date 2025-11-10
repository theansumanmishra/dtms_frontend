import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import profilePic from "/profile.jpg";
import { Navbar, Container, Nav, NavDropdown, Image } from "react-bootstrap";
import { FaSignOutAlt } from "react-icons/fa";
import "./Layout.css";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await axios.get("http://localhost:8080/users/me");
        setUser(userData.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  const logOut = () => {
    localStorage.removeItem("accessToken");
    navigate("/loginPage");
  };

  const view = () => {
    navigate("/user");
  };

  return (
    <Navbar expand="lg" className="cool-navbar">
      <Container fluid>
        <Navbar.Brand
          href={
            user && user.roles.includes("DISPUTE_MANAGER") ? "/dashboard" : "#"
          }
          className="brand-logo"
          onClick={(e) => {
            if (!user || !user.roles.includes("DISPUTE_MANAGER")) {
              e.preventDefault();
            }
          }}
        >
          <Image
            src="/dts-logo.png"
            alt="profilePic"
            style={{
              height: "50px",
              width: "auto",
              objectFit: "contain",
              transition: "opacity 0.3s ease",
            }}
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          {user && !user.roles.includes("MASTER_ADMIN") && (
            <Nav className="me-auto my-2 my-lg-0" navbarScroll>
              <Nav.Link
                className="nav-link-custom"
                onClick={() => navigate("/disputes")}
              >
                Disputes
              </Nav.Link>
              <Nav.Link
                className="nav-link-custom"
                onClick={() => navigate("/clients")}
              >
                Clients
              </Nav.Link>
            </Nav>
          )}
          <Nav className="ms-auto profile-menu">
            <NavDropdown
              className="profile-dropdown"
              title={
                <div className="profile-pic">
                  <Image
                    style={{ maxHeight: "40px" }}
                    src={
                      user?.profilePhoto
                        ? `http://localhost:8080${user.profilePhoto}`
                        : profilePic
                    }
                    alt="Profile"
                  />
                </div>
              }
              id="navbarScrollingDropdown"
              align="end"
            >
              <NavDropdown.Item onClick={view}>
                <i className="bi bi-person-workspace"></i> About User
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={logOut}>
                <FaSignOutAlt className="fa-fw" /> Log Out
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
