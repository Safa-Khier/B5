import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { mcokCurrencies } from "../../../../../../public/mockData.jsx";
import Footer from "../../../../footer.jsx";
import { useAuth } from "../../../../../AuthContext.js";
import Alert from "../../../../alert/alert.jsx";
import TransactionsBuyTable from "../../../../table/transactionsTable/transactionsBuyTable.jsx";
import TransactionsTradeTable from "../../../../table/transactionsTable/transactionsTradeTable.jsx";
import BuyCurrencyScreen from "./buy.currencey.screen.jsx";
import TradeCurrencyScreen from "./trade.currencey.screen.jsx";

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

  const [activeTableTab, setActiveTableTab] = useState("buy");
  const [tableTabIndicatorStyle, setTableTabIndicatorStyle] = useState({
    width: 35,
    transform: `translateX(0px)`, // Use the corrected offset
  });
  const tableTabRefs = useRef([]);

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
    setCurrencied(
      mcokCurrencies.map((currency) => ({
        id: currency.id,
        label: currency.name,
        image: currency.image,
        symbol: currency.symbol,
        ...currency,
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

  // Function to render the tab content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "buy":
        return (
          <BuyCurrencyScreen currencies={currencies} alert={handleAlert} />
        );
      case "trade":
        return (
          <TradeCurrencyScreen
            currencies={currencies}
            currentUserData={currentUserData}
            alert={handleAlert}
          />
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
  const renderTabButton = (tab) => {
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
          {t(tab)}
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
            {renderTabButton("buy")}
            {renderTabButton("trade")}
            {renderTabButton("history")}
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
