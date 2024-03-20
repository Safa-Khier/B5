import React from "react";
import CryptoSparkline from "./cryptoSparkline";

export const Row = (prop) => {
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
    const className = changeNegative ? "text-red-500" : "text-green-500";

    //stat_minus_1
    return (
      <div className={className + " flex items-center"}>
        <i className="material-icons w-4 h-4">{change_icon}</i>
        <div className="mr-3 ml-3 mt-2 ">{format_number(change)}</div>
      </div>
    );
  }

  function format_number(number) {
    let formattedNumber = number.toFixed(10);
    let numberAsNumber = parseFloat(formattedNumber);
    return numberAsNumber.toLocaleString();
  }

  return (
    <tr className="border-b">
      <td className="py-2 text-center">{prop.index}</td>
      <td className="py-2">
        <div className="flex justify-start h-[100%] items-center">
          <img
            className="w-6 h-6 mr-2"
            src={crypto.image}
            alt={crypto.name + " Logo"}
          />
          {crypto.name}
        </div>
      </td>
      <td className="py-2 text-center">
        {"$" + format_number(crypto.current_price)}
      </td>
      <td className="py-2 md:table-cell hidden text-center">
        {createChangeElement(crypto.price_change_percentage_1h_in_currency)}
      </td>
      <td className="py-2 md:table-cell hidden text-center">
        {createChangeElement(crypto.price_change_percentage_24h_in_currency)}
      </td>
      <td className="py-2 text-center">
        {createChangeElement(crypto.price_change_percentage_7d_in_currency)}
      </td>
      <td className="py-2 md:table-cell hidden text-center">
        {"$" + format_number(crypto.market_cap)}
      </td>
      <td className="py-2 md:table-cell hidden text-end">
        {createVolumeCell(
          crypto.total_volume,
          crypto.current_price,
          crypto.symbol,
        )}
      </td>
      <td className="py-2 md:table-cell hidden text-center">
        {format_number(crypto.circulating_supply) +
          " " +
          crypto.symbol.toUpperCase()}
      </td>

      <td className="py-2 md:table-cell hidden">
        <CryptoSparkline crypto={crypto} />
      </td>
    </tr>
  );
};

export default Row;
