import { useState, useEffect } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import ReactPaginate from "react-paginate";

const Dispute = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [disputes, setDisputes] = useState([]);
  const [selectedTab, setSelectedTab] = useState("pending-review");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDisputes, setTotalDisputes] = useState(0);
  const [noResultsMessage, setNoResultsMessage] = useState("");
  const [_inputError, setInputError] = useState("");
  const rowsPerPage = 10;

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset page when search or filter changes
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedQuery, selectedTab]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (debouncedQuery.trim() !== "") {
          const res = await axios.get(
            `http://localhost:8080/disputes/search?accountNumber=${debouncedQuery}`
          );

          let dataArray = [];
          if (Array.isArray(res.data)) {
            dataArray = res.data;
          } else if (res.data.content) {
            dataArray = res.data.content;
          } else if (res.data) {
            dataArray = [res.data];
          }

          if (dataArray.length > 0) {
            setDisputes(dataArray);
            setTotalDisputes(dataArray.length);
            setTotalPages(1);
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedQuery, currentPage, selectedTab]);

  const resetSearch = () => {
    setSearchQuery("");
    setDebouncedQuery("");
    setCurrentPage(0);
    setSelectedTab("all");
  };

  const handleRowClick = (id) => {
    navigate(`/disputes/${id}`);
  };

  return (
    <div className="dashboard-page">
      {/* Search Section */}
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
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setSearchQuery(value);
                  setInputError("");
                  // 👇 When user types something (starts searching)
                  if (value.trim() !== "") {
                    setSelectedTab(""); // deactivate all filters visually
                  } else {
                    setSelectedTab("pending-review"); // revert back when search cleared
                  }
                } else {
                  setInputError("Only numbers are allowed");
                }
              }}
            />
            <button type="button" className="clear-btn" onClick={resetSearch}>
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Disputes Table */}
      <div className="table-wrapper">
        <div className="custom-table">
          <div className="heading-container">
            <h2 className="heading">
              All Previous Disputes <br />
              <span className="pr">
                Showing {disputes.length} of {totalDisputes} disputes
              </span>
            </h2>
            <div className="btn-group me-3">
              {["pending-review", "under-review", "all"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setSelectedTab(tab);
                    setSearchQuery(""); // clear search if user clicks a tab again
                    setDebouncedQuery("");
                  }}
                  className={
                    selectedTab === tab
                      ? "active btn btn-outline-primary"
                      : "btn btn-outline-primary"
                  }
                >
                  {tab === "pending-review"
                    ? "Pending Review"
                    : tab === "under-review"
                    ? "Pending Verification"
                    : "All"}
                </button>
              ))}
            </div>
          </div>

          <div className="table-scroll">
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading disputes...</p>
              </div>
            ) : disputes.length > 0 ? (
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
                      <td>{row.createdDate.split("-").reverse().join("-")}</td>
                      <td>{row.reason}</td>
                      <td>
                        <span
                          className={`my-badge status-${row.status.name.toLowerCase()}`}
                        >
                          {row.status.name === "INITIATED" && (
                            <i className="bi bi-clock"></i>
                          )}{" "}
                          {row.status.name === "IN_PROGRESS" && (
                            <i className="bi bi-arrow-repeat"></i>
                          )}{" "}
                          {row.status.name === "CLOSED" && (
                            <i className="bi bi-check-circle"></i>
                          )}
                          {row.status.name.replace("_", " ")}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`my-badge substatus-${row.subStatus.name.toLowerCase()}`}
                        >
                          {row.subStatus.name === "PENDING_REVIEW" && (
                            <i className="bi bi-hourglass-split"></i>
                          )}{" "}
                          {row.subStatus.name === "UNDER_REVIEW" && (
                            <i className="bi bi-search"></i>
                          )}{" "}
                          {row.subStatus.name === "ACCEPTED" && (
                            <i className="bi bi-hand-thumbs-up"></i>
                          )}{" "}
                          {row.subStatus.name === "PARTIALLY_ACCEPTED" && (
                            <i className="bi bi-circle-half"></i>
                          )}{" "}
                          {row.subStatus.name === "REJECTED" && (
                            <i className="bi bi-x-circle"></i>
                          )}
                          {row.subStatus.name.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              noResultsMessage && (
                <div className="text-center text-muted mt-3">
                  {noResultsMessage}
                </div>
              )
            )}
          </div>

          {/* Conditional Pagination */}
          {debouncedQuery.trim() === "" && totalPages > 1 && (
            <div className="pagination-section">
              <ReactPaginate
                previousLabel={"← Prev"}
                nextLabel={"Next →"}
                breakLabel={"..."}
                pageCount={totalPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={(event) => setCurrentPage(event.selected)}
                forcePage={currentPage}
                containerClassName={"pagination-container"}
                pageClassName={"pagination-page"}
                pageLinkClassName={"pagination-link"}
                previousClassName={"pagination-prev"}
                previousLinkClassName={"pagination-link"}
                nextClassName={"pagination-next"}
                nextLinkClassName={"pagination-link"}
                breakClassName={"pagination-break"}
                breakLinkClassName={"pagination-link"}
                activeClassName={"pagination-active"}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dispute;
