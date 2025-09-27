import "./Navbar.css";
import { useNavigate } from "react-router";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";

const CustomNavbar = () => {
  const navigate = useNavigate();

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="#">
          <Image
            style={{ height: "130px" }}
            src="../../../dts-logo.png"
            alt="DTMS"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link href="#" onClick={() => navigate("/")}>
              Home
            </Nav.Link>
            <Nav.Link href="#" onClick={() => navigate("/about")}>
              About Us
            </Nav.Link>
          </Nav>
          <Button
            variant="link"
            className="navbar-login-btn text-decoration-none"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
