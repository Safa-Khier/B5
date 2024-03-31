import React, { useEffect, useState } from "react";
import "./creditCardForm.css";
import { useTranslation } from "react-i18next";

const CreditCardForm = ({ handleCreditCardData }) => {
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

  useEffect(() => {
    sendCreditCardDataToParent();
  }, [cardNumber, cardName, expDate, ccv]);

  function sendCreditCardDataToParent() {
    const creditCardDetails = {
      cardNumber: cardNumber,
      cardName: cardName,
      expDate: expDate,
      ccv: ccv,
    };
    handleCreditCardData(creditCardDetails);
  }

  const handleExpDateChange = (e) => {
    let value = e.target.value.replace(/[^0-9]+/g, ""); // Keep only digits

    if (value.length === 1 && parseInt(value) > 1) {
      // Automatically add a leading zero
      value = "0" + value;
    }

    if (value.length === 2 && parseInt(value) > 12) {
      // Prevent month from being greater than 12
      value = value.substring(0, 1);
      console.log("value", value);
    }

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
    <div className="flex w-full flex-col justify-center items-center relative">
      <h1 className="title text-black dark:text-white">
        {t("creditCardTitle")}
      </h1>
      <div className="card-wrapper">
        <div className="circles">
          <div className="circle circle-1" />
          <div className="circle circle-2" />
        </div>

        <div className="card">
          <form>
            <div className="logo text-gray-900 dark:text-white">
              <i className="material-icons -m-0.5">circle</i>
              <i className="material-icons -m-0.5">circle</i>
              <i className="material-icons -m-0.5">circle</i>
              <i className="material-icons -m-0.5">circle</i>
            </div>
            <div className="card-number">
              <label className="label text-black dark:text-white">
                {t("cardNumber")}
              </label>
              <input
                id="card-number"
                className="text-black dark:text-white placeholder-black dark:placeholder-gray-300"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 1234 1234 1234"
                type="text"
                maxLength="19"
                required
              />
              <span className="card-underline bg-gray-600 dark:bg-white"></span>
            </div>
            <br />
            <div className="group whitespace-nowrap">
              <div className="card-name">
                <label className="label text-black dark:text-white">
                  {t("cardHolder")}
                </label>
                <input
                  id="card-name"
                  className="text-black dark:text-white placeholder-black dark:placeholder-gray-300"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  placeholder="Safa Khier"
                  type="text"
                  required
                />
                <span className="card-underline bg-gray-600 dark:bg-white"></span>
              </div>
              <div className="expiration-date">
                <label className="label text-black dark:text-white">
                  {t("expDate")}
                </label>
                <input
                  id="card-exp"
                  className="text-black dark:text-white placeholder-black dark:placeholder-gray-300"
                  value={expDate}
                  onChange={handleExpDateChange}
                  placeholder="10/25"
                  type="text"
                  maxLength="5"
                  required
                />
                <span className="card-underline bg-gray-600 dark:bg-white"></span>
              </div>
              <div className="ccv">
                <label className="label text-black dark:text-white">
                  {t("cvv")}
                </label>
                <input
                  id="card-ccv"
                  className="text-black dark:text-white placeholder-black dark:placeholder-gray-300"
                  value={ccv}
                  onChange={(e) =>
                    setCcv(e.target.value.replace(/[^0-9]+/g, ""))
                  }
                  placeholder="123"
                  type="text"
                  maxLength="3"
                  required
                />
                <span className="card-underline bg-gray-600 dark:bg-white"></span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreditCardForm;
