import React, { useState } from 'react'
import './Reviewdispute.css'
import { useNavigate } from 'react-router';


const ReviewdisputeForm = () => {
const  navigate = useNavigate();
  const [status, setStatus] = useState("CLOSED");
  const [subStatus, setSubStatus] = useState ("ACCEPTED");


  return (
    <div className='review-dispute-page'>
      <h2 className="h2">Review Dispute</h2>
      <h3 className="h3">Update the status and sub-status of dispute DSP004</h3>
    <div className="review-summary-card">
      <div className="dispute-left">
        <h3>Dispute DSP017</h3>
        <p className="meta">
          Duplicate Charge • Created: <span>2024-01-14</span>
        </p>
      </div>

      <div className="dispute-right">
        <span className="status-tag closed">Current: CLOSED</span>
        <span className="status-tag accepted">ACCEPTED</span>
      </div>
    </div>


<div className="update-status-card">
      <h3>Update Dispute Status</h3>
      
      <div className="form-row">
        {/* Status */}
        <div className="form-group">
          <label>
            Status <span className="required">*</span>
          </label>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            className="form-select"
          >
            <option value="OPEN">INITIATED</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>

        {/* Sub Status */}
        <div className="form-group">
          <label>
            Sub Status <span className="required">*</span>
          </label>
          <select 
            value={subStatus} 
            onChange={(e) => setSubStatus(e.target.value)}
            className="form-select"
          >
            <option value="PENDING">ACCEPTED</option>
            <option value="ACCEPTED">PARTIALLY ACCEPTED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </div>
      </div>
    </div>



<div className="action-buttons">
      {/* Cancel Button */}
      <button type="button" className="btn cancel-btn"
      onClick={() => navigate('/view-dispute')}
      > ← Cancel
      </button>

      {/* Update Button */}
      <button type="submit" className="btn update-btn">
        💾 Update Dispute
      </button>
    </div>
    </div>
  );
};

export default ReviewdisputeForm;