import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import CreditCardForm from "../../../creditCard/creditCardForm";
import { mcokCurrencies } from "../../../../../public/mockData.jsx";
import { removeTrailingZeros } from "../../../../../public/publicFunctions.jsx";
import Footer from "../../../footer.jsx";
import { addCryptoToTheWallet } from "../../../../firebase.js";
import { useAuth } from "../../../../AuthContext.js";
import Alert from "../../../alert/alert.jsx";
import TransactionsTable from "../../../table/transactionsTable/transactionsTable.jsx";

export default function CashIn() {
  const { t } = useTranslation();

  const { currentUserData } = useAuth();

  const [alertVisible, setAlertVisible] = useState(false);
  const showAlert = () => setAlertVisible(true);
  const hideAlert = () => setAlertVisible(false);
  const [alertData, setAlertData] = useState({
    title: "",
    message: "",
    messageType: "",
    action: null,
  });

  // State to track the active tab
  const [activeTab, setActiveTab] = useState("buy");
  const [currencies, setCurrencied] = useState();
  const [price, setPrice] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState();
  const [creditCardDetails, setCreditCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expDate: "",
    ccv: "",
  });
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabRefs = useRef([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    if (tabRefs.current[activeTab]) {
      const { offsetLeft, clientWidth } = tabRefs.current[activeTab];
      setIndicatorStyle({
        width: clientWidth,
        transform: `translateX(${offsetLeft}px)`, // Use the corrected offset
      });
    }
  }, [activeTab, tabRefs, windowWidth]);

  useEffect(() => {
    setCurrencied(
      mcokCurrencies.map((currency) => ({
        id: currency.id,
        value: currency,
        label: currency.name,
        image: currency.image,
        symbol: currency.symbol,
      })),
    );

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleCreditCardData = (data) => {
    setCreditCardDetails(data);
  };

  function checkCreditCardDetails() {
    if (creditCardDetails.cardNumber.length !== 19) {
      setAlertData({
        title: "error",
        message: "errorInvalidCardNumber",
      });
      showAlert();
      return false;
    }
    if (creditCardDetails.cardName === "") {
      setAlertData({
        title: "error",
        message: "errorInvalidCardName",
      });
      showAlert();
      return false;
    }
    if (creditCardDetails.expDate.length !== 5) {
      setAlertData({
        title: "error",
        message: "errorInvalidExpDate",
      });
      showAlert();
      return false;
    }
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear().toString().slice(2, 4);

    const expDate = creditCardDetails.expDate.split("/");
    if (
      parseInt(expDate[1]) < year ||
      (parseInt(expDate[0]) <= month && parseInt(expDate[1]) == parseInt(year))
    ) {
      setAlertData({
        title: "error",
        message: "errorInvalidExpDate",
      });
      showAlert();
      return false;
    }
    if (creditCardDetails.ccv.length !== 3) {
      setAlertData({
        title: "error",
        message: "errorInvalidCCV",
      });
      showAlert();
      return false;
    }
    return true;
  }

  async function handleBuy() {
    if (!checkCreditCardDetails()) {
      return;
    }
    // Handle buy logic
    if (!selectedCurrency || !price) {
      setAlertData({
        title: "error",
        message: "errorFillAllFields",
      });
      showAlert();
      return;
    }
    const value = price.replace(/[^0-9.]/g, "");
    const amount =
      (parseFloat(value) || 0) / selectedCurrency.value.current_price;

    let accountBalance = selectedCurrency.value.current_price * amount;
    console.log(accountBalance);

    currentUserData.wallet.forEach((currency) => {
      const currencyPrice = currencies.find((c) => c.id === currency.id).value
        .current_price;
      accountBalance += currency.amount * currencyPrice;
    });
    // return;
    try {
      await addCryptoToTheWallet(
        currentUserData,
        selectedCurrency,
        amount,
        value,
        creditCardDetails,
        accountBalance,
      );
      setAlertData({
        title: "Success",
        message: "successBuyCrypto",
      });
      showAlert();
    } catch (error) {
      setAlertData({
        title: "error",
        message: "errorSomethingWentWrong",
      });
      showAlert();
    }
  }

  const handleCardNumberChange = (e) => {
    const input = e.target.value;
    let cleaned = input.replace(/[^\d\s]/g, "");
    let value = cleaned
      .replace(/[^0-9]+/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
    setCreditCardDetails({ ...creditCardDetails, cardNumber: value });
  };

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

    setCreditCardDetails({ ...creditCardDetails, expDate: value });
  };

  // Custom option component
  const CustomOption = ({ innerProps, isFocused, isSelected, data }) => (
    <div
      {...innerProps}
      className={`text-sm flex justify-between items-center p-2 ${isFocused && "bg-gray-300 dark:bg-gray-600"} ${isSelected && "font-bold text-custom-teal"}`}
    >
      <div className="flex justify-start h-[100%] items-center">
        <img
          className="w-6 h-6 mr-2"
          loading="lazy"
          src={data.image}
          alt={data.label + " Logo"}
        />
        <div className="flex flex-col justify-center items-start">
          {data.symbol.toUpperCase()}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {data.label}
          </span>
        </div>
      </div>
      {isSelected && <i className="material-icons">done</i>}
    </div>
  );

  const CustomSingleValue = ({ data }) => (
    <div className="flex items-center">
      <img src={data.image} style={{ width: 20, height: 20, marginRight: 8 }} />
      {"≈ " + currencyAmount() + " " + data.symbol.toUpperCase()}
    </div>
  );

  const currencyAmount = () => {
    if (!selectedCurrency) return 0;
    const value = price.replace(/[^0-9.]/g, "");
    let amount =
      (parseFloat(value) || 0) / selectedCurrency.value.current_price;
    return removeTrailingZeros(amount.toFixed(10));
  };

  // Handle change in input
  const handlePriceChange = (e) => {
    if (e.target.value === "$") {
      setPrice("");
      return;
    }
    // Remove non-numeric chars (except for decimal point)
    const value = e.target.value.replace(/[^0-9.]/g, "");

    if (value === "") {
      setPrice("");
      return;
    }

    if (parseFloat(value) > 20000) {
      return;
    }

    const formattedNumber = parseFloat(value).toLocaleString("en-US");

    // Update the numeric state (convert string to float)
    setPrice("$" + (formattedNumber || 0));
  };

  // Function to render the tab content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "buy":
        return (
          <div className="grid xl:grid-cols-2 h-full w-full xl:p-10 xl:border rounded-xl dark:border-gray-600">
            <div className="w-full max-h-full md:p-5 flex flex-col justify-between items-start text-xl">
              <div className="text-lg w-full h-full flex flex-col gap-10">
                <div className="flex flex-col w-full">
                  <label className="font-bold mb-1">{t("spend")}</label>
                  <input
                    type="text"
                    value={price}
                    className="react-input w-full rounded focus:ring-transparent text-lg"
                    onChange={handlePriceChange}
                    placeholder="$10 - $20,000"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label className="font-bold">Receive</label>
                  <Select
                    value={selectedCurrency}
                    className="react-select-container w-full"
                    classNamePrefix="react-select"
                    placeholder={t("search") + "..."}
                    onChange={(selectedOption) =>
                      setSelectedCurrency(selectedOption)
                    }
                    components={{
                      Option: CustomOption,
                      SingleValue: CustomSingleValue,
                    }}
                    options={currencies}
                  />
                </div>
              </div>

              <button
                onClick={handleBuy}
                className="hidden xl:justify-center xl:flex w-full font-bold bg-custom-teal hover:bg-teal-500 p-3 rounded mt-10"
              >
                Buy
              </button>
            </div>
            <div className="p-14 hidden md:flex">
              <CreditCardForm
                handleCreditCardData={handleCreditCardData}
                hiddenBackground={false}
                disabledFields={false}
                cardDetails={creditCardDetails}
              />
            </div>
            <div className="flex flex-col md:hidden mt-10">
              <label className="font-bold text-xl mb-5">
                {t("creditcardDetails")}
              </label>
              {creditCardFormForSmallScreens()}
            </div>
            <button
              onClick={handleBuy}
              className="flex justify-center xl:hidden w-full font-bold bg-custom-teal hover:bg-teal-500 p-3 rounded mt-10"
            >
              Buy
            </button>
          </div>
        );
      case "sell":
        return (
          <div className="grid grid-cols-2 h-full w-full p-10 border rounded-xl dark:border-gray-600">
            <div className="w-full max-h-full p-5 flex flex-col justify-between items-start text-xl">
              <div className="text-lg w-full h-full flex flex-col gap-10">
                <div className="flex flex-col w-full">
                  <label className="font-bold">Receive</label>
                  <Select
                    value={selectedCurrency}
                    className="react-select-container w-full"
                    classNamePrefix="react-select"
                    placeholder={t("search") + "..."}
                    onChange={(selectedOption) =>
                      setSelectedCurrency(selectedOption)
                    }
                    components={{
                      Option: CustomOption,
                      SingleValue: CustomSingleValue,
                    }}
                    options={currencies}
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label className="font-bold mb-1">{t("spend")}</label>
                  <input
                    type="text"
                    value={price}
                    className="react-input w-full rounded focus:ring-transparent text-lg"
                    onChange={handlePriceChange}
                    placeholder="$10 - $20,000"
                  />
                </div>
              </div>

              <button
                onClick={handleBuy}
                className="w-full font-bold bg-custom-teal hover:bg-teal-500 p-3 rounded"
              >
                Buy
              </button>
            </div>
          </div>
        );
      case "history":
        return (
          <div className="h-full w-full md:p-10 md:border rounded-xl dark:border-gray-600">
            <TransactionsTable
              transactions={currentUserData.transactions}
              currencies={currencies}
            />
          </div>
        );
      default:
        return null;
    }
  };

  function creditCardFormForSmallScreens() {
    return (
      <div className="">
        <label className="font-bold">{t("cardNumber")}</label>
        <input
          type="text"
          value={creditCardDetails.cardNumber}
          className="react-input w-full rounded focus:ring-transparent text-lg"
          onChange={handleCardNumberChange}
          placeholder="1234 1234 1234 1234"
          maxLength="19"
        />
        <label className="font-bold">{t("cardHolder")}</label>
        <input
          type="text"
          value={creditCardDetails.cardName}
          className="react-input w-full rounded focus:ring-transparent text-lg"
          placeholder="Safa Khier"
          onChange={(e) =>
            setCreditCardDetails({
              ...creditCardDetails,
              cardName: e.target.value.toUpperCase(),
            })
          }
        />
        <div className="flex gap-5 w-full">
          <div className="w-full">
            <label className="font-bold">{t("expDate")}</label>
            <input
              type="text"
              value={creditCardDetails.expDate}
              className="react-input w-full rounded focus:ring-transparent text-lg"
              onChange={handleExpDateChange}
              placeholder="10/25"
              maxLength="5"
            />
          </div>
          <div className="w-full">
            <label className="font-bold">{t("cvv")}</label>
            <input
              type="text"
              value={creditCardDetails.ccv}
              onChange={(e) =>
                setCreditCardDetails({
                  ...creditCardDetails,
                  ccv: e.target.value.replace(/[^0-9]+/g, ""),
                })
              }
              className="react-input w-full rounded focus:ring-transparent text-lg"
              maxLength="3"
              placeholder="123"
            />
          </div>
        </div>
      </div>
    );
  }

  const renderTabButtonIcon = (tab) => {
    switch (tab) {
      case "buy":
        return "shopping_cart";
      case "sell":
        return "sell";
      case "history":
        return "history";
      default:
        return "";
    }
  };

  // Function to render the tab content based on the active tab
  const renderTabButton = (tab, title) => {
    return (
      <div
        className={`flex flex-col justify-start items-center text-xl font-semibold ${activeTab === tab && "text-custom-teal"}`}
      >
        <button
          ref={(el) => (tabRefs.current[tab] = el)}
          className="flex justify-center items-center gap-2 p-1 hover:text-gray-500 dark:hover:text-gray-300"
          onClick={() => setActiveTab(tab)}
        >
          <i className="material-icons">{renderTabButtonIcon(tab)}</i>
          {t(title)}
        </button>
      </div>
    );
  };

  return (
    <div className="scrollable-content overflow-y-auto w-full content flex flex-col justify-between">
      <div className="p-5 text-slate-950 dark:text-white flex flex-col items-center justify-start">
        {/* Tab buttons */}
        <div className="w-full xl:w-[80%] flex flex-col justify-center items-start border-b md:p-0">
          <div className="flex justify-between md:justify-start w-full gap-5 relative">
            {renderTabButton("buy", "Buy")}
            {renderTabButton("sell", "Sell")}
            {renderTabButton("history", "History")}
          </div>
          <div
            className="w-full border-2 rounded border-custom-teal"
            style={{
              ...indicatorStyle,
              transition: "width 0.3s ease, transform 0.3s ease",
            }}
          />
        </div>

        {/* Tab content */}
        <div className="pt-5 md:p-5 h-full w-full xl:w-[80%]">
          {renderTabContent()}
        </div>
      </div>
      <Alert
        {...alertData}
        action={handleBuy}
        isVisible={alertVisible}
        onClose={hideAlert}
      />
      <Footer />
    </div>
  );
}
