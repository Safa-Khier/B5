import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import HoldingCoinsRow from "./holdingCoinsRow";

export const holdingCoinTable = (prop) => {
  const currenciesPerPage = 3;

  const [sortedData, setSortedData] = useState([...prop.data]);
  const [data, setData] = useState([...prop.data].slice(0, currenciesPerPage));
  const [sort, setSort] = useState({ field: "", asc: null });
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation();

  useEffect(() => {
    setSortedData([...prop.data]);
    setData([...prop.data].slice(0, currenciesPerPage));
  }, [, prop.data]);

  useEffect(() => {
    handlePageChange();
  }, [sortedData]);

  useEffect(() => {
    handlePageChange();
  }, [currentPage]);

  const totalPageNumber = () => {
    return Math.ceil(sortedData.length / currenciesPerPage);
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

  function nextPage() {
    if (currentPage === totalPageNumber()) {
      return;
    }
    setCurrentPage(currentPage + 1);
  }

  function previousPage() {
    if (currentPage === 1) {
      return;
    }
    setCurrentPage(currentPage - 1);
  }

  function goToPage(page) {
    setCurrentPage(page);
  }

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
            <th className="md:table-cell hidden text-end">{t("trade")}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, index) => (
            <HoldingCoinsRow
              data={d}
              key={d.id}
              header={false}
              currency={prop.currenciesData.find((coin) => coin.id === d.id)}
            />
          ))}
        </tbody>
      </table>
      {totalPageNumber() > 1 && (
        <div className="flex justify-end items-center mt-2">
          <button
            onClick={previousPage}
            className="material-icons w-8 h-8 m-px hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md disabled:opacity-50 hover:disabled:bg-transparent disabled:dark:hover:bg-transparent"
            disabled={currentPage === 1}
          >
            navigate_before
          </button>
          <button
            onClick={() => goToPage(1)}
            className={`w-8 h-8 m-px hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md ${currentPage === 1 ? "bg-gray-200 dark:bg-gray-700" : ""}`}
          >
            1
          </button>
          {currentPage > 3 ? (
            <p className="w-8 h-8 m-px grid text-center items-center">...</p>
          ) : null}
          {Array.from({ length: 5 }, (_, i) => currentPage + i - 2).map(
            (number) => {
              if (number > 1 && number < totalPageNumber()) {
                return (
                  <button
                    onClick={() => goToPage(number)}
                    className={`w-8 h-8 m-px hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md ${currentPage === number ? "bg-gray-200 dark:bg-gray-700" : ""}`}
                  >
                    {number}
                  </button>
                );
              }
            },
          )}
          {currentPage < totalPageNumber() - 3 ? (
            <p className="w-8 h-8 m-px grid text-center items-center">...</p>
          ) : null}
          <button
            onClick={() => goToPage(totalPageNumber())}
            className={`w-8 h-8 m-px hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md ${currentPage === totalPageNumber() ? "bg-gray-200 dark:bg-gray-700" : ""}`}
          >
            {totalPageNumber()}
          </button>
          <button
            onClick={nextPage}
            className="material-icons w-8 h-8 m-px hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md disabled:opacity-50 hover:disabled:bg-transparent disabled:dark:hover:bg-transparent"
            disabled={totalPageNumber() === currentPage}
          >
            navigate_next
          </button>
        </div>
      )}
    </div>
  );
};

export default holdingCoinTable;
