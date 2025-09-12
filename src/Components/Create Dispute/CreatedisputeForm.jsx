import { useState } from "react";
import "./CreatedisputeForm.css";
import { useNavigate } from "react-router";
import { FaUserCircle } from "react-icons/fa";
import { FaCreditCard } from "react-icons/fa";

const clientDatabase = {
  CL1001: {
    name: "Twinkle Sharma",
    phone: "9876543210",
    email: "subuu0509@gmail.com",
    accountstatus: "active",
  },
  CL1002: {
    name: "Riya Mehta",
    phone: "9123456780",
    email: "riya346@gmail.com",
    accountstatus: "active",
  },
  CL1003: {
    name: "Anjali Patel",
    phone: "9988776655",
    email: "anjali478@gmail.com",
    accountstatus: "active",
  },
};

const CreatedisputeForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [clientId, setClientId] = useState("");
  const [clientInfo, setClientInfo] = useState({
    name: "",
    phone: "",
    email: "",
    accountstatus: "",
  });

  const handleClientIdSubmit = (e) => {
    e.preventDefault();
    const clientData = clientDatabase[clientId.trim()];
    if (clientData) {
      setClientInfo(clientData);
      setStep(2);
    } else {
      alert("❌ Client ID not found");
    }
  };

  const handleClientInfoContinue = (e) => {
    e.preventDefault();
    // alert(✅ Client ${clientInfo.name} info confirmed! Ready for next step.);

    navigate("/debitcard", { state: { clientId, clientInfo } });
  };

  return (
    <div className="raise-dispute-page">
      {/* Step 1: Enter Client ID */}
      {step === 1 && (
        <form className="raise-form" onSubmit={handleClientIdSubmit}>
          <div className="raise-dispute-header">
            <h2>Create a New Dispute</h2>
            <p>Start by entering the client ID to initiate a dispute</p>
          </div>

          <div className="dispute-wrapper">
            <div className="New-dispute">
              <h2>Client Information</h2>

              <div className="input-block">
                <label htmlFor="clientId">Client ID</label>
                <input
                  id="clientId"
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="Enter Client ID (e.g.CL1001)"
                  required
                />
              </div>
              <button type="submit">Continue</button>
            </div>
          </div>
        </form>
      )}

      {/* Step 2: Enter Client Info */}
      {step === 2 && (
        <div className="client-details" onSubmit={handleClientInfoContinue}>
          <h1 className="header-h1">Client Details</h1>
          <h3 className="header-h3">
            Verify client information before proceeding
          </h3>

          {/* CLIENT DETAILS PANE */}
          <div className="client-details-card">
            <div className="client-header">
              <div>
                <h2>Client Details</h2>
                <p className="subtitle">Information for client {clientId}</p>
              </div>
              <div className="client-icon">
                <FaUserCircle />
              </div>
            </div>

            <div className="client-grid">
              <div className="client-item">
                <span className="label">Client ID</span>
                <span className="value">{clientId}</span>
              </div>

              <div className="client-item">
                <span className="label">Phone Number</span>
                <span className="value">{clientInfo.phone}</span>
              </div>

              <div className="client-item">
                <span className="label">Full Name</span>
                <span className="value">{clientInfo.name}</span>
              </div>

              <div className="client-item">
                <span className="label">Email Address</span>
                <span className="value">{clientInfo.email}</span>
              </div>
            </div>
          </div>
          <div className="debit-card">
            <div className="debit-icon">
              <FaCreditCard />
            </div>

            <h2>View Linked Debit Cards</h2>
            <p>
              View all debit cards linked to this client's account to proceed
              with dispute creation
            </p>

            <button
              className="btn-danger"
              onClick={() =>
                navigate("/debitcard", { state: { clientId, clientInfo } })
              }
            >
              Show Linked Debit Cards
            </button>
          </div>

          <div className="action-btns">
            <button
              className="btn-primary"
              onClick={() => navigate("/dashboard")}
            >
              Search Another Client
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatedisputeForm;
