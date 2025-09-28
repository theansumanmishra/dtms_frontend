import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [disputeStats, setDisputeStats] = useState({
    disputesCreated: 0,
    disputesReviewed: 0,
  });

  useEffect(() => {
    axios
      .get("http://localhost:8080/users/me")
      .then((res) => {
        setUser(res.data);
        return axios.get("http://localhost:8080/my-stats");
      })
      .then((res) => {
        setDisputeStats(res.data);
      })
      .catch((err) => {
        console.error("Failed to load user:", err);
      });
  }, []);

  if (!user) {
    return <p>Loading user profile...</p>;
  }

  return (
    <section className="h-100 gradient-custom-2">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center">
          <div className="col col-lg-9 col-xl-8">
            <div className="card">
              {/* Header */}
              <div
                className="rounded-top text-white d-flex flex-row"
                style={{ backgroundColor: "#000", height: "200px" }}
              >
                <div
                  className="ms-4 mt-5 d-flex flex-column"
                  style={{ width: "150px" }}
                >
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                    alt="Profile"
                    className="img-fluid img-thumbnail mt-4 mb-2"
                    style={{ width: "150px", zIndex: 1 }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-dark text-body"
                    style={{ zIndex: 1 }}
                  >
                    Edit profile
                  </button>
                </div>
                <div className="ms-3" style={{ marginTop: "130px" }}>
                  <h5>{user.name}</h5>
                  <p>
                    {user.roles
                      .map((role) => role.replace(/_/g, " "))
                      .join(", ")}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="p-4 text-black bg-body-tertiary">
                <div className="d-flex justify-content-end text-center py-1 text-body">
                  <div className="px-3">
                    <p className="mb-1 h5">{disputeStats.disputesCreated}</p>
                    <p className="small text-muted mb-0">Dispute Raised</p>
                  </div>
                  <div>
                    <p className="mb-1 h5">{disputeStats.disputesReviewed}</p>
                    <p className="small text-muted mb-0">Dispute Reviwed</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="card-body p-4 text-black">
                <div className="mb-5 text-body">
                  <p className="lead fw-normal mb-1">User Details</p>
                  <div className="p-4 bg-body-tertiary">
                    <p className="font-italic mb-1 ">UserID : {user.id}</p>
                    <p className="font-italic mb-1">
                      Username : {user.username}
                    </p>
                    <p className="font-italic mb-0">E-Mail ID : {user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
