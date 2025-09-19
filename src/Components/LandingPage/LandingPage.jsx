import { useNavigate } from "react-router";
import "./LandingPage.css";
import { FaRegClock } from "react-icons/fa";
import { MdBarChart } from "react-icons/md";
import { MdOutlineVerifiedUser } from "react-icons/md";
import Button from "react-bootstrap/Button";

const LandingForm = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="content1">
        <div className="overlay">
          <div className="landing-content">
            <h1>Secure Banking</h1>
            <h1>Dispute Management</h1>
            <p>
              Efficiently manage and resolve banking disputes with our
              comprehensive platform designed for financial institutions.
            </p>
            <Button className="me-4" onClick={() => navigate("/login")}>
              Access the Platform
            </Button>
            <Button className="learnmore" onClick={() => navigate("/about")}>
              Learn More
            </Button>
            {/* </div> */}
          </div>
        </div>
      </div>

      <div className="content2">
        <div className="middle-content">
          <h1> Comprehensive Dispute Management </h1>
          <p>
            Our platform provides all the tools you need to efficiently handle
            banking disputes from initiation to resolution
          </p>
        </div>
        <div className="cards-container">
          <div className="landing-card">
            <MdOutlineVerifiedUser size={26} />
            <h3> Secure Processing</h3>
            <p>
              Streamlined workflows and automated processes help resolve
              disputes quickly and efficiently
            </p>
          </div>

          <div className="landing-card">
            <FaRegClock size={25} />
            <h3> Fast Resolution</h3>
            <p>
              Track every dispute from initiation to resolution with detailed
              reporting and analytics
            </p>
          </div>

          <div className="landing-card">
            <MdBarChart size={26} />
            <h3> Complete Tracking</h3>
            <p>
              Track the status of your disputes in real-time, with complete
              transparency from start to finish
            </p>
          </div>
        </div>
      </div>
      <div className="content3">
        <div className="get-started">
          <h1> Ready to get started</h1>
          <p>
            Join thousands of businesses already using our dispute management
            platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingForm;
