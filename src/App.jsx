import "./App.css";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Route, Routes } from "react-router";
import 'bootstrap/dist/css/bootstrap.min.css';

import AboutPage from "./Pages/AboutPage";
import LoginPage from "./Pages/LoginPage";
import LandingPage from "./Pages/LandingPage";
import DashboardPage from "./Pages/DashboardPage";
import DebitCardPage from "./Pages/DebitCardPage";
import TransactionPage from "./Pages/TransactionPage";
import ViewDisputePage from "./Pages/ViewDisputePage";
import RaisedisputePage from "./Pages/RaisedisputePage";
import CreateDisputePage from "./Pages/CreateDisputePage";
import ReviewdisputePage from "./Pages/ReviewdisputePage";
import TransactiondetailPage from "./Pages/TransactiondetailPage";
import DisputeConfirmationPage from "./Pages/DisputeConfirmationPage";
import ClientPage from "./Pages/Clients";
import ClientShowPage from "./Pages/ShowClient";
import TransactionList from "./Pages/Transaction";
// import { toast } from "react-toastify";

// Set up Axios interceptor to include JWT token in headers
axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('accessToken');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Add response interceptor
// axios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       switch (error.response.status) {
//         case 401:
//           localStorage.removeItem('accessToken'); // Clear invalid token
//           window.location.href = "/login";
//           break;
//         case 500:
//         case 422:
//           toast.error("Something went wrong!");
//           break;
//         default:
//           return Promise.reject(error);
//       }
//     }
//     return Promise.reject(error);
//   }
// );


// Main App Component with Routing
const App = () => {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* <Route path="/disputes/:id" element={<ViewDisputePage />} /> */}
          <Route path="/review-dispute/:id" element={<ReviewdisputePage />} />
          {/* <Route path="/disputes/:id/review" element={<ReviewdisputePage />} /> */}
          <Route path="/create-dispute" element={<CreateDisputePage />} />
          <Route path="/debitcard" element={<DebitCardPage />} />
          <Route path="/transaction" element={<TransactionPage />} />
          <Route path="/savingsaccounts/:savingsAccountId/transactions/:transactionId" element={<TransactiondetailPage />}/>
          <Route path="/savingsaccounts/:id/transactions/:transactionId/raise-dispute" element={<RaisedisputePage />} />
          <Route path="/disputes/:disputeId" element={<DisputeConfirmationPage />}/>
          <Route path="/disputes/:disputeId/confirmation" element={<DisputeConfirmationPage />}/>
          <Route path="/clients" element={<ClientPage />}/>
          <Route path="/clients/:id" element={<ClientShowPage />} />
          <Route path="/savingsaccounts/:id/transactions" element={<TransactionList />} />
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
