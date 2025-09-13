import "./Disputeconfirmation.css";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const Disputeconfirmation = () => {
  const navigate = useNavigate();

  //states
  const { disputeId } = useParams();
  const [loading, setLoading] = useState(true);
  const [dispute, setDispute] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const steps = [
    "Your dispute will be reviewed by our specialist team within 1-2 business days",
    "We will contact the merchant and payment processor to investigate the claim",
    "You will receive updates on the dispute status via email and through the platform",
    "Resolution typically occurs within 5-10 business days depending on complexity",
  ];

  useEffect(() => {
    setShowConfirmation(location.pathname.includes("confirmation"));
    const fetchDisputeDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/disputes/${disputeId}`
        );
        setDispute(res.data);
      } catch (err) {
        console.error("Error fetching dispute details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDisputeDetails();
  }, [disputeId]);

  const handleClose = () => {
    setShowModal(false);
  };

  if (loading) return <p>Loading...</p>;
  if (!dispute) return <p>Dispute not found</p>;

  //Validation Schema using Yup
  const validationSchema = Yup.object({
    status: Yup.string().required("Status is required"),
    subStatus: Yup.string().required("SubStatus is required"),
  });

  //Initial values
  const initialValues = {
    status: "",
    subStatus: "",
  };

  // Submit handler
  const handleSubmit = async (values) => {
    console.log("Form Submitted:", values);

    const payload = {
      statusName: values.status,
      subStatusName: values.subStatus,
    };

    try {
      const response = await axios.put(
        `http://localhost:8080/disputes/${disputeId}`,
        payload
      );
      console.log("Payload Sent:", JSON.stringify(payload));
      toast.success("Dispute reviewed successfully 👍");
      setDispute(response.data);
      // await fetchDisputeDetails();
      setShowModal(false);
    } catch (error) {
      console.error("Error updating dispute:", error);
    }
  };

  return (
    <div className="success-container">
      {/* Success Icon */}
      {showConfirmation && (
        <div>
          <div className="success-icon">✔</div>
          {/* Title + Subtitle */}
          <h1 className="dispute-h1">Dispute Successfully Submitted</h1>
          <p className="subtitle mb-0">
            Your dispute has been created and submitted for review
          </p>
        </div>
      )}

      {/* Summary Card */}
      <div className="summary-card mt-4">
        <div className="d-flex justify-content-between">
          <h2>Dispute Summary</h2>
          {dispute.status.name !== "CLOSED" && (
            <Button
              variant="outline-dark"
              size="sm"
              className="text-decoration-none"
              onClick={() => setShowModal(true)}
            >
              Review Dispute
            </Button>
          )}
        </div>

        <div className="summary-grid">
          <div>
            <span className="label">Dispute ID</span>
            <span className="value link">DSP202500{dispute.id}</span>
          </div>
          <div>
            <span className="label">Dispute Raised Date</span>
            <span className="value">
              {dispute.createdDate.substring(0, 10)}
            </span>
          </div>
          <div>
            <span className="label">Dispute Reason</span>
            <span className="value">{dispute.reason}</span>
          </div>
          <div>
            <span className="label">Merchant Name</span>
            <span className="value">
              {dispute.savingsAccountTransaction.merchantName}
            </span>
          </div>
          <div>
            <span className="label">Payment Rail</span>
            <span className="value link">
              {dispute.savingsAccountTransaction.paymentRail}
            </span>
          </div>
          <div>
            <span className="label">Transaction Reference ID</span>
            <span className="value link">
              {dispute.savingsAccountTransaction.paymentRailInstanceId}
            </span>
          </div>

          <div>
            <span className="label">Disputed Amount</span>
            <span className="value amount">
              ₹ {dispute.savingsAccountTransaction.amount}
            </span>
          </div>

          <div>
            <span className="label">Transaction Date</span>
            <span className="value">
              {dispute.savingsAccountTransaction.transactionDate.substring(
                0,
                10
              )}
            </span>
          </div>
          <div>
            <span className="label">Status</span>
            <span className="badge">{dispute.status.name}</span>
          </div>
          <div>
            <span className="label">Sub Status</span>
            <span className="badge">{dispute.subStatus.name}</span>
          </div>
        </div>
      </div>

      <div className="transaction-card">
        <h2>Transaction Details</h2> 
        <div className="transaction-grid">
          <div>
            <span className="label">Transaction ID</span>
            <span className="value">
              TXN202500{dispute.savingsAccountTransaction?.id}
            </span>
          </div>
          <div>
            <span className="label">Debit Card ID</span>
            <span className="value">
              {dispute.savingsAccountTransaction?.debitCard.cardNo}
            </span>
          </div>
          <div>
            <span className="label">Account ID</span>
            <span className="value">
              {dispute.savingsAccountTransaction?.savingsAccount.accountNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      {showConfirmation && (
        <div className="next-steps-card">
          <h2>What Happens Next?</h2>
          <ul>
            {steps.map((step, index) => (
              <li key={index}>
                <span className="step-number">{index + 1}</span>
                <span className="step-text">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="action-cards">
        {/* Raise Another Dispute */}
        <div className="action-card">
          <div className="icon red">
            <span>⚠️</span>
          </div>
          <h3>Raise Another Dispute</h3>
          <p>Need to report another transaction issue?</p>
          <button
            className="btn red"
            onClick={() => navigate("/clients")}
          >
            Create New Dispute
          </button>
        </div>

        {/* View Dashboard */}
        <div className="action-card">
          <div className="icon blue">
            <span>📊</span>
          </div>
          <h3>View Dashboard</h3>
          <p>Return to the main dashboard to manage disputes</p>
          <button className="btn dark" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Dispute Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form>
                {/* Status */}
                <div className="form-group">
                  <label htmlFor="status">
                    Dispute Status <span className="required">*</span>
                  </label>
                  <Field as="select" id="status" name="status">
                    <option value="">Select a Dispute status...</option>
                    <option value="INITIATED">INITIATED</option>
                    <option value="IN-PROGRESS">IN-PROGRESS</option>
                    <option value="CLOSED">CLOSED</option>
                  </Field>
                  <ErrorMessage
                    name="status"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* Sub Status */}
                <div className="form-group">
                  <label htmlFor="subStatus">
                    Dispute Sub-Status <span className="required">*</span>
                  </label>
                  <Field as="select" id="subStatus" name="subStatus">
                    <option value="">Select a Dispute sub-status...</option>
                    <option value="ACCEPTED">ACCEPTED</option>
                    {/* <option value="PARTIALLY ACCEPTED">PARTIALLY ACCEPTED</option> */}
                    <option value="REJECTED">REJECTED</option>
                  </Field>
                  <ErrorMessage
                    name="subStatus"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* BUTTONS */}
                <div className="d-flex justify-content-between">
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="dark" type="submit">
                    Submit Review
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Disputeconfirmation;
