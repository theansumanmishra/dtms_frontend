import "./DisputeConfirmationPage.css";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Breadcrum from "../../Layouts/Breadcurm";

const DisputeConfirmation = () => {
  const navigate = useNavigate();
  const { disputeId } = useParams();
  const [loading, setLoading] = useState(true);
  const [dispute, setDispute] = useState(null);
  const [searchParams, _setSearchParams] = useSearchParams();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);

  const steps = [
    "Your dispute will be reviewed by our specialist team within 1-2 business days.",
    "We will contact the merchant and payment processor to investigate the claim.",
    "You will receive updates on the dispute status via email and through the platform.",
    "Resolution typically occurs within 5-10 business days depending on complexity.",
  ];

  const transactionAmount = dispute?.savingsAccountTransaction?.amount ?? 0;

  //GET DISPUTE DETAILS
  useEffect(() => {
    setShowConfirmation(searchParams.get("showConfirmation") === "true");
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
  }, [disputeId, searchParams]);

  //GET USER DETAILS
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await axios.get("http://localhost:8080/users/me");
        setUser(userData.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  const handleClose = () => setShowModal(false);

  const handleSubmit = async (values, isInitialStage) => {
    const isInitialReview =
      dispute.status?.name === "INITIATED" ||
      dispute.subStatus?.name === "PENDING_REVIEW" ||
      dispute.subStatus?.name === "UNDER_REVIEW";

    const payload = {
      statusName: values.status || (isInitialReview ? "IN_PROGRESS" : "CLOSED"),
      subStatusName:
        values.subStatus || (isInitialReview ? "UNDER_REVIEW" : "ACCEPTED"),
      refund: values.refund,
      comments: values.comments,
      vendorVerified: values.vendorVerified,
    };

    try {
      const response = await axios.put(
        `http://localhost:8080/disputes/${disputeId}`,
        payload
      );

      if (isInitialStage) {
        toast.info("Dispute sent for vendor verification");
      } else {
        toast.success("Dispute reviewed successfully");
      }
      setDispute(response.data);
      setShowModal(false);
    } catch (error) {
      console.error("Error updating dispute:", error);
      toast.error("Failed to update dispute ❌");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!dispute) return <p>Dispute not found</p>;

  const isInitialReview =
    dispute.status?.name === "INITIATED" ||
    dispute.subStatus?.name === "PENDING_REVIEW";

  return (
    <div>
      {!showConfirmation && (
        <Breadcrum
          breadCrumItems={[
            { name: "Disputes", path: "/disputes" },
            { name: "Dispute Details", path: "" },
          ]}
        />
      )}
      <div className="success-container">
        {showConfirmation && (
          <div>
            <div className="success-icon">
              <img
                src="/public/success-vmake-unscreen.gif"
                style={{ width: "150px", height: "150px" }}
                alt="✔"
              />
            </div>
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
            {!showConfirmation &&
              dispute.status.name !== "CLOSED" &&
              user?.roles?.includes("DISPUTE_MANAGER") && (
                <Button
                  variant="outline-dark"
                  size="sm"
                  onClick={() => setShowModal(true)}
                >
                  Review Dispute
                </Button>
              )}
          </div>

          <div className="summary-grid pt-2">
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
                {dispute.createdDate.split("-").reverse().join("-")}
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
                {dispute.savingsAccountTransaction.transactionDate
                  .substring(0, 10)
                  .split("-")
                  .reverse()
                  .join("-")}
              </span>
            </div>
            <div>
              <span className="label">Disputed Amount</span>
              <span className="value amount">
                ₹ {Number(dispute.savingsAccountTransaction.amount).toFixed(2)}
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
                className={`my-badge status-${dispute.status.name.toLowerCase()}`}
              >
                {dispute.status.name.replace("_", " ")}
              </span>
            </div>
            <div>
              <span className="label">Sub Status</span>
              <span
                className={`my-badge substatus-${dispute.subStatus.name.toLowerCase()}`}
              >
                {dispute.subStatus.name.replace("_", " ")}
              </span>
            </div>
            {dispute.status.name == "CLOSED" && (
              <div>
                <span className="label">Refund Amount</span>
                <span className="value">₹ {dispute.refund}</span>
              </div>
            )}
            {dispute.subStatus.name !== "PENDING_REVIEW" && (
              <>
                <div>
                  <span className="label">Reviewed By</span>
                  <span className="badge">{dispute.reviewedBy.name}</span>
                </div>

                <div className="full-width">
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
                {
                  dispute.savingsAccountTransaction?.savingsAccount
                    .accountNumber
                }
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
        {showConfirmation && (
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
              <h3>View Dispute History</h3>
              <p>Return to the dispute page to manage disputes</p>
              <button
                className="btn dark"
                onClick={() => navigate("/disputes")}
              >
                Go to Disputes
              </button>
            </div>
          </div>
        )}

        {/* SINGLE MODAL HANDLING BOTH STEPS */}
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              {isInitialReview ? "Initial Review" : "Final Review"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              enableReinitialize
              initialValues={
                isInitialReview
                  ? {
                      status: "IN_PROGRESS",
                      subStatus: "UNDER_REVIEW",
                      comments: "",
                    }
                  : {
                      status: "CLOSED",
                      subStatus: "",
                      refund: "",
                      comments: "",
                      vendorVerified: false,
                    }
              }
              validationSchema={
                isInitialReview
                  ? Yup.object({
                      status: Yup.string().required("Status is required"),
                      subStatus: Yup.string().required(
                        "Sub-Status is required"
                      ),
                      comments: Yup.string().required("Comment is required"),
                    })
                  : Yup.object({
                      status: Yup.string().required("Status is required"),
                      subStatus: Yup.string().required(
                        "Sub-Status is required"
                      ),
                      refund: Yup.number()
                        .typeError("Refund must be a number")
                        .when("subStatus", {
                          is: "PARTIALLY_ACCEPTED",
                          then: (schema) =>
                            schema
                              .required("Refund is required")
                              .max(
                                transactionAmount,
                                `Refund cannot exceed ${transactionAmount}`
                              ),
                        }),
                      vendorVerified: Yup.boolean().oneOf(
                        [true],
                        "Vendor verification is required"
                      ),
                      comments: Yup.string().required("Comment is required"),
                    })
              }
              onSubmit={(values) => handleSubmit(values, isInitialReview)}
            >
              {({ values, setFieldValue }) => {
                if (!isInitialReview) {
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
                    values.subStatus === "PARTIALLY_ACCEPTED" &&
                    values.refund === transactionAmount
                  ) {
                    setFieldValue("refund", "");
                  }
                }

                return (
                  <Form>
                    {/* Status Dropdown */}
                    <div className="form-group">
                      <label>Status*</label>
                      <Field as="select" name="status" className="form-control">
                        {isInitialReview ? (
                          <option value="IN_PROGRESS">IN-PROGRESS</option>
                        ) : (
                          <option value="CLOSED">CLOSED</option>
                        )}
                      </Field>
                      <ErrorMessage
                        name="status"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    {/* Sub Status Dropdown */}
                    <div className="form-group">
                      <label>Sub-Status*</label>
                      <Field
                        as="select"
                        name="subStatus"
                        className="form-control"
                      >
                        {isInitialReview ? (
                          <option value="UNDER_REVIEW">UNDER REVIEW</option>
                        ) : (
                          <>
                            <option value="">Select Sub-Status</option>
                            <option value="ACCEPTED">ACCEPTED</option>
                            <option value="PARTIALLY_ACCEPTED">
                              PARTIALLY ACCEPTED
                            </option>
                            <option value="REJECTED">REJECTED</option>
                          </>
                        )}
                      </Field>
                      <ErrorMessage
                        name="subStatus"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    {/* Comments */}
                    <div className="form-group">
                      <label>Comments*</label>
                      <Field
                        as="textarea"
                        name="comments"
                        className="form-control"
                        placeholder="Add your review comments"
                      />
                      <ErrorMessage
                        name="comments"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    {/* Refund & Verification (Final Review Only) */}
                    {!isInitialReview && (
                      <>
                        <div className="form-group">
                          <label>Refund Amount*</label>
                          <Field
                            type="number"
                            name="refund"
                            className="form-control"
                            placeholder="Enter eligible refund amount"
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

                        <div className="form-check">
                          <Field
                            type="checkbox"
                            name="vendorVerified"
                            className="form-check-input"
                          />
                          <label className="form-check-label">
                            Claim credentials verified by payment rail vendor*
                          </label>
                        </div>
                      </>
                    )}

                    {/* Buttons */}
                    <div className="d-flex justify-content-between mt-3">
                      <Button variant="secondary" onClick={handleClose}>
                        Close
                      </Button>
                      <Button variant="dark" type="submit">
                        {isInitialReview
                          ? "Send for Vendor Verification"
                          : "Submit Review"}
                      </Button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default DisputeConfirmation;
