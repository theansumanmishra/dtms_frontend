import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import ReactPaginate from "react-paginate";

const Clients = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [totalClients, setTotalClients] = useState(0);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0); // 0-based
  const [totalPages, setTotalPages] = useState(0);
  const rowsPerPage = 5;

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(0); // reset page on new search
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch clients from backend
  const fetchClients = useCallback(
    async (page = 0, query = "") => {
      setLoading(true);
      try {
        let url = `http://localhost:8080/clients?page=${page}&size=${rowsPerPage}`;
        if (query) {
          url = `http://localhost:8080/clients/search?keyword=${encodeURIComponent(
            query
          )}`;
        }
        const res = await axios.get(url);
        if (query) {
          setClients(res.data); // search returns full list
          setTotalClients(res.data.length); // 👈 total = length of search results
          setTotalPages(1);
          setCurrentPage(0);
        } else {
          setClients(res.data.content);
          setTotalClients(res.data.totalElements); // 👈 backend total count
          setTotalPages(res.data.totalPages);
          setCurrentPage(res.data.number);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    },
    [rowsPerPage]
  );

  useEffect(() => {
    fetchClients(currentPage, debouncedQuery);
  }, [currentPage, debouncedQuery, fetchClients]);

  const handleRowClick = (id) => {
    navigate(`/clients/${id}`);
  };

  const handlePageClick = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const resetSearch = () => setSearchQuery("");

  return (
    <div className="container">
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
            {/* <button
              className="search-btn"
              onClick={() => fetchClients(0, debouncedQuery)}>
              <FaSearch /> Search
            </button> */}

            <button type="button" className="clear-btn" onClick={resetSearch}>
              Clear
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="custom-table">
          <h2 className="heading">
            All Registered Clients <br />
            <span className="pr">Showing {clients.length} of {totalClients} clients</span>
          </h2>
          <table>
            <thead>
              <tr>
                <th>Serial No.</th>
                <th>Client ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {clients.length ? (
                clients.map((client, i) => (
                  <tr
                    key={`${client.id}-${i}`}
                    onClick={() => handleRowClick(client.id)}
                  >
                    {/* Serial Number */}
                    <td>
                      {totalPages > 1
                        ? currentPage * rowsPerPage + i + 1
                        : i + 1}
                    </td>
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

          {/* React Paginate */}
          {debouncedQuery.trim() === "" && totalPages > 1 && (
            <ReactPaginate
              previousLabel={"← Previous"}
              nextLabel={"Next →"}
              breakLabel={"..."}
              pageCount={totalPages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={"pagination justify-content-center"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              breakClassName={"page-item"}
              breakLinkClassName={"page-link"}
              activeClassName={"active"}
              forcePage={currentPage}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Clients;
