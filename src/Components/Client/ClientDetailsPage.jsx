import { useState } from "react";
import "./ClientDetailsPage.css";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import DebitCardForm from "../DebitCard/DebitCardPage";
import Button from "react-bootstrap/Button";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

const   ShowClient = () => {
const navigate = useNavigate();

  //States
  const { id } = useParams();  //get dispute ID from route params
  const [client, setClient] = useState({});
  const [loading, setLoading] = useState(false);
  const [savingsAccount, setSavingAccount] = useState({});
  const [debitCards, setDebitCards] = useState([]);

  //Fetch dispute details when component mounts
  useEffect(() => {
    setLoading(true); // reset to page 1 on data fetch
    const fetchData = async () => {
      try {
        const clientRes = await axios.get(
          `http://localhost:8080/clients/${id}`
        );
        setClient(clientRes.data);
        setSavingAccount(clientRes.data.savingsAccount);
        setDebitCards(clientRes.data.savingsAccount.debitCards || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching disputes:", error);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="view-dispute-page">Loading dispute details...</div>;
  }

  return (
    <div className="container emp-profile">
      <div className="row">
        <div className="col-md-4">
          <div className="profile-img">
            <img
              // src="https://www.pngitem.com/pimgs/m/78-786420_icono-usuario-joven-transparent-user-png-png-download.png"
              src="https://cdn3.iconfinder.com/data/icons/avatars-collection/256/47-512.png"
              alt="client img"
            />
          </div>
          <div className="profile-work mt-4">
            <h2>Savings Account Details</h2>
            <div className="client-grid">
              <div className="client-item">
                <span className="label">Account number</span>
                <span className="value">
                  {savingsAccount.accountNumber}
                </span>
              </div>
              <div className="client-item">
                <span className="label">Available Balance</span>
                <span className="value">₹{savingsAccount.balance?.toLocaleString('en-IN')}</span>
              </div>

              <div className="client-item">
                <span className="label">Account creation date</span>
                <span className="value">
                  {savingsAccount.accountCreationDate?.substring(0, 10)}
                </span>
              </div>

              <div className="client-item">
                <span className="label">Is blocked for credit</span>
                <span className="value">
                  {savingsAccount.blockedForCredit ? "Yes" : "No"}
                </span>
              </div>

              <div className="client-item">
                <span className="label">Is blocked for debit</span>
                <span className="value">
                  {savingsAccount.blockedForDebit ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="profile-head">
            <h5>{client.name}</h5>
            <h6>Verified Client</h6>
            <Tabs defaultActiveKey="profile" id="account-tab" className="mb-3">
              <Tab eventKey="profile" title="Profile">
                <div className="tab-pane fade show active"
                  id="home"
                  role="tabpanel"
                  aria-labelledby="home-tab">
                  <div className="row">
                    <div className="col-md-6">
                      <label>Client Id</label>
                    </div>
                    <div className="col-md-6">
                      <p>CLI202500{client.id}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>Name</label>
                    </div>
                    <div className="col-md-6">
                      <p>{client.name}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>Email</label>
                    </div>
                    <div className="col-md-6">
                      <p>{client.email}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>Phone</label>
                    </div>
                    <div className="col-md-6">
                      <p>+91-{client.phone}</p>
                    </div>
                  </div>
                </div>
              </Tab>
              <Tab eventKey="debit-cards" title="Linked Debit Cards">
                <DebitCardForm debitCards={debitCards} />
              </Tab>
            </Tabs>
          </div>
        </div>
        {/* <div className="col-md-2">
            <input
              type="submit"
              className="profile-edit-btn"
              name="btnAddMore"
              value="Edit Profile"
            />
          </div> */}
      </div>
      <div className="text-center">
        <Button
          variant="outline-secondary"
          className="text-decoration-none"
          onClick={() => navigate(`/savingsaccounts/${savingsAccount.id}/transactions`)}>
          Show all transactions
        </Button>
      </div>
    </div>
  );
};
export default ShowClient;
