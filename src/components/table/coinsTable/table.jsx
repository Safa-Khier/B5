import React, { useState, useEffect } from "react";
import Row from "./row";
import { useTranslation } from "react-i18next";
import "./table.css";
import { useRecoilState } from "recoil";
import { cryptoData } from "../../../atoms/cryptoData";

export const Table = (prop) => {
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
      <div className="flex justify-center items-center">
        {t(title)}
        {checkIfSortedBy(field) ? (
          <i className="material-icons mr-2">
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
      <thead>
        <tr className="stickyHeader">
          <th className="m-3 p-3 stickyth bg-white dark:bg-gray-800 ">#</th>
          <th
            onClick={() => sortData("name")}
            className="m-3 p-3 stickyth bg-white dark:bg-gray-800 "
          >
            {headerCell("name", "name")}
          </th>
          <th
            onClick={() => sortData("current_price")}
            className="m-3 p-3 stickyth bg-white dark:bg-gray-800"
          >
            {headerCell("current_price", "price")}
          </th>
          <th
            onClick={() => sortData("price_change_percentage_1h_in_currency")}
            className="m-3 p-3 stickyth bg-white dark:bg-gray-800  md:table-cell hidden"
          >
            {headerCell("price_change_percentage_1h_in_currency", "1h%")}
          </th>
          <th
            onClick={() => sortData("price_change_percentage_24h_in_currency")}
            className="m-3 p-3 stickyth bg-white dark:bg-gray-800  md:table-cell hidden"
          >
            {headerCell("price_change_percentage_24h_in_currency", "24h%")}
          </th>
          <th
            onClick={() => sortData("price_change_percentage_7d_in_currency")}
            className="m-3 p-3 stickyth bg-white dark:bg-gray-800 "
          >
            {headerCell("price_change_percentage_7d_in_currency", "7d%")}
          </th>
          <th
            onClick={() => sortData("market_cap")}
            className="m-3 p-3 stickyth bg-white dark:bg-gray-800  md:table-cell hidden"
          >
            {headerCell("market_cap", "marketCap")}
          </th>
          <th
            onClick={() => sortData("total_volume")}
            className="m-3 p-3 stickyth bg-white dark:bg-gray-800  md:table-cell hidden"
          >
            {headerCell("total_volume", "volume")}
          </th>
          <th
            onClick={() => sortData("circulating_supply")}
            className="m-3 p-3 stickyth bg-white dark:bg-gray-800  md:table-cell hidden"
          >
            {headerCell("circulating_supply", "circulatingSupply")}
          </th>
          <th className="m-3 p-3 stickyth bg-white dark:bg-gray-800  md:table-cell hidden">
            {t("last7Days")}
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((d, index) => (
          <Row data={d} key={d.id} index={index + 1} header={false} />
        ))}
      </tbody>
    </table>
  );
};

export default Table;
