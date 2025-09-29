import { useState, useEffect } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import ReactPaginate from "react-paginate";

const DashboardForm = () => {
  const navigate = useNavigate();
  const [disputes, setDisputes] = useState([]);
  const [selectedTab, setSelectedTab] = useState("pending-review");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDisputes, setTotalDisputes] = useState(0);
  const [noResultsMessage, setNoResultsMessage] = useState("");
  const rowsPerPage = 10;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (debouncedQuery.trim() !== "") {
          const res = await axios.get(
            `http://localhost:8080/disputes/search?accountNumber=${debouncedQuery}`
          );

          let dataArray = [];
          if (Array.isArray(res.data)) {
            dataArray = res.data;
          } else if (res.data.content) {
            dataArray = res.data.content;
          } else {
            dataArray = [res.data]; // single object → wrap in array
          }
          if (dataArray.length > 0) {
            setDisputes(dataArray);
            setTotalDisputes(dataArray.length);
            setTotalPages(1);
            setCurrentPage(0);
            setNoResultsMessage("");
          } else {
            setDisputes([]);
            setTotalDisputes(0);
            setTotalPages(0);
            setNoResultsMessage(
              "No dispute found with the given account number"
            );
          }
        } else {
          const res = await axios.get(
            `http://localhost:8080/disputes?page=${currentPage}&size=${rowsPerPage}&filter=${selectedTab}`
          );
          if (res.data.content && res.data.content.length > 0) {
            setDisputes(res.data.content);
            setTotalPages(res.data.totalPages);
            setTotalDisputes(res.data.totalElements);
            setNoResultsMessage("");
          } else {
            setDisputes([]);
            setTotalPages(0);
            setTotalDisputes(0);
            setNoResultsMessage("No disputes found");
          }
        }
      } catch (error) {
        console.error("Error fetching disputes:", error);
        setNoResultsMessage(
          debouncedQuery.trim() !== ""
            ? "No dispute found with the given account number"
            : "No dispute raised"
        );
      }
    };

    fetchData();
  }, [debouncedQuery, currentPage, selectedTab, rowsPerPage]);

  // Reset search
  const resetSearch = () => {
    setSearchQuery("");
    setDebouncedQuery("");
    setCurrentPage(0);
  };

  // Row click
  const handleRowClick = (id) => {
    navigate(`/disputes/${id}`);
  };

  return (
    <div className="dashboard-page">
      <div className="d-flex justify-content-between align-items-center">
        {/* <div>
          <h1 className="dashboard-h1">Dashboard</h1>
          <h4 className="dashboard-h4 text-secondary">
            Manage and track banking disputes efficiently
          </h4>
        </div> */}
      </div>

      {/* SEARCH BAR */}
      <div className="search-card bg-light">
        <div className="search-header">
          <span className="icon">
            <FaSearch size={20} color="#2563eb" />
          </span>
          <div>
            <h3>Search Disputes by Account number</h3>
            <p>Find all disputes</p>
          </div>
        </div>

        <div className="search-form">
          <label htmlFor="searchQuery">Client's Account Number</label>
          <div className="search-box">
            <input
              type="text"
              id="searchQuery"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="button" className="clear-btn" onClick={resetSearch}>
              Clear
            </button>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "end" }}>
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
            onClick={() => setSelectedTab("under-review")}
            className={
              selectedTab === "under-review"
                ? "active btn btn-outline-secondary"
                : "btn btn-outline-secondary"
            }
          >
            Pending Verification
          </button>

          <button
            type="button"
            onClick={() => setSelectedTab("all")}
            className={
              selectedTab === "all"
                ? "active btn btn-outline-secondary"
                : "btn btn-outline-secondary"
            }>
            All
          </button>
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
                <th>SERIAL NO</th>
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
                  <td className="DSP">DSP202500{row.id}</td>
                  <td>TNX202500{row.savingsAccountTransaction?.id}</td>
                  <td>{row.createdDate}</td>
                  <td>{row.reason}</td>
                  <td>
                    <div>
                      <span
                        className={`my-badge status-${row.status.name.toLowerCase()}`}
                      >
                        {row.status.name === "INITIATED" && (
                          <i className="bi bi-clock"></i>
                        )}
                        {row.status.name === "IN_PROGRESS" && (
                          <i className="bi bi-arrow-repeat"></i>
                        )}
                        {row.status.name === "CLOSED" && (
                          <i className="bi bi-check-circle"></i>
                        )}
                        {row.status.name.replace("_", " ")}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span
                        className={`my-badge substatus-${row.subStatus.name.toLowerCase()}`}
                      >
                        {row.subStatus.name === "PENDING_REVIEW" && (
                          <i className="bi bi-hourglass-split"></i>
                        )}
                        {row.subStatus.name === "UNDER_REVIEW" && (
                          <i className="bi bi-search"></i>
                        )}
                        {row.subStatus.name === "ACCEPTED" && (
                          <i className="bi bi-hand-thumbs-up"></i>
                        )}
                        {row.subStatus.name === "PARTIALLY_ACCEPTED" && (
                          <i className="bi bi-circle-half"></i>
                        )}
                        {row.subStatus.name === "REJECTED" && (
                          <i className="bi bi-x-circle"></i>
                        )}
                        {row.subStatus.name.replace("_", " ")}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* No Results Message */}
      {disputes.length === 0 && noResultsMessage && (
        <div className="text-center text-muted mt-3">{noResultsMessage}</div>
      )}

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
  );
};

export default DashboardForm;
