import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import TransactionsBuyTable from "../../table/transactionsTable/buyTable/transactionsBuyTable.jsx";
import TransactionsTradeTable from "../../table/transactionsTable/tradeTable/transactionsTradeTable.jsx";
import { useAuth } from "../../../AuthContext.js";
import Footer from "../../footer.jsx";
import { mcokCurrencies } from "../../../../public/mockData.jsx";
import TransactionsWithdrawTable from "../../table/transactionsTable/withdrawTable/transactionsWithdrawTable.jsx";

export default function TransactionsHistory() {
  const { t } = useTranslation();
  // State to track the active tab

  const { currentUserData } = useAuth();

  const [activeTab, setActiveTab] = useState("buy");
  const [currencies, setCurrencies] = useState([]);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [indicatorStyle, setIndicatorStyle] = useState({
    width: 0,
    transform: `translateX(0px)`, // Use the corrected offset
  });
  const tabRefs = useRef([]);

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
    console.log(currencies);
  }, [currencies]);

  useEffect(() => {
    setCurrencies(
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

  // Function to render the tab content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "buy":
        return (
          <TransactionsBuyTable
            transactions={currentUserData.transactions}
            currencies={currencies}
          />
          //   <div></div>
        );
      case "trade":
        return (
          <TransactionsTradeTable
            transactions={currentUserData.transactions}
            currencies={currencies}
          />
        );
      case "withdraw":
        return (
          <TransactionsWithdrawTable
            transactions={currentUserData.transactions}
            currencies={currencies}
          />
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
      case "withdraw":
        return "account_balance";
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

  return (
    <div className="scrollable-content overflow-y-auto w-full content flex flex-col justify-between">
      <div className="p-5 text-slate-950 dark:text-white flex flex-col items-center justify-start">
        <h1 className="mb-5 text-3xl font-bold w-full">
          {t("transactionsHistory")}
        </h1>
        {/* Tab buttons */}
        <div className="w-full xl:w-[80%] flex flex-col justify-center items-start border-b md:p-0">
          <div className="flex justify-between md:justify-start w-full gap-5 relative">
            {renderTabButton("buy")}
            {renderTabButton("trade")}
            {renderTabButton("withdraw")}
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
      <Footer />
    </div>
  );
}
