import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import CreditCardForm from "../../../creditCard/creditCardForm";
import { mcokCurrencies } from "../../../../../public/mockData.jsx";
import { removeTrailingZeros } from "../../../../../public/publicFunctions.jsx";

export default function CashIn() {
  const { t } = useTranslation();

  // State to track the active tab
  const [activeTab, setActiveTab] = useState("buy");
  const [currencies, setCurrencied] = useState();
  const [price, setPrice] = useState();
  const [selectedCurrency, setSelectedCurrency] = useState();

  useEffect(() => {
    setCurrencied(
      mcokCurrencies.map((currency) => ({
        value: currency,
        label: currency.name,
        image: currency.image,
        symbol: currency.symbol,
      })),
      setSelectedCurrency(mcokCurrencies[0].value),
    );
  }, []);

  // Custom option component
  const CustomOption = ({ innerProps, isFocused, isSelected, data }) => (
    <div
      {...innerProps}
      className={`flex justify-between items-center p-2 ${isFocused && "bg-gray-300 dark:bg-gray-600"} ${isSelected && "font-bold text-custom-teal"}`}
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
    if (!selectedCurrency || !price) return 0;
    let amount = price / selectedCurrency.value.current_price;
    return removeTrailingZeros(amount.toFixed(10));
  };

  // Function to render the tab content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "buy":
        return (
          <div className="flex flex-col md:flex-row justify-center md:justify-around md:gap-20 items-center h-[600px] p-10 my-10 border rounded-xl">
            <div className="w-[400px] h-full p-5 flex flex-col justify-between items-start border rounded-xl gap-5">
              <div className="w-full h-full flex flex-col gap-10">
                <div className="flex flex-col w-full">
                  <label className="text-lg font-bold mb-1">Spend</label>
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="react-input w-full rounded focus:ring-transparent"
                    placeholder="$10 - $2,000"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-lg font-bold">Receive</label>
                  <Select
                    value={selectedCurrency}
                    className="react-select-container w-full  "
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

              <button className="w-full bg-custom-teal p-3 rounded">Buy</button>
            </div>
            <CreditCardForm />
          </div>
        );
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
          className="flex justify-center items-center gap-2 p-2 hover:text-gray-500 dark:hover:text-gray-300"
          onClick={() => setActiveTab(tab)}
        >
          <i className="material-icons">{renderTabButtonIcon(tab)}</i>
          {t(title)}
        </button>
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
      <div className="w-[70%] flex justify-center items-center border-b">
        <div className="flex w-full gap-5">
          {renderTabButton("buy", "Buy")}
          {renderTabButton("sell", "Sell")}
          {renderTabButton("history", "History")}
        </div>
      </div>

      {/* Tab content */}
      <div className="m-5 h-full">{renderTabContent()}</div>
    </div>
  );
}
