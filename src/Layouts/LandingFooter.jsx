import "./LandingFooter.css";

const LandingFooter = () => {
  return (
    <>
      <div className="footer">
        <div className="banksecure">
          <h5>Banksecure</h5>
          <p>Professional banking dispute</p>
          <p>Management platform for financial</p>
          <p>Institutions</p>
        </div>

        <div>
          <h6>Platform</h6>
          <a className="landing-a" href="/loginPage">
            Login
          </a>
          <br />
          <a className="landing-a" href="/about">
            About Us
          </a>
        </div>

        <div className="support">
          <h6>Support</h6>
          <p>Help Center</p>
          <p>Documentation</p>
          <p>Contact Us</p>
        </div>

        <div className="Legal">
          <h6>Legal</h6>
          <p>Privacy Policy</p>
          <p>Terms of Service</p>
          <p>Compliance</p>
        </div>

        <hr></hr>
        <div className="reserved">
          <p>© 2025 Dispute Tracking & Management System. All rights reserved.</p>
        </div>
      </div>
    </>
  );
};
export default LandingFooter;
