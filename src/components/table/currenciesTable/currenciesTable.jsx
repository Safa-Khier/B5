import React, { useState, useEffect } from "react";
import CurrenciesRow from "./currenciesRow";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { cryptoData } from "../../../atoms/cryptoData";
import { Paging } from "../paging";
import LoadingDataScreen from "../loading.data.screen";

export const CurrenciesTable = (prop) => {
  const { t } = useTranslation();
  const currenciesPerPage = 10;

  const cryptoCurrenciesData = useRecoilValue(cryptoData);
  const [data, setData] = useState(
    [...cryptoCurrenciesData.filterdData].slice(0, currenciesPerPage),
  );
  const [sort, setSort] = useState({ field: "", asc: null });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (
      Math.ceil(cryptoCurrenciesData.filterdData.length / currenciesPerPage) <
      currentPage
    ) {
      setCurrentPage(1);
    }
    handlePageChange();
  }, [cryptoCurrenciesData]);

  const totalPageNumber = () => {
    return (
      Math.ceil(cryptoCurrenciesData.filterdData.length / currenciesPerPage) ||
      1
    );
  };

  useEffect(() => {
    handlePageChange();
  }, [currentPage]);

  function sortData(field) {
    if (sort.field === field) {
      if (sort.asc === false) {
        const sortedData = [...cryptoCurrenciesData.filterdData].sort(
          (a, b) => {
            if (typeof a[field] === "number") {
              return b[field] - a[field];
            } else {
              return ("" + b[field]).localeCompare(a[field]);
            }
          },
        );

        setData(
          sortedData.slice(
            (currentPage - 1) * currenciesPerPage,
            currentPage * currenciesPerPage,
          ),
        );
        setSort({ field, asc: true });
        return;
      }
      handlePageChange();
      setSort({ field: "", asc: null });
      return;
    }
    const sortedData = [...cryptoCurrenciesData.filterdData].sort((a, b) => {
      if (typeof a[field] === "number") {
        return a[field] - b[field];
      } else {
        return ("" + a[field]).localeCompare(b[field]);
      }
    });

    setData(
      sortedData.slice(
        (currentPage - 1) * currenciesPerPage,
        currentPage * currenciesPerPage,
      ),
    );
    setSort({ field, asc: false });
  }

  const headerCell = (field, title) => {
    return (
      <div
        className={`flex py-2 ${title === "name" ? "justify-start" : "justify-end"} items-center`}
      >
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

  function handlePageChange() {
    setData(
      [...cryptoCurrenciesData.filterdData].slice(
        (currentPage - 1) * currenciesPerPage,
        currentPage * currenciesPerPage,
      ),
    );
  }

  return (
    <div>
      {cryptoCurrenciesData.updatedTime ? (
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          {t("lastUpdated")} {cryptoCurrenciesData.updatedTime}
        </div>
      ) : null}

      <table className="w-full h-full">
        <thead>
          <tr className="border-b">
            <th className="cursor-pointer bg-white dark:bg-gray-800 ">#</th>
            <th
              onClick={() => sortData("name")}
              className="cursor-pointer bg-white dark:bg-gray-800 "
            >
              {headerCell("name", "name")}
            </th>
            <th
              onClick={() => sortData("current_price")}
              className="cursor-pointer bg-white dark:bg-gray-800"
            >
              {headerCell("current_price", "price")}
            </th>
            <th
              onClick={() => sortData("price_change_percentage_1h_in_currency")}
              className="cursor-pointer bg-white dark:bg-gray-800 md:table-cell hidden"
            >
              {headerCell("price_change_percentage_1h_in_currency", "1h%")}
            </th>
            <th
              onClick={() =>
                sortData("price_change_percentage_24h_in_currency")
              }
              className="cursor-pointer bg-white dark:bg-gray-800 md:table-cell hidden"
            >
              {headerCell("price_change_percentage_24h_in_currency", "24h%")}
            </th>
            <th
              onClick={() => sortData("price_change_percentage_7d_in_currency")}
              className="cursor-pointer bg-white dark:bg-gray-800 "
            >
              {headerCell("price_change_percentage_7d_in_currency", "7d%")}
            </th>
            <th
              onClick={() => sortData("market_cap")}
              className="cursor-pointer bg-white dark:bg-gray-800 md:table-cell hidden"
            >
              {headerCell("market_cap", "marketCap")}
            </th>
            <th
              onClick={() => sortData("total_volume")}
              className="cursor-pointer bg-white dark:bg-gray-800 md:table-cell hidden"
            >
              {headerCell("total_volume", "volume")}
            </th>
            <th
              onClick={() => sortData("circulating_supply")}
              className="cursor-pointer bg-white dark:bg-gray-800 md:table-cell hidden"
            >
              {headerCell("circulating_supply", "circulatingSupply")}
            </th>
            <th className="cursor-pointer bg-white dark:bg-gray-800 md:table-cell hidden">
              {t("last7Days")}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, index) => (
            <CurrenciesRow
              data={d}
              key={d.id}
              index={index + 1 + (currentPage - 1) * currenciesPerPage}
              header={false}
            />
          ))}
        </tbody>
      </table>
      <div className={`${data.length === 0 ? "" : "hidden"} h-20`}>
        <LoadingDataScreen />
      </div>
      <Paging
        totalPageNumber={totalPageNumber}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default CurrenciesTable;
