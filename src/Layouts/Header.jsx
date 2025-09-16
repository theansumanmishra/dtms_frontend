import { useNavigate } from "react-router";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";

const CustomNavbar = () => {
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="#">
          <Image
            style={{ height: "150px" }}
            // src="../../../logo.webp"
            // src="../../../logo.png"
            src="../../../dts-logo.png"
            alt="DTMS"/>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link onClick={() => navigate("/dashboard")}>
              Disputes
            </Nav.Link>
            <Nav.Link href="#" onClick={() => navigate("/clients")}>
              Clients
            </Nav.Link>
            <Nav.Link href="#" onClick={() => navigate("/clients")}>
              Pending Reviews
            </Nav.Link>
            {/* <NavDropdown title="Link" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action4">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5">
                Something else here
              </NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
          <Button variant="link" className="text-decoration-none" onClick={() => logOut()}>
            Logout
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
