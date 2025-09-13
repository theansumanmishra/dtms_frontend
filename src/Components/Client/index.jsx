import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Button, Table, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaSearch } from "react-icons/fa";

const Clients = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);

  // Search Table data to display (either all or filtered)
  const fetchClients = useCallback(() => {
    setLoading(true);
    axios
      .get("http://localhost:8080/clients")
      .then((res) => {
        setClients(res.data);
        setFilteredClients(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = () => {
    if (searchQuery) {
      const tempFilteredClients = clients.filter(
        (cl) =>
          cl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cl.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cl.phone.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredClients(tempFilteredClients);
    } else {
      setFilteredClients(clients);
    }
  };

  const resetSearch = () => {
    setSearchQuery("");
    setFilteredClients(clients);
  };

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // ✅ Row click
  const handleRowClick = (id) => {
    navigate(`/clients/${id}`);
  };

  return (
    <div className="container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div className="search-card bg-light">
            <div className="search-header">
              <span className="icon">
                <FaSearch size={20} color="#2563eb" />
              </span>
              <div>
                <h3>Search clients by Name or Phone Number</h3>
                <p>Find all clients</p>
              </div>
            </div>

            <div className="search-form">
              <label htmlFor="searchQuery">Client Name / Phone Number</label>
              <div className="search-box">
                <input
                  type="text"
                  id="searchQuery"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="search-btn" onClick={() => handleSearch()}>
                  <FaSearch /> Search
                </button>
                <button
                  type="button"
                  className="clear-btn"
                  onClick={() => {
                    resetSearch();
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
          <div className="custom-table">

            {/* Search Dispute Box */}
            <h2 className="heading">
              All Clients <br />
              <span className="pr">Showing all available clients</span>
            </h2>
            <table>
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Client ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.length ? (
                  filteredClients.map((client, i) => (
                    <tr
                      key={client.id}
                      onClick={() => handleRowClick(client.id)}
                    >
                      <td>{i + 1}</td>
                      <td>CLI202500{client.id}</td>
                      <td className="DSP">{client.name}</td>
                      <td>{client.email}</td>
                      <td>+91-{client.phone}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>
                      <div className="text-center p-4">No clients found</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
