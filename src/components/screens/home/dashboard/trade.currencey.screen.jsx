import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { removeTrailingZeros } from "../../../../../public/publicFunctions";
import Select from "react-select";

const TradeCurrencyScreen = ({ currencies, alert }) => {
  const { t } = useTranslation();
  const [tradeSelectedCurrencyForSell, setTradeSelectedCurrencyForSell] =
    useState();
  const [amountToSpend, setAmountToSpend] = useState("");
  const [tradeSelectedCurrencyForBuy, setTradeSelectedCurrencyForBuy] =
    useState();

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
};

export default TradeCurrencyScreen;
