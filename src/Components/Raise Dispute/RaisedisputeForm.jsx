import "./RaisedisputeForm.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";

const RaisedisputeForm = ({ onCancelClick}) => {
  const navigate = useNavigate();

  //states
  const { savingsAccountId, transactionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [reasons, setReasons] = useState([]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/disputes/reasons");
        setReasons(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [savingsAccountId, transactionId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  //Validation Schema using Yup
  const validationSchema = Yup.object({
    date: Yup.date()
      .max(new Date(), "Dispute date cannot be in the future")
      .required("Dispute date is required"),
    source: Yup.string().required("Dispute source is required"),
    reason: Yup.string().required("Dispute reason is required"),
    description: Yup.string().required("Dispute description is required"),
  });

  // Initial values
  const initialValues = {
    date: "",
    source: "",
    reason: "",
    description: "",
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Submit handler
  const handleSubmit = async (values) => {
    console.log("Form Submitted:", values);

    const payload = {
      savingsAccountTransaction: { id: transactionId },
      source: values.source,
      reason: values.reason,
      description: values.description,
    };

    try {
      const response = await axios.post(`http://localhost:8080/disputes`, payload);
      console.log("Payload Sent:", JSON.stringify(payload));
      const disputeId = response.data.id;

      navigate(`/disputes/${disputeId}/confirmation`);                   {/* DISPUTE CNF PAGE CALL */}
      setTimeout(() => toast.success("Dispute submitted successfully 🎉"), 300);
    } catch (error) {
      console.error("Error submitting dispute:", error);
    }
  };

  return (
    <div className="raise-dispute page mt-3">
      <div className="row gap-4 px-5">
        <div className="col card p-4">
          <h1>Create Dispute</h1>
          <p className="subtitle">
            Fill in the dispute details to submit your claim
          </p>

          {/*Wrap form in Formik */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form>
                {/* DISPUTE RAISED DATE */}
                <div className="form-group">
                  <label htmlFor="date">
                    Dispute Raised Date <span className="required">*</span>
                  </label>
                  <Field type="date" id="date" name="date" />
                  <ErrorMessage
                    name="date"
                    component="div"
                    className="text-danger"
                    max={today}
                  />
                </div>

                {/* DISPUTE SOURCE */}
                <div className="form-group">
                  <label htmlFor="source">
                    Dispute source <span className="required">*</span>
                  </label>
                  <Field as="select" id="source" name="source">
                    <option value="">Select a dispute source...</option>
                    <option value="Branch Visit">Branch Visit</option>
                    <option value="Email">Email</option>
                    <option value="Phone Call">Phone Call</option>
                  </Field>
                  <ErrorMessage
                    name="source"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* DISPUTE REASON */}
                <div className="form-group">
                  <label htmlFor="reason">
                    Dispute Reason <span className="required">*</span>
                  </label>
                  <Field as="select" id="reason" name="reason">
                    <option value="">Select a dispute reason...</option>
                    {reasons.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="reason"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* DISPUTE DESCRIPTION */}
                <div className="form-group">
                  <label htmlFor="description">
                    Dispute description <span className="required">*</span>
                  </label>
                  <Field
                    as="input"
                    id="description"
                    name="description"
                    className="form-control"
                    placeholder="Dispute Description"
                  ></Field>
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div className="d-flex justify-content-between">
                  <Button
                    variant="outline-dark"
                    onClick={() => onCancelClick(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="dark" type="submit">
                    Submit Dispute
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default RaisedisputeForm;
