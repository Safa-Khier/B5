import React from "react";

export const HoldingCoinsRow = (prop) => {
  const crypto = prop.data;

  function format_number(number) {
    let formattedNumber = number.toFixed(10);
    let numberAsNumber = parseFloat(formattedNumber);
    return numberAsNumber.toLocaleString();
  }

  function removeTrailingZeros(number) {
    // Convert to string and use a regex to remove trailing zeros
    return number.toString().replace(/(\.\d*?[1-9])0+$|\.0*$/, "$1");
  }

  const amount = () => {
    return (
      <div className="flex flex-col text-md font-semibold">
        {removeTrailingZeros(crypto.amount.toFixed(10))}
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {"$ " +
            removeTrailingZeros(
              (crypto.amount * crypto.current_price).toFixed(10),
            )}
        </span>
      </div>
    );
  };

  return (
    <tr className="border-b hover:bg-gray-200 dark:hover:bg-gray-900">
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
      <td className="py-2 text-end">{amount()}</td>
      <td className="py-2 md:table-cell hidden text-end">{crypto.amount}</td>
      <td className="py-2 md:table-cell hidden text-end">{crypto.amount}</td>
      <td className="py-2 md:table-cell hidden text-end">{crypto.amount}</td>
    </tr>
  );
};

export default HoldingCoinsRow;
