import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import HoldingCoinsRow from "./holdingCoinsRow";
import { Paging } from "../paging";
import LoadingDataScreen from "../loading.data.screen";

export const holdingCoinTable = (prop) => {
  const { t } = useTranslation();
  const currenciesPerPage = 3;

  const [sortedData, setSortedData] = useState([...prop.data]);
  const [data, setData] = useState([...prop.data].slice(0, currenciesPerPage));
  const [sort, setSort] = useState({ field: "", asc: null });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setSortedData([...prop.data]);
    setData([...prop.data].slice(0, currenciesPerPage));
  }, [prop.data]);

  useEffect(() => {
    handlePageChange();
  }, [sortedData, currentPage]);

  const totalPageNumber = () => {
    return Math.ceil(sortedData.length / currenciesPerPage) || 1;
  };

  function sortData(field) {
    if (sort.field === field) {
      if (sort.asc === false) {
        setSortedData(
          [...prop.data].sort((a, b) => {
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
      setSortedData([...prop.data]);
      setSort({ field: "", asc: null });
      return;
    }
    setSortedData(
      [...prop.data].sort((a, b) => {
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

  function handlePageChange() {
    setData(
      [...sortedData].slice(
        (currentPage - 1) * currenciesPerPage,
        currentPage * currenciesPerPage,
      ),
    );
  }

  function checkIfSortedBy(field) {
    return sort.field === field;
  }

  return (
    <div className="w-full">
      <table className="w-full">
        <thead className="w-full">
          <tr className="bg-white dark:bg-gray-800 border-b">
            <th className="text-start">{t("coin")}</th>
            <th onClick={() => sortData("amount")} className="text-end ">
              {headerCell("amount", "amount")}
            </th>
            <th
              onClick={() => sortData("current_price")}
              className="md:table-cell hidden text-end"
            >
              {headerCell("current_price", "coinPrice")}
            </th>
            <th
              onClick={() =>
                sortData("price_change_percentage_24h_in_currency")
              }
              className="md:table-cell hidden text-end"
            >
              {headerCell(
                "price_change_percentage_24h_in_currency",
                "today'sPnL",
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <HoldingCoinsRow data={d} key={d.id} header={false} />
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

export default holdingCoinTable;
