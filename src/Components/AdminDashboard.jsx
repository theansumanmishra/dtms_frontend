import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]); // dynamic roles from backend
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    roleId: "", // store selected role id
    username: "",
    password: "",
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
      setRoles(res.data); // expected [{id:1,name:"DISPUTE_ADMIN"}, ...]
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
      password: "",
    });
    setShowModal(true);
  };

  const editUser = (user) => {
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      roleId: user.roles[0]?.id?.toString() || "", // keep the current role
      username: user.username || "",
      password: "",
    });
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let payload = { ...formData };

    // For create/update → attach role properly
    if (formData.roleId) {
      const selectedRole = roles.find(
        (r) => r.id === parseInt(formData.roleId, 10)
      );
      payload.roles = selectedRole ? [selectedRole] : [];
    } else if (formData.id) {
      // Editing but no change → keep old role
      const oldUser = users.find((u) => u.id === formData.id);
      payload.roles = oldUser ? oldUser.roles : [];
    }

    delete payload.roleId;

    // If updating and password blank → don't send it
    if (formData.id && !formData.password) {
      delete payload.password;
    }

    try {
      if (formData.id) {
        await axios.put(`http://localhost:8080/users/${formData.id}`, payload);
        toast.success("User updated successfully 👍");
      } else {
        await axios.post(`http://localhost:8080/register`, payload);
        toast.success("User created successfully 👍");
      }
      fetchUsers();
      handleClose();
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>
      <div className="d-flex justify-content-between mb-3">
        <h4>User List</h4>
        <Button onClick={createUser}>Create User</Button>
      </div>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>UserId</th>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>USR00{u.id}</td>
              <td>{u.username}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>+91-{u.phone}</td>
              <td>{u.roles[0]?.name.replace("DISPUTE_", "")}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => editUser(u)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteUser(u.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Create/Edit User Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{formData.id ? "Edit User" : "Create User"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={"Enter name"}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={"Enter email"}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={"Enter phone number"}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder={"Enter a suitable username"}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={
                  formData.id
                    ? "Leave blank to keep current password"
                    : "Enter password"
                }
                required={!formData.id}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
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
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {formData.id ? "Update User" : "Save User"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Admin;
