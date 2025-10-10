import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import "./Admin.css";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    roleId: "",
    username: "",
  });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await axios.get("http://localhost:8080/roles");
      const filtered = res.data.filter((r) => r.name !== "MASTER_ADMIN");
      setRoles(filtered);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8080/users/${userId}`);
      fetchUsers();
      toast.success("User deleted successfully 👍");
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const createUser = () => {
    setFormData({
      id: null,
      name: "",
      email: "",
      phone: "",
      roleId: "",
      username: "",
    });
    setShowModal(true);
  };

  const editUser = (user) => {
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      roleId: user.roles[0]?.id?.toString() || "",
      username: user.username || "",
    });
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "enabled" ? value === "true" : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload = { ...formData };

    if (formData.roleId) {
      const selectedRole = roles.find(
        (r) => r.id === parseInt(formData.roleId, 10)
      );
      payload.roles = selectedRole ? [selectedRole] : [];
    } else if (formData.id) {
      const oldUser = users.find((u) => u.id === formData.id);
      payload.roles = oldUser ? oldUser.roles : [];
    }

    delete payload.roleId;
    setLoading(true);
    try {
      if (formData.id) {
        await axios.put(`http://localhost:8080/users/${formData.id}`, payload);
        toast.success("User updated successfully");
      } else {
        await axios.post(`http://localhost:8080/register`, payload);
        toast.success("User created successfully");
        toast.success("Password sent to user's email");
      }
      fetchUsers();
      handleClose();
    } catch (err) {
      console.error("Error saving user:", err);
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div className="container mt-5 admin-dashboard">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className="fw-bold">Admin Dashboard</h2>
        <Button className="btn-glow" onClick={createUser}>
          + Create User
        </Button>
      </div>

      <div className="card shadow-sm rounded-4 border-0 table-card">
        <div className="card-body p-3">
          <h4 className="mb-3">User List</h4>
          <div>
            <table className="table table-hover align-middle mb-0">
              <thead className="table-gradient text-white">
                <tr>
                  <th>UserId</th>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="table-row-hover">
                    <td>USR202500{u.id}</td>
                    <td>{u.username}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>+91-{u.phone}</td>
                    <td>{u.roles[0]?.name.replace("_", " ")}</td>
                    <td className="text-center align-middle">
                      <span
                        className={`status-badge ${
                          u.enabled ? "active" : "inactive"
                        }`}
                      >
                        {u.enabled ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        className="me-2 btn-glow-sm"
                        onClick={() => editUser(u)}
                        disabled={u.roles?.some(
                          (r) => r.name === "MASTER_ADMIN"
                        )} // disable for Master Admin
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="btn-glow-sm"
                        onClick={() => deleteUser(u.id)}
                        disabled={u.roles?.some(
                          (r) => r.name === "MASTER_ADMIN"
                        )} // disable for Master Admin
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        className="modal-glass"
      >
        <Modal.Header closeButton>
          <Modal.Title>{formData.id ? "Edit User" : "Create User"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {/* Form fields */}
            {["name", "email", "phone", "username"].map((field) => (
              <Form.Group className="mb-3" key={field}>
                <Form.Label className="fw-semibold">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </Form.Label>
                <Form.Control
                  type={field === "phone" ? "tel" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={`Enter ${field}`}
                  pattern={field === "phone" ? "\\d{10}" : undefined}
                  title={
                    field === "phone"
                      ? "Phone number must be 10 digits"
                      : undefined
                  }
                  required
                />
              </Form.Group>
            ))}

            {/* Role dropdown */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Role</Form.Label>
              <Form.Select
                name="roleId"
                value={formData.roleId}
                onChange={handleChange}
                required
              >
                <option value="">Select role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name.replace("DISPUTE_", "")}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Status dropdown */}
            {formData.id && (
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Status</Form.Label>
                <Form.Select
                  name="enabled"
                  value={formData.enabled}
                  onChange={handleChange}
                  required
                >
                  <option value={true}>Enable</option>
                  <option value={false}>Disable</option>
                </Form.Select>
              </Form.Group>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{" "}
                  {formData.id ? "Updating..." : "Creating..."}
                </>
              ) : formData.id ? (
                "Update User"
              ) : (
                "Create User"
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Admin;
