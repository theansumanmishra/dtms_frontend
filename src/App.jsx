import "./App.css";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Route, Routes } from "react-router";
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from "react-toastify";

import LandingPage from "./Pages/Landing";
import AboutPage from "./Pages/About";
import LoginPage from "./Pages/Login";
import DashboardPage from "./Pages/Dashboard";
import ClientPage from "./Pages/ClientsIndex";
import ClientShowPage from "./Pages/ClientsShow";
import TransactionList from "./Pages/TransactionIndex";
import TransactiondetailPage from "./Pages/TransactionView";
import RaisedisputePage from "./Pages/RaiseDispute";
import DisputeConfirmationPage from "./Pages/DisputeConfirmation";
import ViewDisputePage from "./Pages/DisputeDetails";
import ViewStats from "./Pages/ViewStats"
import UserDetailsPage from "./Pages/UserDetails";
import AdminDashboard from "./pages/AdminDashboard";

// Set up Axios interceptor to include JWT token in headers
axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('accessToken');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Add response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          toast.error("You are not allowed to perform this action");
          toast.warn("Unauthorized Access...");
          break;
        case 500:
        case 422:
          toast.error("Something went wrong!");
          toast.error("Redirecting to Login Page...");
          localStorage.removeItem('accessToken'); // Clear invalid token
          window.location.href = "/login";
          break;
        default:
          return Promise.reject(error);
      }
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/disputes" element={<DashboardPage />} />
          <Route path="/clients" element={<ClientPage />}/>
          <Route path="/clients/:id" element={<ClientShowPage />} />
          <Route path="/savingsaccounts/:id/transactions" element={<TransactionList />} />
          <Route path="/savingsaccounts/:savingsAccountId/transactions/:transactionId" element={<TransactiondetailPage />}/>
          <Route path="/savingsaccounts/:id/transactions/:transactionId/raise-dispute" element={<RaisedisputePage />} />
          <Route path="/disputes/:disputeId/confirmation" element={<DisputeConfirmationPage />}/>
          <Route path="/disputes/:disputeId" element={<ViewDisputePage />}/>
          <Route path="/dashboard" element={<ViewStats />}/>
          <Route path="/user" element={<UserDetailsPage />}/>
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={2000}
          closeButton={false}
          hideProgressBar={false}
          newestOnTop
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
