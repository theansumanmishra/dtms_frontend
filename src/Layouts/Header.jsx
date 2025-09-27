import { useNavigate } from "react-router";
import profilePic from "../assets/img.png";
import { Navbar, Container, Nav, NavDropdown, Image } from "react-bootstrap";
import { FaSignOutAlt } from "react-icons/fa";

const CustomNavbar = () => {
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const view = () => {
    navigate("/user");
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="/dashboard">
          <Image
            src="../../../dts-logo.png"
            alt="profilePic"
            className="img-fluid"
            style={{
              height: "61px",
              width: "auto", 
              objectFit: "contain",
            }}
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />

        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            <Nav.Link onClick={() => navigate("/disputes")}>Disputes</Nav.Link>
            <Nav.Link onClick={() => navigate("/clients")}>Clients</Nav.Link>
          </Nav>

          <Nav className="ms-auto profile-menu">
            <NavDropdown
              title={
                <div className="profile-pic">
                  <Image
                    style={{ maxHeight: "40px", marginTop: "20px" }}
                    src={profilePic}
                    alt="Profile"
                  />
                </div>
              }
              id="navbarScrollingDropdown"
              align="end"
            >
              <NavDropdown.Item onClick={view}>
                <i class="bi bi-person-workspace"></i> User
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

export default CustomNavbar;
