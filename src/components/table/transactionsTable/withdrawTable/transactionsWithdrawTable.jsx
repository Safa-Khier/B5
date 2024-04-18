import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import TransactionsWithdrawRow from "./transactionsWithdrawRow";
import { convertTimestampToDate } from "../../../../firebase";
import { Paging } from "../../paging";
import LoadingDataScreen from "../../loading.data.screen";

export default function TransactionsWithdrawTable({
  transactions,
  currencies,
}) {
  const { t } = useTranslation();
  const transactionsPerPage = 7;

  const [transactionsData, setTransactionsData] = useState([]);
  const [data, setData] = useState([]);
  const [sort, setSort] = useState({ field: "", asc: null });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    updateTransactionsData();
  }, [transactions, currencies]);

  function updateTransactionsData() {
    if (!transactions || !currencies) {
      return;
    }
    const transactionsFullData = transactions
      .filter((transaction) => transaction.transactionType === "withdraw") // Only include "buy" transactions
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
    transactionsFullData.sort(
      (a, b) =>
        convertTimestampToDate(b.timestamp) -
        convertTimestampToDate(a.timestamp),
    );

    setTransactionsData(transactionsFullData);
    handlePageChange();
  }

  useEffect(() => {
    if (Math.ceil(data.length / transactionsPerPage) < currentPage) {
      setCurrentPage(1);
    }
    handlePageChange();
  }, [transactionsData]);

  const totalPageNumber = () => {
    return Math.ceil(transactionsData.length / transactionsPerPage) || 1;
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
            <th className="cursor-pointer bg-white dark:bg-gray-800 md:table-cell hidden">
              {headerCell("accountNumber", "accountNumber")}
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
            <TransactionsWithdrawRow
              data={d}
              key={d.id}
              index={index + 1 + (currentPage - 1) * transactionsPerPage}
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
}
