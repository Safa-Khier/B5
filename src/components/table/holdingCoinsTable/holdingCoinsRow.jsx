import React from "react";

export const HoldingCoinsRow = (prop) => {
  const crypto = prop.data;

  function format_number(number) {
    let formattedNumber = number.toFixed(10);
    let numberAsNumber = parseFloat(formattedNumber);
    return numberAsNumber.toLocaleString();
  }

  return (
    <tr className="border-b">
      <td className="py-2 text-start">
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
      <td className="py-2 text-end">{"$" + format_number(crypto.amount)}</td>
      <td className="py-2 md:table-cell hidden text-end">{crypto.amount}</td>
      <td className="py-2 md:table-cell hidden text-end">{crypto.amount}</td>
      <td className="py-2 md:table-cell hidden text-end">{crypto.amount}</td>
    </tr>
  );
};

export default HoldingCoinsRow;
