import React from "react";
import DataSparkline from "./dataSparkline";

export const CurrenciesRow = (prop) => {
  const crypto = prop.data;

  function createVolumeCell(volume, price, symbol) {
    return (
      <div>
        {"$" + format_number(volume)}
        <div className="text-slate-400">
          {format_number(volume / price) + " " + symbol.toUpperCase()}
        </div>
      </div>
    );
  }

  function createChangeElement(change) {
    const changeNegative = change < 0;
    change = changeNegative ? change * -1 : change;

    const change_icon = changeNegative ? "expand_more" : "expand_less";

    //stat_minus_1
    return (
      <div
        className={`flex justify-end items-center ${changeNegative ? "text-red-500" : "text-green-500"}`}
      >
        <i className="material-icons w-4 h-4">{change_icon}</i>
        <div className="ml-3 mt-2 ">{format_number(change)}</div>
      </div>
    );
  }

  function format_number(number) {
    let formattedNumber = number.toFixed(10);
    let numberAsNumber = parseFloat(formattedNumber);
    return numberAsNumber.toLocaleString();
  }

  function getLastUpdateDate() {
    // Create a date object
    const date = new Date(crypto.last_updated);

    // Convert to Israel Standard Time (IST)
    const israelDate = date.toLocaleString("en-US", {
      timeZone: "Asia/Jerusalem",
    });

    return israelDate;
  }

  return (
    <tr className="border-b hover:bg-gray-200 dark:hover:bg-gray-900">
      <td className="py-2 text-center">{prop.index}</td>
      <td className="py-2">
        <div className="flex justify-start h-[100%] items-center">
          <img
            className="w-6 h-6 mr-2"
            loading="lazy"
            src={crypto.image}
            alt={crypto.name + " Logo"}
          />
          <div className="flex flex-col justify-center items-start">
            {crypto.symbol.toUpperCase()}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {crypto.name}
            </span>
          </div>
        </div>
      </td>
      <td className="py-2 text-end">
        {"$" + format_number(crypto.current_price)}
      </td>
      <td className="py-2 md:table-cell hidden text-end">
        {createChangeElement(crypto.price_change_percentage_1h_in_currency)}
      </td>
      <td className="py-2 md:table-cell hidden text-end">
        {createChangeElement(crypto.price_change_percentage_24h_in_currency)}
      </td>
      <td className="py-2 text-end">
        {createChangeElement(crypto.price_change_percentage_7d_in_currency)}
      </td>
      <td className="py-2 md:table-cell hidden text-end">
        {"$" + format_number(crypto.market_cap)}
      </td>
      <td className="py-2 md:table-cell hidden text-end">
        {createVolumeCell(
          crypto.total_volume,
          crypto.current_price,
          crypto.symbol,
        )}
      </td>
      <td className="py-2 md:table-cell hidden text-end">
        {format_number(crypto.circulating_supply) +
          " " +
          crypto.symbol.toUpperCase()}
      </td>

      <td className="py-2 md:table-cell hidden">
        <DataSparkline
          data={crypto.sparkline_in_7d.price}
          width={100}
          height={50}
          updateTime={getLastUpdateDate()}
        />
      </td>
    </tr>
  );
};

export default CurrenciesRow;
