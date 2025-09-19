import { useState, useEffect } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactPaginate from "react-paginate";

const DashboardForm = () => {
  const navigate = useNavigate();
  const [disputes, setDisputes] = useState([]);
  const [selectedTab, setSelectedTab] = useState("pending-review");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDisputes, setTotalDisputes] = useState(0);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/disputes?page=${currentPage}&size=${rowsPerPage}&filter=${selectedTab}`
        );
        setDisputes(res.data.content); // current page disputes
        setTotalPages(res.data.totalPages); // total pages
        setTotalDisputes(res.data.totalElements); // total disputes count
      } catch (error) {
        console.error("Error fetching disputes:", error);
      }
    };
    fetchData();
  }, [currentPage, rowsPerPage, selectedTab]);

  // Row click
  const handleRowClick = (id) => {
    navigate(`/disputes/${id}`);
  };

  return (
    <div className="dashboard-page">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h1 className="dashboard-h1">Dashboard</h1>
          <h4 className="dashboard-h4 text-secondary">
            Manage and track banking disputes efficiently
          </h4>
        </div>
        <div>
          {/* FILTER BUTTONS */}
          <div className="btn-group">
            <button
              type="button"
              onClick={() => setSelectedTab("pending-review")}
              className={
                selectedTab === "pending-review"
                  ? "active btn btn-outline-secondary"
                  : "btn btn-outline-secondary"
              }
            >
              Pending Review
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab("all")}
              className={
                selectedTab === "all"
                  ? "active btn btn-outline-secondary"
                  : "btn btn-outline-secondary"
              }
            >
              All
            </button>
          </div>
        </div>
      </div>

      {/* Disputes Table */}
      <div className="table-wrapper">
        <div className="custom-table">
          <h2 className="heading">
            All Previous Disputes <br />
            <span className="pr">
              Showing {disputes.length} of {totalDisputes} disputes
            </span>
          </h2>
          {/* Table Data */}
          <table>
            <thead className="head">
              <tr>
                <th>SERIAL NO.</th>
                <th>DISPUTE ID</th>
                <th>TRANSACTION ID</th>
                <th>DATE CREATED</th>
                <th>REASON</th>
                <th>STATUS</th>
                <th>SUB STATUS</th>
              </tr>
            </thead>
            <tbody>
              {disputes.map((row, index) => (
                <tr key={row.id} onClick={() => handleRowClick(row.id)}>
                  <td>{currentPage * rowsPerPage + index + 1}</td>
                  {/* Serial Number calculation */}
                  <td className="DSP">DSP202500{row.id}</td>
                  <td>TNX202500{row.savingsAccountTransaction.id}</td>
                  <td>{row.createdDate}</td>
                  <td>{row.reason}</td>
                  <td>
                    <div>
                      <span
                        className={`my-badge status-${row.status.name
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {row.status.name === "INITIATED" && (
                          <i className="bi bi-hourglass-split"></i>
                        )}
                        {row.status.name === "IN-PROGRESS" && (
                          <i className="bi bi-arrow-repeat"></i>
                        )}
                        {row.status.name === "CLOSED" && (
                          <i className="bi bi-check-circle"></i>
                        )}
                        {row.status.name}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span
                        className={`my-badge substatus-${row.subStatus.name
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {row.subStatus.name === "UNDER REVIEW" && (
                          <i className="bi bi-search"></i>
                        )}
                        {row.subStatus.name === "ACCEPTED" && (
                          <i className="bi bi-hand-thumbs-up"></i>
                        )}
                        {row.subStatus.name === "REJECTED" && (
                          <i className="bi bi-x-circle"></i>
                        )}
                        {row.subStatus.name}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Component */}
        <ReactPaginate
          previousLabel={"← Previous"}
          nextLabel={"Next →"}
          breakLabel={"..."}
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={(event) => setCurrentPage(event.selected)}
          containerClassName={"pagination justify-content-center mt-3"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
          breakClassName={"page-item"}
          breakLinkClassName={"page-link"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
};

export default DashboardForm;
