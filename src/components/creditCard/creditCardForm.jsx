import React, { useState } from "react";
import "./creditCardForm.css";
import { useTranslation } from "react-i18next";

const CreditCardForm = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expDate, setExpDate] = useState("");
  const [ccv, setCcv] = useState("");

  const { t } = useTranslation();

  const handleCardNumberChange = (e) => {
    const input = e.target.value;
    let cleaned = input.replace(/[^\d\s]/g, "");
    let value = cleaned
      .replace(/[^0-9]+/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
    setCardNumber(value);
  };

  const handleExpDateChange = (e) => {
    let value = e.target.value.replace(/[^0-9]+/g, ""); // Keep only digits

    // Automatically add a slash after the month (first two digits)
    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2);
    }

    // Handle case when user backspaces over the slash
    if (value.length === 3 && e.target.value.length === 2) {
      value = value.substring(0, 2);
    }

    setExpDate(value);
  };

  // Handlers for cardName and ccv similar to handleCardNumberChange (omitted for brevity)

  return (
    <div className="box">
      <div className="box">
        <div className="mdl h-auto">
          <div className="circles">
            <div className="circle circle-1"></div>
            <div className="circle circle-2"></div>
          </div>
          <h1 className="title">{t("creditCardTitle")}</h1>

          <div className="card">
            <form>
              <div className="logo">
                <i className="material-icons" style={{ fontSize: "50px" }}>
                  toll
                </i>
              </div>
              <div className="card-number">
                <label className="label">{t("cardNumber")}</label>
                <input
                  id="card-number"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 1234 1234 1234"
                  type="text"
                  maxLength="19"
                  required
                />
                <span className="card-underline"></span>
              </div>
              <br />
              <div className="group">
                <div className="card-name">
                  <label className="label">{t("cardHolder")}</label>
                  <input
                    id="card-name"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    placeholder="Safa Khier"
                    type="text"
                    required
                  />
                  <span className="card-underline"></span>
                </div>
                <div className="expiration-date">
                  <label className="label">{t("expDate")}</label>
                  <input
                    id="card-exp"
                    value={expDate}
                    onChange={handleExpDateChange}
                    placeholder="10/25"
                    type="text"
                    maxLength="5"
                    required
                  />
                  <span className="card-underline"></span>
                </div>
                <div className="ccv">
                  <label className="label">{t("cvv")}</label>
                  <input
                    id="card-ccv"
                    value={ccv}
                    onChange={(e) =>
                      setCcv(e.target.value.replace(/[^0-9]+/g, ""))
                    }
                    placeholder="123"
                    type="text"
                    maxLength="3"
                    required
                  />
                  <span className="card-underline"></span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCardForm;
