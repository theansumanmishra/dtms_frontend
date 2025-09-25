import "./DisputeConfirmationPage.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const Disputeconfirmation = () => {
  const navigate = useNavigate();
  const { disputeId } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [dispute, setDispute] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const steps = [
    "Your dispute will be reviewed by our specialist team within 1-2 business days.",
    "We will contact the merchant and payment processor to investigate the claim.",
    "You will receive updates on the dispute status via email and through the platform.",
    "Resolution typically occurs within 5-10 business days depending on complexity.",
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
  }, [disputeId, location.pathname]);

  const handleClose = () => setShowModal(false);

  if (loading) return <p>Loading...</p>;
  if (!dispute) return <p>Dispute not found</p>;

  const transactionAmount = dispute?.savingsAccountTransaction?.amount ?? 0;

  const handleSubmit = async (values) => {
    const payload = {
      statusName: values.status,
      subStatusName: values.subStatus,
      refund: values.refund,
      comments: values.comments,
    };
    try {
      const response = await axios.put(
        `http://localhost:8080/disputes/${disputeId}`,
        payload
      );
      toast.success("Dispute reviewed successfully 👍");
      setDispute(response.data);
      setShowModal(false);
    } catch (error) {
      console.error("Error updating dispute:", error);
    }
  };

  return (
    <div className="success-container">
      {showConfirmation && (
        <div>
          <div className="success-icon">✔</div>
          <h1 className="dispute-h1">Dispute Successfully Submitted</h1>
          <p className="subtitle mb-0">
            Your dispute has been created and submitted for review
          </p>
        </div>
      )}

      {/* Summary Card */}
      <div className="summary-card mt-4">
        <div className="d-flex justify-content-between">
          <h4>Dispute Summary</h4>
          {!showConfirmation && dispute.status.name !== "CLOSED" && (
            <Button
              variant="outline-dark"
              size="sm"
              onClick={() => setShowModal(true)}
            >
              Review Dispute
            </Button>
          )}
        </div>

        <div className="summary-grid">
          <div>
            <span className="label">Dispute ID</span>
            <span className="value">DSP202500{dispute.id}</span>
          </div>
          <div>
            <span className="label">Dispute Raised By</span>
            <span className="badge">{dispute.createdBy.name}</span>
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
            <span className="label">Description</span>
            <span className="value">{dispute.description}</span>
          </div>
          <div>
            <span className="label">Merchant Name</span>
            <span className="value">
              {dispute.savingsAccountTransaction.merchantName}
            </span>
          </div>
          <div>
            <span className="label">Payment Rail</span>
            <span className="value">
              {dispute.savingsAccountTransaction.paymentRail}
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
            <span className="label">Disputed Amount</span>
            <span className="value amount">
              ₹ {dispute.savingsAccountTransaction.amount}
            </span>
          </div>
          <div>
            <span className="label">Transaction Reference ID</span>
            <span className="value">
              {dispute.savingsAccountTransaction.paymentRailInstanceId}
            </span>
          </div>
          <div>
            <span className="label">Status</span>
            <span
              className={`my-badge status-${dispute.status.name
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {dispute.status.name}
            </span>
          </div>
          <div>
            <span className="label">Sub Status</span>
            <span
              className={`my-badge substatus-${dispute.subStatus.name
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {dispute.subStatus.name}
            </span>
          </div>

          {dispute.subStatus.name !== "PENDING REVIEW" && (
            <>
              <div>
                <span className="label">Reviewed By</span>
                <span className="badge">{dispute.reviewedBy.name}</span>
              </div>
              <div>
                <span className="label">Refund Amount</span>
                <span className="value">₹ {dispute.refund}</span>
              </div>
              <div>
                <span className="label">Reviewer's Comments</span>
                <span className="value">{dispute.comments}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Transaction Card */}
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
            <span className="label">Debit Card Number</span>
            <span className="value">
              {dispute.savingsAccountTransaction?.debitCard.cardNo}
            </span>
          </div>
          <div>
            <span className="label">Account Number</span>
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

      {/* Action Cards */}
      <div className="action-cards">
        <div className="action-card">
          <div className="icon red">⚠️</div>
          <h3>Raise Another Dispute</h3>
          <p>Need to report another transaction issue?</p>
          <button className="btn red" onClick={() => navigate("/clients")}>
            Create New Dispute
          </button>
        </div>

        <div className="action-card">
          <div className="icon blue">📊</div>
          <h3>View Dispute Dashboard</h3>
          <p>Return to the main dashboard to manage disputes</p>
          <button className="btn dark" onClick={() => navigate("/disputes")}>
            Go to Dashboard
          </button>
        </div>
      </div>

      {/* REVIEW DISPUTE MODAL */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Dispute Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={{
              status: dispute.status?.name || "",
              subStatus: dispute.subStatus?.name || "",
              refund: dispute.refund || "",
              comments: dispute.comments || "",
            }}
            validationSchema={Yup.object({
              status: Yup.string().required("Status is required"),
              subStatus: Yup.string().required("SubStatus is required"),
              refund: Yup.number()
                .typeError("Refund must be a number")
                .required("Refund amount is required")
                .when("subStatus", {
                  is: "PARTIALLY ACCEPTED",
                  then: (schema) =>
                    schema.max(
                      transactionAmount,
                      `Refund cannot exceed transaction amount (${transactionAmount})`
                    ),
                }),
              comments: Yup.string().required("Comment is required"),
            })}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => {
              if (
                values.subStatus === "ACCEPTED" &&
                values.refund !== transactionAmount
              ) {
                setFieldValue("refund", transactionAmount);
              } else if (
                values.subStatus === "REJECTED" &&
                values.refund !== 0
              ) {
                setFieldValue("refund", 0);
              } else if (
                values.subStatus === "PARTIALLY ACCEPTED" &&
                values.refund === transactionAmount
              ) {
                setFieldValue("refund", "");
              }

              return (
                <Form>
                  {/* Status */}
                  <div className="form-group">
                    <label htmlFor="status">Dispute Status *</label>
                    <Field
                      as="select"
                      id="status"
                      name="status"
                      className="form-control"
                    >
                      <option value="">Select a Dispute status...</option>
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
                    <label htmlFor="subStatus">Dispute Sub-Status *</label>
                    <Field
                      as="select"
                      id="subStatus"
                      name="subStatus"
                      className="form-control"
                    >
                      <option value="">Select a Dispute sub-status...</option>
                      <option value="ACCEPTED">ACCEPTED</option>
                      <option value="PARTIALLY ACCEPTED">
                        PARTIALLY ACCEPTED
                      </option>
                      <option value="REJECTED">REJECTED</option>
                    </Field>
                    <ErrorMessage
                      name="subStatus"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  {/* Refund Amount */}
                  <div className="form-group">
                    <label htmlFor="refund">Refund Amount *</label>
                    <Field
                      as="input"
                      type="number"
                      id="refund"
                      name="refund"
                      placeholder="Refund Amount"
                      className="form-control"
                      disabled={
                        values.subStatus === "ACCEPTED" ||
                        values.subStatus === "REJECTED"
                      }
                    />
                    <ErrorMessage
                      name="refund"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  {/* Comments */}
                  <div className="form-group">
                    <label htmlFor="comments">Comment *</label>
                    <Field
                      as="input"
                      id="comments"
                      name="comments"
                      className="form-control"
                      placeholder="Reviewer’s comments"
                    />
                    <ErrorMessage
                      name="comments"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button variant="dark" type="submit">
                      Submit Review
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Disputeconfirmation;
