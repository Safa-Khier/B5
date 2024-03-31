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
import { use } from "i18next";

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

  useEffect(() => {
    if (tabRefs.current[activeTab]) {
      const { offsetLeft, clientWidth } = tabRefs.current[activeTab];
      setIndicatorStyle({
        width: clientWidth,
        transform: `translateX(${offsetLeft}px)`, // Use the corrected offset
      });
    }
  }, [activeTab, tabRefs]);

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

    let accountBalance = 0;
    currentUserData.wallet.forEach((currency) => {
      const currencyPrice = currencies.find((c) => c.id === currency.id).value
        .current_price;
      accountBalance += currency.amount * currencyPrice;
    });

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
          <div className="grid grid-cols-2 h-full w-full p-10 border rounded-xl dark:border-gray-600">
            <div className="w-full max-h-full p-5 flex flex-col justify-between items-start text-xl">
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
                className="w-full font-bold bg-custom-teal hover:bg-teal-500 p-3 rounded"
              >
                Buy
              </button>
            </div>
            <div className="p-14">
              <CreditCardForm handleCreditCardData={handleCreditCardData} />
            </div>
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
          <div className="grid grid-cols-2 h-min w-full p-10 border rounded-xl dark:border-gray-600">
            Content for History Tab
          </div>
        );
      default:
        return null;
    }
  };

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
      <div className=" p-5 text-slate-950 dark:text-white flex flex-col items-center justify-start">
        {/* Tab buttons */}
        <div className="w-[80%] flex flex-col justify-center items-start border-b">
          <div className="flex w-full gap-5 relative">
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
        <div className="p-5 h-full w-[80%]">{renderTabContent()}</div>
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
