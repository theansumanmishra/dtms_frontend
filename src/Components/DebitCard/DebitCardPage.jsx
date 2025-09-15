import "./DebitCardPage.css";

const DebitCardForm = ({ debitCards }) => {

  return (
    <div>
      {/* Debit Cards */}
      {debitCards &&
        debitCards.length &&
        debitCards.map((debitCard, i) => (
          <div className="cards-container" key={`debitCard-${i}`}>
            {/* Visa Card */}
            <div className="debitcard-visa">
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
                    EXPIRES{" "}
                    <span className="date">
                      {debitCard.expiryMonth}/{debitCard.expiryYear}
                    </span>
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
