import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
// import "./table.css";
import { useRecoilState } from "recoil";
import { cryptoData } from "../../../atoms/cryptoData";
import HoldingCoinsRow from "./holdingCoinsRow";

export const holdingCoinTable = (prop) => {
  const [cryptoCurrenciesData, setCryptoCurrenciesData] =
    useRecoilState(cryptoData);
  const [data, setData] = useState([...cryptoCurrenciesData.filterdData]);
  const [sort, setSort] = useState({ field: "", asc: null });
  const { t } = useTranslation();

  useEffect(() => {
    setData([...cryptoCurrenciesData.filterdData]);
  }, [cryptoCurrenciesData]);

  function sortData(field) {
    if (sort.field === field) {
      if (sort.asc === false) {
        setData(
          data.sort((a, b) => {
            if (typeof a[field] === "number") {
              return b[field] - a[field];
            } else {
              return ("" + b[field]).localeCompare(a[field]);
            }
          }),
        );
        setSort({ field, asc: true });
        return;
      }
      setData([...cryptoCurrenciesData.filterdData]);
      setSort({ field: "", asc: null });
      return;
    }
    setData(
      data.sort((a, b) => {
        if (typeof a[field] === "number") {
          return a[field] - b[field];
        } else {
          return ("" + a[field]).localeCompare(b[field]);
        }
      }),
    );
    setSort({ field, asc: false });
  }

  const headerCell = (field, title) => {
    return (
      <div className="flex justify-end items-center">
        {t(title)}
        {checkIfSortedBy(field) ? (
          <i className="material-icons">
            {sort.asc ? "expand_less" : "expand_more"}
          </i>
        ) : null}
      </div>
    );
  };

  function checkIfSortedBy(field) {
    return sort.field === field;
  }

  return (
    <table className="table-hover w-full">
      <thead className="w-full">
        <tr className="bg-white dark:bg-gray-800 border-b">
          <th className="text-start">Coin</th>
          <th onClick={() => sortData("amount")} className="text-end ">
            {headerCell("amount", "Amount")}
          </th>
          <th
            onClick={() => sortData("current_price")}
            className="md:table-cell hidden text-end"
          >
            {headerCell("current_price", "Coin Price")}
          </th>
          <th
            onClick={() => sortData("price_change_percentage_24h_in_currency")}
            className="md:table-cell hidden text-end"
          >
            {headerCell(
              "price_change_percentage_24h_in_currency",
              "Today's PnL",
            )}
          </th>
          <th className="md:table-cell hidden text-end">Trade</th>
        </tr>
      </thead>
      <tbody>
        {prop.data.map((d, index) => (
          <HoldingCoinsRow
            data={d}
            key={d.id}
            index={index + 1}
            header={false}
          />
        ))}
      </tbody>
    </table>
  );
};

export default holdingCoinTable;
