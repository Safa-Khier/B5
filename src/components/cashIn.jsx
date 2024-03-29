import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import CreditCardForm from "./creditCard/creditCardForm";

export default function CashIn() {
  const { t } = useTranslation();

  // State to track the active tab
  const [activeTab, setActiveTab] = useState("tab1");

  // Function to render the tab content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "tab1":
        return <div>Content for Tab 1</div>;
      case "tab2":
        return <div>Content for Tab 2</div>;
      case "tab3":
        return <div>Content for Tab 3</div>;
      default:
        return null;
    }
  };

  return (
    <div className="scrollable-content overflow-y-auto w-full h-screen m-5 text-slate-950 dark:text-white">
      {/* Tab buttons */}
      <div>
        <button
          type="select"
          className="selected:text-rose-100"
          onClick={() => setActiveTab("tab1")}
        >
          Tab 1
        </button>
        <button onClick={() => setActiveTab("tab2")}>Tab 2</button>
        <button onClick={() => setActiveTab("tab3")}>Tab 3</button>
      </div>

      {/* Tab content */}
      <div>{renderTabContent()}</div>
    </div>
  );
}
