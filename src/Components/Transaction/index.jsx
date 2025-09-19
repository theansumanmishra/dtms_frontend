import { useEffect, useState } from "react";
import "./index.css";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../Layouts/Header";
import { Button} from "react-bootstrap";

const TransactionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const clientRes = await axios.get(
          `http://localhost:8080/savingsaccounts/${id}/transactions`);
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
      <Header />
      {loading ? (
        <div className="transaction-page">Loading transaction details...</div>
      ) : (
        <div className="transaction-page">
          <h1 className="top">Transaction History</h1>
          <p className="top1">View all transactions of last 90 days</p>
          <div className="transactions-container">
            <h3 className="transactions-title">Recent Transactions</h3>
            <p className="transactions-subtitle">
              Click on any transaction to raise a dispute
            </p>

            <div className="transactions-list">
              {transactions.length &&
                transactions.map((txn) => (
                  <div key={txn.id} className="row border-top pt-3 mb-3">
                    <div className="col-10">
                      <div>
                        <h5 className="text-danger">{txn.merchantName}</h5>
                        <p className="m-0 text-secondary">{txn.merchantCategory}</p>
                        <span className="transaction-id">
                          Transaction ID: TXN202500{txn.id}
                        </span>
                      </div>
                    </div>

                    <div className="col">
                      <p className="transaction-amount mb-1"></p>
                      <p className="d-inline-block mb-0 mr-2">
                        ₹ {txn.amount.toLocaleString("en-IN")}
                      </p>
                      <p className="d-inline-block mx-1"></p>
                      <p
                        className={
                          txn.transactionType === "DEBIT"
                            ? "text-danger d-inline-block mb-0"
                            : "text-success d-inline-block mb-0"
                        }
                      >
                        {txn.transactionType}
                      </p>
                      <p className="transaction-date me-2">
                        {txn.transactionDate.substring(0, 10)}
                      </p>
                      <Button variant="outline-dark"
                        size="sm"
                        onClick={() =>
                          navigate(
                            `/savingsaccounts/${id}/transactions/${txn.id}`
                          )
                        }
                      >
                        View Transaction Details
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionForm;
