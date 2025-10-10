import { useState } from "react";
import "./show.css";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import DebitCardForm from "../DebitCard/DebitCardPage";
import Button from "react-bootstrap/Button";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Breadcrum from "../../Layouts/Breadcurm";

const ShowClient = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [client, setClient] = useState({});
  const [loading, setLoading] = useState(false);
  const [savingsAccount, setSavingAccount] = useState({});
  const [debitCards, setDebitCards] = useState([]);

  useEffect(() => {
    setLoading(true);
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
    <div>
      <Breadcrum
        breadCrumItems={[
          { name: "Disputes", path: "/disputes" },
          { name: "Clients", path: "/clients" },
          { name: "Client Details", path: "" },
        ]}
      />
      <div className="container emp-profile">
        <div className="row g-4">
          <div className="col-md-4 card-floating">
            <div className="">
              <div className="profile-img">
                <img
                  src="https://cdn3.iconfinder.com/data/icons/avatars-collection/256/47-512.png"
                  alt="client img"
                />
              </div>
              <div className="profile-work mt-4">
                <h4>Savings Account Details</h4>
                <div className="client-grid">
                  {[
                    {
                      label: "Account Number",
                      value: savingsAccount.accountNumber || "N/A",
                    },
                    {
                      label: "Available Balance",
                      value: `₹${Number(
                        savingsAccount.balance || 0
                      ).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`,
                    },
                    {
                      label: "Account Creation Date",
                      value: savingsAccount.accountCreationDate
                        ? savingsAccount.accountCreationDate
                            .substring(0, 10)
                            .split("-")
                            .reverse()
                            .join("-")
                        : "N/A",
                    },
                    {
                      label: "Blocked for Credit",
                      value: savingsAccount.blockedForCredit ? "Yes" : "No",
                    },
                    {
                      label: "Blocked for Debit",
                      value: savingsAccount.blockedForDebit ? "Yes" : "No",
                    },
                  ].map((item, idx) => (
                    <div className="client-item" key={idx}>
                      <span className="label">{item.label}</span>
                      <span className="value">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Profile Info + Tabs */}
          <div className="col-md-8 profile-right-container">
            <div className="card-floating profile-head">
              <h5>{client.name}</h5>
              <h6 className="verified-label">Verified Client</h6>
              <Tabs
                defaultActiveKey="profile"
                id="account-tab"
                className="mb-3"
              >
                <Tab eventKey="profile" title="Profile">
                  <div className="profile-tab">
                    {[
                      { label: "Client Id", value: `CLI202500${client.id}` },
                      { label: "Name", value: client.name },
                      { label: "Email", value: client.email },
                      { label: "Phone", value: `+91-${client.phone}` },
                    ].map((item, idx) => (
                      <div className="row mb-2" key={idx}>
                        <div className="col-md-6">
                          <label>{item.label}</label>
                        </div>
                        <div className="col-md-6">
                          <p>{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Tab>
                <Tab eventKey="debit-cards" title="Linked Debit Cards">
                  <DebitCardForm
                    debitCards={debitCards}
                    clientName={client.name}
                  />
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <Button
            variant="outline-secondary"
            className="show-transactions-btn"
            onClick={() =>
              navigate(`/clients/${client.id}/savingsaccounts/${savingsAccount.id}/transactions`)
            }
          >
            Show all transactions
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ShowClient;
