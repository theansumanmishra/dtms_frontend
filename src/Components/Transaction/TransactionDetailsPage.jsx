import { useState, useEffect } from "react";
import "./TransactionDetailsPage.css";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { BiSolidInfoSquare } from "react-icons/bi";
import RaisedisputeForm from "../Dispute/RaiseDisputePage";

const TransactiondetailForm = () => {
  const navigate = useNavigate();

  const { savingsAccountId, transactionId } = useParams();
  const [txnDetails, setTxnDetails] = useState({});
  const [similarTxns, setSimilarTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDisputeForm, setShowDisputeForm] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        //Fetch transaction details
        const txnRes = await axios.get(`http://localhost:8080/savingsaccounts/${savingsAccountId}/transactions/${transactionId}`);
        setTxnDetails(txnRes.data);

        //Fetch similar transactions
        const similarRes = await axios.get(`http://localhost:8080/transactions/${transactionId}/similar`);
        setSimilarTxns(similarRes.data);
      } catch (err) {
        console.error("Error fetching transaction data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [savingsAccountId, transactionId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!txnDetails) {
    return <p>No transaction details found.</p>;
  }

  return (
    <div className="transaction-detail-page">
      <div className="transaction-detail-form">
        <div className="detail-container">
          <div className="transaction-header">
            <h2>Transaction Details for TXN202500{txnDetails.id}</h2>
          </div>

          {/* TRANSACTION DETAILS PANE */}
          <div className="transaction-history">
            <div className="transaction-top">
              <div>
                <h3 className="txn-title">{txnDetails.merchantName}</h3>
                <h6>{txnDetails.merchantCategory}</h6>
                <p className="txn-desc">{txnDetails.transactionType}</p>
              </div>
              <div>
                <p className="txn-amount">
                  ₹ {txnDetails.amount.toLocaleString("en-IN")}.00
                </p>
                <p className="txn-date">
                  {txnDetails.transactionDate.substring(0, 10)}
                </p>
              </div>
            </div>

            <div className="detail-transaction-info">
              <div>
                <p className="label">SAVINGS ACCOUNT NUMBER</p>
                <p className="value">{txnDetails.savingsAccount.accountNumber}</p>
              </div>
              <div>
                <p className="label">DEBIT CARD NUMBER</p>
                <p className="value">{txnDetails.debitCard.cardNo}</p>
              </div>
              <div>
                <p className="label">TRANSACTION DATE</p>
                <p className="value">{txnDetails.transactionDate.substring(0, 10)}</p>
              </div>
              <div>
                <p className="label">TRANSACTION TYPE</p>
                <p className="value">{txnDetails.transactionType}</p>
              </div>
              <div>
                <p className="label">TRANSACTION MODE</p>
                <p className="value">{txnDetails.transactionMode}</p>
              </div>
              <div>
                <p className="label">REFERENCE ID</p>
                <p className="value">{txnDetails.paymentRailInstanceId}</p>
              </div>
            </div>
          </div>

          {/* Submit Dispute Card */}
          <div className="dispute-card mt-3">
            <div className="dispute-content">
              <div className="icon-box">
                <BiSolidInfoSquare size={20} />
              </div>
              <div>
                <h3>Do you want to raise a dispute for this transaction?</h3>
                <p>Review all information before submitting your dispute claim</p>
              </div>
            </div>
            <button
              className="btn-dispute"
              onClick={() => setShowDisputeForm(true)}>
              Raise Dispute
            </button>
          </div>
        </div>

        {/* TRANSACTION LISTING */}
        {showDisputeForm ? (
          <div className="txnlist-wrapper">
            <RaisedisputeForm onCancelClick={setShowDisputeForm} clientId={'1'} />                {/* DISPUTE FORM HERE */}
          </div>
        ) : (
          <div className="txnlist-wrapper">
            {similarTxns.length > 0 ? (
              similarTxns.map((txn) => (
                <div className="txnlist-card" key={txn.id}>
                  <div className="txnlist-left">
                    <h3 className="txnlist-title">{txn.merchantName}</h3>
                    <h6>{txn.merchantCategory}</h6>
                    <p className="txnlist-desc">{txn.description}</p>
                    <p className="txnlist-id">Transaction ID: TXN202500{txn.id}</p>
                  </div>
                  <div className="txnlist-right">
                    <p className="txnlist-amount">
                      ₹ {txn.amount.toLocaleString("en-IN")}
                    </p>
                    <p className="txnlist-date">
                      {txn.transactionDate.substring(0, 10)}
                    </p>
                    <p className="txnlist-date">
                      {txnDetails.transactionMode}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No similar transactions found.</p>
            )}{" "}
          </div>
        )}
      </div>

      <div className="details-bottom-actions">
        <button className="back-btn" onClick={() => navigate(`/savingsaccounts/${savingsAccountId}/transactions`)}>
          ← Back to Transactions
        </button>
        <button
          className="dashboard-btn"
          onClick={() => navigate("/dashboard")}>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default TransactiondetailForm;
