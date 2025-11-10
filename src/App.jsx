import "./App.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Route, Routes } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";

import LandingPage from "./Pages/Landing";
import AboutPage from "./Pages/About";
import LoginPage from "./Pages/Login";
import DisputePage from "./Pages/Dispute";
import ClientPage from "./Pages/ClientsIndex";
import ClientShowPage from "./Pages/ClientsShow";
import TransactionListPage from "./Pages/TransactionIndex";
import TransactionDetailsPage from "./Pages/TransactionView";
import RaiseDisputePage from "./Pages/RaiseDispute";
import ViewDisputePage from "./Pages/DisputeDetails";
import ViewStats from "./Pages/ViewStats";
import UserDetailsPage from "./Pages/UserDetails";
import AdminDashboard from "./pages/AdminDashboard";
import PasswordResetPage from "./Pages/PasswordReset";
import PasswordChangePage from "./Pages/PasswordChange";
import Error404Page from "./Pages/Error404Page";

// Set up Axios interceptor to include JWT token in headers
axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("accessToken");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Add response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // If there's no response, backend is unreachable or network issue
    if (!error.response) {
      toast.error("Cannot connect to the server. Please log in again.");
      localStorage.removeItem("accessToken");
      window.location.href = "/loginPage";
      return Promise.reject(error);
    }

    // Handle known response status codes
    switch (error.response.status) {
      case 401:
        toast.warn("Request can't be processed!");
        localStorage.removeItem("accessToken");
        window.location.href = "/loginPage";
        break;

      case 422:
        toast.error("Unauthorized access - please log in.");
        localStorage.removeItem("accessToken");
        window.location.href = "/loginPage";
        break;

      case 500:
        toast.error("Something went wrong on the server.");
        localStorage.removeItem("accessToken");
        window.location.href = "/loginPage";
        break;

      default:
        break;
    }

    return Promise.reject(error);
  }
);

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/loginPage" element={<LoginPage />} />
          <Route path="/disputes" element={<DisputePage />} />
          <Route path="/clients" element={<ClientPage />} />
          <Route path="/clients/:id" element={<ClientShowPage />} />
          <Route
            path="/clients/:clientId/savingsaccounts/:id/transactions"
            element={<TransactionListPage />}
          />
          <Route
            path="/clients/:clientId/savingsaccounts/:savingsAccountId/transactions/:transactionId"
            element={<TransactionDetailsPage />}
          />
          <Route
            path="/clients/:clientId/savingsaccounts/:id/transactions/:transactionId/raise-dispute"
            element={<RaiseDisputePage />}
          />
          <Route path="/disputes/:disputeId" element={<ViewDisputePage />} />
          <Route path="/dashboard" element={<ViewStats />} />
          <Route path="/user" element={<UserDetailsPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/reset-password" element={<PasswordResetPage />} />
          <Route path="/forget-password" element={<PasswordChangePage />} />
          <Route path="/*" element={<Error404Page />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={2000}
          closeButton={false}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={true}
          pauseOnHover={false}
          draggable={false}
          theme="colored"
        />
      </BrowserRouter>
    </>
  );
};

export default App;
