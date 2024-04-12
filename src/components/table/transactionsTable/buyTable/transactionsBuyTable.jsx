import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import TransactionsBuyRow from "./transactionsBuyRow";
import { convertTimestampToDate } from "../../../../firebase";

export default function TransactionsBuyTable({ transactions, currencies }) {
  const { t } = useTranslation();
  const transactionsPerPage = 7;

  const [transactionsData, setTransactionsData] = useState([]);
  const [data, setData] = useState([]);
  const [sort, setSort] = useState({ field: "", asc: null });
  const [currentPage, setCurrentPage] = useState(1);

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
    updateTransactionsData();
  }, [transactions, currencies]);

  function updateTransactionsData() {
    if (!transactions || !currencies) {
      return;
    }
    const transactionsFullData = transactions
      .filter((transaction) => transaction.transactionType === "buy") // Only include "buy" transactions
      .map((transaction) => {
        const currency = currencies.find(
          (currency) => currency.id === transaction.currencyId,
        );

        if (!currency) {
          return null;
        }

        return {
          ...transaction,
          name: currency.name,
          image: currency.image,
          symbol: currency.symbol,
        };
      })
      .filter((transaction) => transaction !== null);
    console.log(transactionsFullData);
    transactionsFullData.sort(
      (a, b) =>
        convertTimestampToDate(b.timestamp) -
        convertTimestampToDate(a.timestamp),
    );

    setTransactionsData(transactionsFullData);
    console.log("transactions Data", transactionsData);
    handlePageChange();
  }

  useEffect(() => {
    // Check if the window width is less than 768px, adjust length accordingly
    if (windowWidth < 768) {
      setLength(3); // For mobile devices
    } else {
      setLength(5); // For desktop
    }
  }, [windowWidth]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    if (Math.ceil(data.length / transactionsPerPage) < currentPage) {
      setCurrentPage(1);
    }
    handlePageChange();
  }, [transactionsData]);

  const totalPageNumber = () => {
    return Math.ceil(transactionsData.length / transactionsPerPage);
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
      handlePageChange();
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
        className={`flex py-2 ${title === "coin" || title === "spent coin" || title === "type" ? "justify-start" : "justify-end"} items-center`}
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
      transactionsData.slice(
        (currentPage - 1) * transactionsPerPage,
        currentPage * transactionsPerPage,
      ),
    );
  }

  return (
    <div>
      <table className="w-full h-full">
        <thead>
          <tr className="border-b">
            <th
              onClick={() => sortData("name")}
              className="cursor-pointer bg-white dark:bg-gray-800 "
            >
              {headerCell("name", "coin")}
            </th>
            <th
              onClick={() => sortData("amount")}
              className="cursor-pointer bg-white dark:bg-gray-800"
            >
              {headerCell("amount", "amount")}
            </th>
            <th
              onClick={() => sortData("creditCardDetails")}
              className="cursor-pointer bg-white dark:bg-gray-800 md:table-cell hidden"
            >
              {headerCell("creditCardDetails", "cardNumber")}
            </th>
            <th
              onClick={() => sortData("timestamp")}
              className="cursor-pointer bg-white dark:bg-gray-800"
            >
              {headerCell("timestamp", "time")}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, index) => (
            <TransactionsBuyRow
              data={d}
              key={d.id}
              index={index + 1 + (currentPage - 1) * transactionsPerPage}
              header={false}
            />
          ))}
        </tbody>
      </table>

      {totalPageNumber() > 1 && (
        <div className="flex justify-end items-center mt-2">
          <button
            onClick={previousPage}
            className="material-icons w-8 h-8 m-px hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md disabled:opacity-50 disabled:hover:bg-transparent disabled:dark:hover:bg-transparent"
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
          {Array.from(
            { length },
            (_, i) => currentPage + i - (length === 5 ? 2 : 1),
          ).map((number) => {
            if (number > 1 && number < totalPageNumber()) {
              return (
                <button
                  key={`pageButton-${number}`}
                  onClick={() => goToPage(number)}
                  className={`w-8 h-8 m-px hover:bg-gray-200 dark:hover:bg-gray-600  rounded-md ${currentPage === number ? "bg-gray-200 dark:bg-gray-700" : ""}`}
                >
                  {number}
                </button>
              );
            }
          })}
          {currentPage < totalPageNumber() - (length === 5 ? 3 : 2) ? (
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
            className="material-icons w-8 h-8 m-px hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md disabled:opacity-50 disabled:hover:bg-transparent disabled:dark:hover:bg-transparent"
            disabled={totalPageNumber() === currentPage}
          >
            navigate_next
          </button>
        </div>
      )}
    </div>
  );
}
