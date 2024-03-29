import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import CreditCardForm from "./creditCard/creditCardForm";
export default function CashIn() {
  const { t } = useTranslation();

  // State to track the active tab
  const [activeTab, setActiveTab] = useState("buy");

  // Function to render the tab content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "buy":
        return <CreditCardForm />;
      case "sell":
        return (
          <div className="w-full h-40 p-5 border rounded-lg">
            Content for Tab 2
          </div>
        );
      default:
        return null;
    }
  };

  // Function to render the tab content based on the active tab
  const renderTabButton = (tab, title) => {
    return (
      <div
        className={`flex flex-col justify-start items-center text-xl font-semibold ${activeTab === tab && "text-custom-teal"}`}
      >
        <button onClick={() => setActiveTab(tab)}>{t(title)}</button>
        {
          // Render the history icon for the active tab
          activeTab === tab && (
            <div className="border-2 w-2/3 rounded border-custom-teal" />
          )
        }
      </div>
    );
  };

  return (
    <div className="scrollable-content overflow-y-auto w-full h-screen m-5 text-slate-950 dark:text-white flex flex-col items-center justify-start">
      {/* Tab buttons */}
      <div className="w-[60%] flex justify-center items-center border-b">
        <div className="flex w-full gap-5">
          {renderTabButton("buy", "Buy")}
          {renderTabButton("sell", "Sell")}
        </div>
        <button className="flex gap-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
          <i className="material-icons">history</i>
          History
        </button>
      </div>

      {/* Tab content */}
      <div className="m-5 w-[60%]">{renderTabContent()}</div>
    </div>
  );
}
