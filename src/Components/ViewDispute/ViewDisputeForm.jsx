import { useState } from "react";
import "./ViewDispute.css";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const ViewDispute = () => {
  const navigate = useNavigate();

  //States
  const { id } = useParams(); // ✅ get dispute ID from route params
  const [dispute, setDispute] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch dispute details when component mounts
  useEffect(() => {
    const fetchDispute = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:8080/disputes/${id}`);
        setDispute(res.data);
      } catch (error) {
        console.error("Error fetching dispute details:", error);
        // alert("Dispute not found!");
        setDispute(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDispute();
  }, [id]);

  if (loading) {
    return <div className="view-dispute-page">Loading dispute details...</div>;
  }

  if (!dispute) {
    return (
      <div className="view-dispute-page">
        <h2>Dispute not found</h2>
        <button className="btn outline" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="view-dispute-page">
      <h1 className="h1">View Dispute</h1>
      <h3 className="h3">view detailed information about existing disputes</h3>

      {/* Search Form */}
      <div className="view-dispute-card">
        {/* Header */}
        <div className="view-dispute-header">
          <div>
            <h2>Dispute Details</h2>
            <p className="subtitle">
              Complete information for dispute DSP-2025-00{dispute.id}
            </p>
          </div>

          <div className="status-tags">
            <span className="status closed">{dispute.status.name}</span>
            <span className="sub-status accepted">
              {dispute.subStatus.name}
            </span>
          </div>
        </div>

        {/* Grid Section */}
        <div className="dispute-grid">
          <div>
            <strong>Dispute ID</strong>
            <p>DSP-2025-00{dispute.id}</p>
          </div>
          <div>
            <strong>Status</strong>
            <p className="status-closed">{dispute.status?.name}</p>
          </div>
          <div>
            <strong>Disputed Amount</strong>
            <p className="amount">₹{dispute.disputedAmount}</p>
          </div>
          <div>
            <strong>Sub Status</strong>
            <p className="sub-status-accepted">{dispute.subStatus?.name}</p>
          </div>
          {/* <div>
            <strong>Client ID</strong>
            <p>CLI-00{dispute.client?.id}</p>
          </div> */}
          <div>
            <strong>Savings Account Transaction ID</strong>
            <p>{dispute.savingsAccountTransaction?.id}</p>
          </div>
          <div>
            <strong>Dispute Entry Date</strong>
            <p>{dispute.disputeEntryDate}</p>
          </div>
        </div>

        {/* Summary */}
        {/* <div className="dispute-section">
          <strong>Summary</strong>
          <div className="box">
            {dispute.disputeSummary || "No summary available"}
          </div>
        </div>

        {/* Description */}
        {/* <div className="dispute-section">
          <strong>Description</strong>
          <div className="box">{dispute.disputeDescription}</div>
        </div> */}
        
      </div>

      <div className="button-group">
        <button className="btn outline" onClick={() => navigate("/dashboard")}>
          Search Another Dispute
        </button>
        <button
          className="btn primary"
          onClick={() => navigate(`/review-dispute/${dispute.id}`)}
        >
          ✏️ Review Dispute
        </button>
      </div>
    </div>
  );
};
export default ViewDispute;
