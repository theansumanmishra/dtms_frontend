import "./DebitCardPage.css";

const DebitCardForm = ({ debitCards, clientName }) => {

  return (
    <div className="debit-cards-wrapper">
      {debitCards &&
        debitCards.length &&
        debitCards.map((debitCard, i) => (
          <div className="cards-container" key={`debitCard-${i}`}>
            <div className="debitcard-visa">
              <div className="line1">
                <div className="chip">
                  <img src="/chip.png" alt="chip" />
                </div>
                <div className="card-header">
                  <span className="black">DEBIT</span>
                </div>
              </div>
              <div className="status-active">ACTIVE</div>
              <div className="card-number">{debitCard.cardNo.toString().replace(/(.{4})/g, '$1 ').trim()}</div>
              <div className="card-footer">
                <div className="left">
                  <p className="expires">
                    EXPIRES{" "}
                    <span className="date">
                      { ('0' + debitCard.expiryMonth).slice(-2)} / {debitCard.expiryYear}
                    </span>
                  </p>
                  <p className="card-holder-name">{clientName}</p>
                </div>
                <div className="right">
                  <p className="type">{/* <b>Visa Debit</b> */}</p>
                  <div className="brand visa-logo">
                    <img src="/visa.png" alt="visa" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default DebitCardForm;
