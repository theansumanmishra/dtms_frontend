import { useState, useEffect } from "react";
import "./dashboardForm.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DashboardForm = () => {
  const navigate = useNavigate();

  //States
  const [filteredData, setFilteredData] = useState([]);
  // const [searched, setSearched] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; //show 5 rows per page (change if needed)

  //Fetch disputes from API
  useEffect(() => {
    setCurrentPage(1); // reset to page 1 on data fetch
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/disputes`);
        setFilteredData(res.data.content);
      } catch (error) {
        console.error("Error fetching disputes:", error);
      }
    };
    fetchData();
  }, []);

  // Row click
  const handleRowClick = (id) => {
    navigate(`/disputes/${id}`);
  };

  // Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className="dashboard-page">
      <h3 className="upper">Manage and track banking disputes efficiently</h3>

      {/* Disputes Table */}
      <div className="table-wrapper">
        <div className="custom-table">
          <h2 className="heading">All Previous Disputes</h2>

          {/* Table Data */}
          <table>
            <thead className="head">
              <tr>
                <th>DISPUTE ID</th>
                <th>TRANSACTION ID</th>
                <th>DATE CREATED</th>
                <th>REASON</th>
                <th>STATUS</th>
                <th>SUB STATUS</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row) => (
                <tr key={row.id} onClick={() => handleRowClick(row.id)}>
                  <td className="DSP">DSP202500{row.id}</td>
                  <td>TNX202500{row.savingsAccountTransaction.id}</td>
                  <td>{row.createdDate}</td>
                  <td>{row.reason}</td>
                  <td>
                    <span className={`status-badge ${row.status.name}`}>
                      {row.status.name}
                    </span>
                  </td>
                  <td>
                    <span className={`substatus-badge ${row.subStatus.name}`}>
                      {row.subStatus.name}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="page-btn"
            >
              ← Previous
            </button>
            <span className="page-number">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="page-btn"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardForm;
