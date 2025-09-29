import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [disputeStats, setDisputeStats] = useState({
    disputesCreated: 0,
    disputesReviewed: 0,
  });

  // New states for upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch user info and stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get("http://localhost:8080/users/me");
        setUser(userRes.data);

        const statsRes = await axios.get("http://localhost:8080/my-stats");
        setDisputeStats(statsRes.data);
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    
    try {
      const res = await axios.post(
        `http://localhost:8080/users/${user.id}/upload-photo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update user photo
      setUser({ ...user, profilePhoto: res.data });
      setPreview(null);
      setSelectedFile(null);
      toast.success("Profile photo updated!");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!user) 
    return <p className="loading-text">Loading user profile...</p>;

  return (
    <section className="profile-page">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center">
          <div className="col col-lg-9 col-xl-8">
            <div className="card glass-card border-0 shadow-lg">
              {/* Header */}
              <div className="rounded-top text-white d-flex flex-row user-header position-relative">
                <div
                  className="ms-4 mt-5 d-flex flex-column align-items-center"
                  style={{ width: "150px" }}
                >
                  <img
                    src={
                      preview
                        ? preview
                        : user.profilePhoto
                        ? `http://localhost:8080${user.profilePhoto}`
                        : "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                    }
                    alt="Profile"
                    className="img-fluid img-thumbnail mt-4 mb-3 profile-avatar"
                  />

                  <button
                    type="button"
                    className="btn btn-outline-light btn-glow"
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    ✏️ Edit Profile
                  </button>

                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />

                  {preview && (
                    <div className="mt-3 text-center">
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={handleUpload}
                        disabled={uploading}
                      >
                        {uploading ? "Uploading..." : "Save"}
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setPreview(null);
                          setSelectedFile(null);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* User Role */}
                <div className="ms-4 mt-auto mb-3">
                  <h3 className="fw-bold">{user.name}</h3>
                  <p className="text-white-50 mb-0">
                    {user.roles.map((r) => r.replace(/_/g, " ")).join(", ")}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="p-4 stats-section">
                <div className="d-flex justify-content-end text-center gap-4 pe-3">
                  <div className="stat-box">
                    <h4>{disputeStats.disputesCreated}</h4>
                    <p>Disputes Raised</p>
                  </div>
                  <div className="stat-box">
                    <h4>{disputeStats.disputesReviewed}</h4>
                    <p>Disputes Reviewed</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="card-body p-4 text-black">
                <h5 className="fw-bold mb-3">👤 User Details</h5>
                <div className="p-4 bg-light rounded shadow-sm">
                  <p className="mb-2">
                    <strong>User ID:</strong> {user.id}
                  </p>
                  <p className="mb-2">
                    <strong>Username:</strong> {user.username}
                  </p>
                  <p className="mb-2">
                    <strong>Contact :</strong> +91 {user.phone}
                  </p>
                  <p className="mb-0">
                    <strong>Email:</strong> {user.email}
                  </p>
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
