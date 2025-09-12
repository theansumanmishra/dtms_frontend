import React from 'react'
import './AboutForm.css'
import Photo from '/Users/myOff/Downloads/DTMS/src/assets/images/b394a280c91d-audit-dqs-shutterstock-2009960414.jpg';
import { useNavigate } from 'react-router';
import { FaFileAlt, FaUsersCog, FaCreditCard, FaShieldAlt, FaChartBar, FaHeadset } from "react-icons/fa";



const AboutForm = () => {
  const navigate = useNavigate();

  return (
    <div className='about-page'>
        <div className='about-heading'>
            <h1>About BankSecure</h1>
            <p>We provide comprehensive banking dispute management solutions designed specifically for <br/> financial institutions and their teams</p>
        </div>


{/*       Our Mission        */}
 <div className="mission-section">
      <div className="mission-content">
        <h1>Our Mission</h1>
        <p>
          To streamline the banking dispute resolution process through innovative
          technology, ensuring faster resolution times and improved customer
          satisfaction while maintaining the highest security standards.
        </p>
        <p>
          Our platform is built by banking professionals who understand the
          complexities of dispute management and the need for efficient, secure,
          and compliant solutions.
        </p>
        <button className="get-started-btn" onClick={() => navigate('/login')}>Get Started Today</button>
      </div>

      <div className="mission-image">
        <img src={Photo} alt="Our Mission" />
      </div>
    </div>


     {/*      Platform Features     */}

      <section className="features-section">
        <h2 className="features-title">Platform Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><FaFileAlt /></div>
            <h3>Dispute Tracking</h3>
            <p>Complete tracking of all disputes from initiation to resolution with detailed status updates</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaUsersCog /></div>
            <h3>Client Management</h3>
            <p>Comprehensive client profiles with linked accounts and transaction history</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaCreditCard /></div>
            <h3>Card Integration</h3>
            <p>Direct integration with debit card systems for transaction analysis and dispute creation</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaShieldAlt /></div>
            <h3>Security First</h3>
            <p>Bank-grade security with encrypted data transmission and secure authentication</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaChartBar /></div>
            <h3>Analytics Dashboard</h3>
            <p>Comprehensive analytics and reporting for dispute trends and resolution metrics</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaHeadset /></div>
            <h3>24/7 Support</h3>
            <p>Round-the-clock technical support and assistance for all platform users</p>
          </div>
        </div>
      </section>
  


       {/*      Aboutlast  */}
          <div className='about-last'>
            <h1>Ready to Transform Your Dispute Management ?</h1>
            <p>Join financial institutions worldwide who trust BankSecure for their dispute management needs</p>
        </div>
    </div>
  );
};

export default AboutForm;