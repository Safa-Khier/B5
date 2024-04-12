import React, { useEffect, useState } from "react";
import Footer from "../../../../footer";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { mcokCurrencies } from "../../../../../../public/mockData.jsx";
import { useAuth } from "../../../../../AuthContext.js";

export default function Withdraw() {
  const { t } = useTranslation();
  const { currentUserData } = useAuth();
  const [selectedCurrency, setSelectedCurrency] = useState();
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const walletCurrencies = currentUserData.wallet.map((walletCurrency) => {
      const currency = mcokCurrencies.find(
        (currency) => currency.id === walletCurrency.id,
      );
      return {
        ...currency,
        ...walletCurrency,
        label: currency.name,
      };
    });

    setCurrencies(walletCurrencies);
  }, []);

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

  const SelectValue = ({ data }) => (
    <div className="flex items-center">
      <img src={data.image} style={{ width: 20, height: 20, marginRight: 8 }} />
      {data.symbol.toUpperCase() + " (" + data.label + ")"}
    </div>
  );

  const handleAmountChange = (e) => {
    // Get the raw input value
    let value = e.target.value;

    if (value === ".") {
      value = "0.";
    }

    // Remove leading zeros and non-numeric chars except for the first decimal point
    value = value.replace(/[^0-9.]/g, "");
    const parts = value.split(".");
    if (parts.length > 2) {
      // If there are multiple dots, keep only the first part and the second part separated by a dot
      value = parts[0] + "." + parts.slice(1).join("");
    }

    // If the value is an empty string or only a dot, update the state accordingly and exit
    if (value === "" || value === ".") {
      setAmount(value);
      return;
    }

    // Check if there is a selected spendCurrency
    if (!selectedCurrency) return "";

    // Find the maxAmount for the selected currency
    const maxAmount = maxWithdrawAmount();

    // If the input value exceeds maxAmount, ignore it
    const numericValue = parseFloat(value);
    if (numericValue > maxAmount) {
      return;
    }

    // Update the state with the cleaned-up, yet unformatted value, to preserve input behavior
    setAmount(value);
  };

  const maxWithdrawAmount = () => {
    if (!selectedCurrency) return 0;
    const maxAmount =
      currentUserData.wallet.find(
        (currency) => selectedCurrency.id === currency.id,
      )?.amount || 0;
    return maxAmount;
  };

  const amountMessage = () => {
    if (!selectedCurrency) return "Select a currency to withdraw First...";
    const maxAmount = maxWithdrawAmount();
    return `Max: ${maxAmount} ${selectedCurrency.symbol.toUpperCase()}`;
  };

  return (
    <div className="scrollable-content overflow-y-auto w-full content flex flex-col justify-between items-center text-black dark:text-white">
      <div className="flex w-full md:w-[70%] justify-center md:border rounded-lg md:m-10 p-5">
        <div className="flex flex-col w-full gap-10">
          <div className="flex flex-col w-full">
            <label className="font-bold">{t("currency")}</label>
            <Select
              className="react-select-container w-full"
              classNamePrefix="react-select"
              placeholder={t("search") + "..."}
              isOptionSelected={(option) => {
                if (!selectedCurrency) return false;
                return option.id === selectedCurrency.id;
              }}
              onChange={setSelectedCurrency}
              components={{
                Option: CustomOption,
                SingleValue: SelectValue,
              }}
              options={currencies}
              value={selectedCurrency}
              isClearable={true}
              isLoading={currencies.length === 0}
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="font-bold mb-1">{t("amount")}</label>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              className="react-input w-full rounded focus:ring-transparent text-lg"
              placeholder="Select amount to withdraw..."
              disabled={!selectedCurrency}
            />
            <p className="text-sm text-gray-400">{amountMessage()}</p>
          </div>
          <button className="hidden xl:justify-center xl:flex w-full font-bold bg-custom-teal hover:bg-teal-500 p-3 rounded mt-10">
            {t("withdraw")}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
