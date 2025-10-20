import { useEffect, useState } from "react";
import "./index.css";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "react-bootstrap";
import Breadcrum from "../../Layouts/Breadcurm";

const TransactionListPage = () => {
  const { clientId, id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const clientRes = await axios.get(
          `http://localhost:8080/savingsaccounts/${id}/transactions`
        );
        setTransactions(clientRes.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Filter logic
  const filteredTransactions = transactions.filter((txn) => {
    const txnDate = txn.transactionDate.substring(0, 10);
    if (filterDate && txnDate !== filterDate) return false;
    return true;
  });

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

      <div className="transaction-page">
        {/* ===== Header with Filter ===== */}
        <div className="transaction-header">
          <div>
            <h1 className="top mb-1">Transaction History</h1>
            <p className="top1">View all transactions of last 90 days</p>
          </div>

          {/* 🔍 Compact Filters on Right */}
          <div className="filter-section d-flex align-items-center gap-2">
            {/* Date Filter */}
            <div className="custom-input-wrapper">
              <label className="form-label fw-semibold mb-0 small">Date:</label>
              <div className="input-container">
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={filterDate}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    setFilterDate(e.target.value);
                  }}
                />
                {!filterDate && (
                  <span className="input-placeholder">Select date</span>
                )}
              </div>
            </div>

            <Button
              variant="outline-secondary"
              size="sm"
              className="clear-btn date-clear"
              onClick={() => {
                setFilterDate("");
              }}
            >
              Clear
            </Button>
          </div>
        </div>

        {/* ===== Transactions ===== */}
        <div className="transactions-container mb-4">
          <h3 className="transactions-title">Recent Transactions</h3>
          <p className="transactions-subtitle">
            Click on any transaction to raise a dispute
          </p>

          <div className="transactions-list">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((txn) => (
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
                      <p className="transaction-desc">{txn.merchantCategory}</p>
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
                      {txn.transactionDate
                        .substring(0, 10)
                        .split("-")
                        .reverse()
                        .join("-")}
                    </p>
                    {txn.disputable ? (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        disabled
                        title="Dispute already raised for this transaction"
                        className="pill-button"
                      >
                        Dispute Raised{" "}
                        <i className="bi bi-exclamation-circle"></i>
                      </Button>
                    ) : (
                      <Button
                        variant="outline-dark"
                        size="sm"
                        onClick={() =>
                          navigate(
                            `/clients/${clientId}/savingsaccounts/${id}/transactions/${txn.id}`
                          )
                        }
                      >
                        Raise Dispute <i className="bi bi-arrow-right"></i>
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No transactions found for selected date or month.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactionListPage;
