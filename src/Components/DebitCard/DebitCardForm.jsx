import React from "react";
import "./DebitCard.css";
import { useNavigate } from "react-router";

const DebitCardForm = ({ debitCards }) => {
  // const location = useLocation();
  const navigate = useNavigate();
  // const { clientInfo, clientId } = location.state || {};
  // if (!clientInfo) {
  //   return <p>No client data found. Please go back and select a client.</p>;
  // }

  const handleCardClick = (cardNumber, expiry) => {
    navigate("/transaction", {
      state: { cardNumber, expiry },
    });
  };

  return (
    <div>
      {/* <h4 className="h4">
        All debit cards linked to {clientInfo.name}'s account {clientId}
      </h4>

      <div className="client-card-header">
        <div className="client-avatar">👤</div>
        <div className="client-info">
          <h4 className="client-name">{clientInfo.name}</h4>
          <p className="client-details">
            {clientInfo.email} • {clientInfo.phone}
          </p>
        </div>
      </div> */}

      {/* Debit Cards */}
      {debitCards && debitCards.length && debitCards.map((debitCard, i) => (
        <div className="cards-container" key={`debitCard-${i}`}>
          {/* Visa Card */}
          <div
            className="debitcard-visa"
            onClick={() => handleCardClick("1234", "12/26")}
          >
            <div className="line1">
              <div className="chip"></div>
              <div className="card-header">
                <span className="black">DEBIT</span>
              </div>
            </div>
            <div className="status-active">ACTIVE</div>
            <div className="card-number">{debitCard.cardNo}</div>
            <div className="card-footer">
              <div className="left">
                <p className="expires">
                  EXPIRES <span className="date">{debitCard.expiryMonth}/{debitCard.expiryYear}</span>
                </p>
                <p className="bank">BankSecure</p>
              </div>
              <div className="right">
                <p className="type">{/* <b>Visa Debit</b> */}</p>
                <div className="brand visa-logo">VISA</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DebitCardForm;
