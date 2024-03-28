import React, { useState, useEffect } from "react";
import CurrenciesRow from "./currenciesRow";
import { useTranslation } from "react-i18next";
import "./currenciesTable.css";
import { useRecoilState } from "recoil";
import { cryptoData } from "../../../atoms/cryptoData";

export const CurrenciesTable = (prop) => {
  const currenciesPerPage = 15;

  const [cryptoCurrenciesData, setCryptoCurrenciesData] =
    useRecoilState(cryptoData);
  const [data, setData] = useState(
    [...cryptoCurrenciesData.filterdData].slice(0, currenciesPerPage),
  );
  const [sort, setSort] = useState({ field: "", asc: null });
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [length, setLength] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // Check if the window width is less than 768px, adjust length accordingly
    if (windowWidth < 768) {
      setLength(3); // For mobile devices
    } else {
      setLength(5); // For desktop
    }
  }, [windowWidth]);

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
    return Math.ceil(
      cryptoCurrenciesData.filterdData.length / currenciesPerPage,
    );
  };

  useEffect(() => {
    handlePageChange();
  }, [currentPage]);

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
      [...cryptoCurrenciesData.filterdData].slice(
        (currentPage - 1) * currenciesPerPage,
        currentPage * currenciesPerPage,
      ),
    );
  }

  return (
    <div>
      <table className="table-hover w-full h-full">
        <thead>
          <tr className="stickyHeader">
            <th className="stickyth bg-white dark:bg-gray-800 ">#</th>
            <th
              onClick={() => sortData("name")}
              className="stickyth bg-white dark:bg-gray-800 "
            >
              {headerCell("name", "name")}
            </th>
            <th
              onClick={() => sortData("current_price")}
              className="stickyth bg-white dark:bg-gray-800"
            >
              {headerCell("current_price", "price")}
            </th>
            <th
              onClick={() => sortData("price_change_percentage_1h_in_currency")}
              className="stickyth bg-white dark:bg-gray-800 md:table-cell hidden"
            >
              {headerCell("price_change_percentage_1h_in_currency", "1h%")}
            </th>
            <th
              onClick={() =>
                sortData("price_change_percentage_24h_in_currency")
              }
              className="stickyth bg-white dark:bg-gray-800 md:table-cell hidden"
            >
              {headerCell("price_change_percentage_24h_in_currency", "24h%")}
            </th>
            <th
              onClick={() => sortData("price_change_percentage_7d_in_currency")}
              className="stickyth bg-white dark:bg-gray-800 "
            >
              {headerCell("price_change_percentage_7d_in_currency", "7d%")}
            </th>
            <th
              onClick={() => sortData("market_cap")}
              className="stickyth bg-white dark:bg-gray-800 md:table-cell hidden"
            >
              {headerCell("market_cap", "marketCap")}
            </th>
            <th
              onClick={() => sortData("total_volume")}
              className="stickyth bg-white dark:bg-gray-800 md:table-cell hidden"
            >
              {headerCell("total_volume", "volume")}
            </th>
            <th
              onClick={() => sortData("circulating_supply")}
              className="stickyth bg-white dark:bg-gray-800 md:table-cell hidden"
            >
              {headerCell("circulating_supply", "circulatingSupply")}
            </th>
            <th className="stickyth bg-white dark:bg-gray-800 md:table-cell hidden">
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
      {totalPageNumber() > 1 && (
        <div className="flex justify-end items-center mt-2">
          <button
            onClick={previousPage}
            className="material-icons w-10 h-10 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md disabled:opacity-50 hover:disabled:bg-transparent"
            disabled={currentPage === 1}
          >
            navigate_before
          </button>
          <button
            onClick={() => goToPage(1)}
            className={`w-10 h-10 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md ${currentPage === 1 ? "bg-gray-200 dark:bg-gray-700" : ""}`}
          >
            1
          </button>
          {currentPage > 3 ? (
            <p className="w-10 h-10 grid text-center items-center">...</p>
          ) : null}
          {Array.from(
            { length },
            (_, i) => currentPage + i - (length === 5 ? 2 : 1),
          ).map((number) => {
            console.log(number);
            if (number > 1 && number < totalPageNumber()) {
              return (
                <div>
                  <button
                    onClick={() => goToPage(number)}
                    className={`w-10 h-10 hover:bg-gray-200 dark:hover:bg-gray-600  rounded-md ${currentPage === number ? "bg-gray-200 dark:bg-gray-700" : ""}`}
                  >
                    {number}
                  </button>
                </div>
              );
            }
          })}
          {currentPage < totalPageNumber() - (length === 5 ? 3 : 2) ? (
            <p className="w-10 h-10 grid text-center items-center">...</p>
          ) : null}
          <button
            onClick={() => goToPage(totalPageNumber())}
            className={`w-10 h-10 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md ${currentPage === totalPageNumber() ? "bg-gray-200 dark:bg-gray-700" : ""}`}
          >
            {totalPageNumber()}
          </button>
          <button
            onClick={nextPage}
            className="material-icons w-10 h-10 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md disabled:opacity-50 disabled:hover:bg-transparent disabled:dark:hover:bg-transparent"
            disabled={totalPageNumber() === currentPage}
          >
            navigate_next
          </button>
        </div>
      )}
    </div>
  );
};

export default CurrenciesTable;
