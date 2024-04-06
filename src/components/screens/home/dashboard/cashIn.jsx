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
import TransactionsBuyTable from "../../../table/transactionsTable/transactionsBuyTable.jsx";
import TransactionsTradeTable from "../../../table/transactionsTable/transactionsTradeTable.jsx";
import { isDisabled } from "@testing-library/user-event/dist/cjs/utils/index.js";
import BuyCurrencyScreen from "./buy.currencey.screen.jsx";

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

  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    transform: `translateX(0px)`, // Use the corrected offset
  });
  const tabRefs = useRef([]);

  const [walletCurrencies, setWalletCurrencies] = useState([]);

  const [activeTableTab, setActiveTableTab] = useState("buy");
  const [tableTabIndicatorStyle, setTableTabIndicatorStyle] = useState({
    width: 35,
    transform: `translateX(0px)`, // Use the corrected offset
  });
  const tableTabRefs = useRef([]);

  const [tradeSelectedCurrencyForSell, setTradeSelectedCurrencyForSell] =
    useState();
  const [amountToSpend, setAmountToSpend] = useState("");
  const [tradeSelectedCurrencyForBuy, setTradeSelectedCurrencyForBuy] =
    useState();

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
    if (tableTabRefs.current[activeTableTab]) {
      const { offsetLeft, clientWidth } = tableTabRefs.current[activeTableTab];
      setTableTabIndicatorStyle({
        width: clientWidth,
        transform: `translateX(${offsetLeft}px)`, // Use the corrected offset
      });
    }
  }, [activeTableTab, tableTabRefs, windowWidth]);

  useEffect(() => {
    const walletCurrencies = currentUserData.wallet.map((walletCurrencey) => {
      const currency = mcokCurrencies.find(
        (currency) => currency.id === walletCurrencey.id,
      );
      return {
        amount: walletCurrencey.amount,
        ...currency,
      };
    });

    console.log(walletCurrencies);

    setWalletCurrencies(walletCurrencies);
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

  const handleAlert = ({ title, message, messageType, action }) => {
    setAlertData({
      title: title,
      message: message,
      messageType: messageType,
      action: action,
    });
    showAlert();
  };

  // Custom option component
  const TradeCustomOption = ({ innerProps, isFocused, isSelected, data }) => {
    const isDisabled =
      !isSelected &&
      (data.id === tradeSelectedCurrencyForBuy.id ||
        data === tradeSelectedCurrencyForSell);
    return (
      <div
        {...innerProps}
        className={`text-sm flex justify-between items-center p-2 
        ${isFocused && "bg-gray-300 dark:bg-gray-600"} 
        ${isSelected && "font-bold text-custom-teal"} 
        ${isDisabled && "text-gray-500 dark:text-gray-400 opacity-50"}`}
      >
        <div className="flex justify-start h-[100%] items-center">
          <img
            className="w-6 h-6 mr-2"
            loading="lazy"
            src={data.image}
            alt={data.name + " Logo"}
          />
          <div className="flex flex-col justify-center items-start">
            {data.symbol.toUpperCase()}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {data.name}
            </span>
          </div>
        </div>
        {isSelected ? (
          <i className="material-icons">done</i>
        ) : (
          isDisabled && <i className="material-icons">block</i>
        )}
      </div>
    );
  };

  const CustomSingleValue = ({ data }) => (
    <div className="flex items-center">
      <img src={data.image} style={{ width: 20, height: 20, marginRight: 8 }} />
      {"≈ " + currencyAmount() + " " + data.symbol.toUpperCase()}
    </div>
  );

  const CustomTradeSingleValue = ({ data }) => (
    <div className="flex items-center">
      <img src={data.image} style={{ width: 20, height: 20, marginRight: 8 }} />
      {data.symbol.toUpperCase()}
      <div className="pl-2 text-gray-500 dark:text-gray-400">
        {" (" + data.name + ")"}
      </div>
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
  const handleAmountChange = (e) => {
    // Remove non-numeric chars (except for decimal point)
    const value = e.target.value.replace(/[^0-9.]/g, "");

    if (value === "") {
      setAmountToSpend("");
      return;
    }

    if (!tradeSelectedCurrencyForSell) return "";
    const maxAmount = currentUserData.wallet.find(
      (currency) => tradeSelectedCurrencyForSell.id === currency.id,
    ).amount;

    if (parseFloat(value) > maxAmount) {
      return;
    }

    const formattedNumber = parseFloat(value).toLocaleString("en-US");

    // Update the numeric state (convert string to float)
    setAmountToSpend(formattedNumber || 0);
  };

  const maxSellAmount = () => {
    if (!tradeSelectedCurrencyForSell) return "";
    const maxAmount = currentUserData.wallet.find(
      (currency) => tradeSelectedCurrencyForSell.id === currency.id,
    ).amount;
    return "(Up To ≈ " + maxAmount.toFixed(5) + ")";
  };

  // Function to render the tab content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "buy":
        return (
          <BuyCurrencyScreen currencies={currencies} alert={handleAlert} />
        );
      case "trade":
        return (
          <div className="flex h-full w-full p-10 border rounded-xl dark:border-gray-600 text-lg">
            <div className="w-full max-h-full p-5 flex flex-col justify-between items-start text-xl">
              <div className=" w-full h-full flex flex-col gap-10">
                <div className="flex flex-col w-full">
                  <label className="font-bold">{t("spend")}</label>
                  <Select
                    value={tradeSelectedCurrencyForSell}
                    className="react-select-container w-full"
                    classNamePrefix="react-select"
                    placeholder={t("search") + "..."}
                    onChange={setTradeSelectedCurrencyForSell}
                    isOptionDisabled={(option) => {
                      if (!tradeSelectedCurrencyForBuy) return false;
                      return option.id === tradeSelectedCurrencyForBuy.id;
                    }}
                    components={{
                      Option: TradeCustomOption,
                      SingleValue: CustomTradeSingleValue,
                    }}
                    options={walletCurrencies}
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label className="font-bold mb-1">{t("amount")}</label>
                  <input
                    type="text"
                    value={amountToSpend}
                    className="react-input w-full rounded focus:ring-transparent text-lg"
                    onChange={handleAmountChange}
                    placeholder={`select amount...`}
                  />
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    {`select amount...${maxSellAmount()}`}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <i className="material-icons w-full text-9xl text-custom-teal h-full flex justify-center items-center">
                arrow_forward
              </i>
            </div>
            <div className="w-full p-5 flex flex-col justify-between items-center">
              <div className="flex flex-col w-full">
                <label className="font-bold mb-1">{t("receive")}</label>
                <Select
                  value={tradeSelectedCurrencyForBuy}
                  className="react-select-container w-full"
                  classNamePrefix="react-select"
                  placeholder={t("search") + "..."}
                  isOptionDisabled={(option) => {
                    if (!tradeSelectedCurrencyForSell) return false;
                    return option.id === tradeSelectedCurrencyForSell.id;
                  }}
                  onChange={(selectedOption) =>
                    setTradeSelectedCurrencyForBuy(selectedOption)
                  }
                  components={{
                    Option: TradeCustomOption,
                    SingleValue: CustomSingleValue,
                  }}
                  options={currencies}
                />
              </div>
              <button className="w-full font-bold bg-custom-teal hover:bg-teal-500 p-3 rounded">
                Trade
              </button>
            </div>
          </div>
        );
      case "history":
        return (
          <div className="h-full w-full md:p-10 md:border rounded-xl dark:border-gray-600">
            <div className="relative">
              <div className="flex justify-between md:justify-start w-full gap-5">
                {renderTableTabButton("buy", "buy")}
                {renderTableTabButton("trade", "trade")}
              </div>
              <div
                className="absolute w-full h-full top-0 left-0 rounded bg-custom-teal bg-opacity-60 -z-10"
                style={{
                  ...tableTabIndicatorStyle,
                  transition: "width 0.3s ease, transform 0.3s ease",
                }}
              />
            </div>
            {activeTableTab === "buy" ? (
              <TransactionsBuyTable
                transactions={currentUserData.transactions}
                currencies={currencies}
              />
            ) : (
              <TransactionsTradeTable
                transactions={currentUserData.transactions}
                currencies={currencies}
              />
            )}
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
      case "trade":
        return "compare_arrows";
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

  const renderTableTabButton = (tab, title) => {
    return (
      <div
        className={`flex flex-col justify-start items-center text-md font-semibold ${activeTableTab === tab && "text-white"}`}
      >
        <button
          ref={(el) => (tableTabRefs.current[tab] = el)}
          className={`flex justify-center items-center gap-2 p-1 ${activeTableTab === tab ? "hover:text-gray-800" : "hover:text-custom-teal"}`}
          onClick={() => setActiveTableTab(tab)}
        >
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
            {renderTabButton("trade", "trade")}
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
      <Alert {...alertData} onClose={hideAlert} />
      <Footer />
    </div>
  );
}
