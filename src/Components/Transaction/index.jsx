import { useEffect, useState } from "react";
import "./index.css";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../Layouts/Header";
import { Button } from "react-bootstrap";
import Breadcrum from "../../Layouts/Breadcurm";

const TransactionListPage = () => {
  const { clientId, id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const clientRes = await axios.get(
          `http://localhost:8080/savingsaccounts/${id}/transactions`
        );
        setTransactions(clientRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching disputes:", error);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="transaction-page">Loading transaction details...</div>
    );
  }

  return (
    <>
      <Breadcrum
        breadCrumItems={[
          { name: "Disputes", path: "/disputes" },
          { name: "Clients", path: "/clients" },
          { name: "Client Details", path: `/clients/${clientId}` },
          { name: "Transaction History", path: "" },
        ]}
      />
      {loading ? (
        <div className="transaction-page">Loading transaction details...</div>
      ) : (
        <div className="transaction-page">
          <h1 className="top">Transaction History</h1>
          <p className="top1">View all transactions of last 90 days</p>
          <div className="transactions-container mb-4">
            <h3 className="transactions-title">Recent Transactions</h3>
            <p className="transactions-subtitle">
              Click on any transaction to raise a dispute
            </p>
            <div className="transactions-list">
              {transactions.length > 0 ? (
                transactions.map((txn) => (
                  <div key={txn.id} className="transaction-row">
                    <div className="transaction-left">
                      <div className="transaction-icon">
                        {txn.transactionMode === "ATM" ? (
                          <i className="bi bi-bank"></i>
                        ) : (
                          <i className="bi bi-credit-card"></i>
                        )}
                      </div>

                      <div className="transaction-details">
                        <h5 className="transaction-title text-danger">
                          {txn.merchantName}
                        </h5>
                        <p className="transaction-desc">
                          {txn.merchantCategory}
                        </p>
                        <span className="transaction-id">
                          Transaction ID: TXN202500{txn.id}
                        </span>
                      </div>
                    </div>
                    <div className="transaction-right">
                      <p
                        className={
                          txn.transactionType === "DEBIT"
                            ? "transaction-amount text-danger"
                            : "transaction-amount text-success"
                        }
                      >
                        ₹{" "}
                        {Number(txn.amount || 0).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <p className="transaction-date">
                        {txn.transactionDate.substring(0, 10)}
                      </p>
                      <Button
                        variant="outline-dark"
                        size="sm"
                        onClick={() =>
                          navigate(
                            `/clients/${clientId}/savingsaccounts/${id}/transactions/${txn.id}`
                          )
                        }
                      >
                        View Details <i className="bi bi-arrow-right"></i>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No transactions available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionListPage;
