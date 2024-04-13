import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DataSparkline from "../../../table/currenciesTable/dataSparkline.jsx";
import HoldingCoinTable from "../../../table/holdingCoinsTable/holdingCoinsTable.jsx";
import { useAuth } from "../../../../AuthContext.js";
import { mcokCurrencies } from "../../../../../public/mockData.jsx";
import "./dashboard.css";
import { removeTrailingZeros } from "../../../../../public/publicFunctions.jsx";
import Footer from "../../../footer.jsx";
import { setPathLocation } from "../../../../App.jsx";
import { convertTimestampToDate } from "../../../../firebase.js";

export default function Dashboard() {
  const { t } = useTranslation();
  const { currentUser, currentUserData } = useAuth();
  const [walletData, setWalletData] = useState([]);
  const [currenciesData, setCurrenciesData] = useState([]);
  const [transactionsData, setTransactionsData] = useState([]);
  const [displayedCoin, setDisplayedCoin] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState("BTC");

  useEffect(() => {
    // Set the document title when the component mounts
    document.title = t("dashboard") + " | " + t("cryptoPulse");

    // setWalletData(currentUserData.wallet.currencies);
    setCurrenciesData(mcokCurrencies);

    // Optional: Clean up function to set the document title back when the component unmounts
    return () => {
      document.title = t("cryptoPulse");
    };
  }, []);

  useEffect(() => {
    // Update the wallet data when the user data changes
    if (!currentUserData) {
      return;
    }
    if (currenciesData.length === 0) return;
    const holdingCoins = currentUserData.wallet.map((coin) => {
      const currencyData = currenciesData.find(
        (currency) => currency.id === coin.id,
      );
      return { ...coin, ...currencyData };
    });

    setWalletData(holdingCoins);
  }, [currenciesData]);

  useEffect(() => {
    // Update the wallet data when the user data changes
    if (!currentUserData) {
      return;
    }

    console.log(currentUserData.transactions);

    const sortedTransactionsAsc = currentUserData.transactions
      .filter((transaction) => transaction.transactionType !== "trade")
      .sort(
        (a, b) =>
          convertTimestampToDate(a.timestamp) -
          convertTimestampToDate(b.timestamp),
      );
    const accountBalance = sortedTransactionsAsc.map((transaction) => {
      return transaction.accountBalance;
    });
    console.log(accountBalance);
    setTransactionsData(accountBalance);
  }, [currentUserData]);

  function copyUserId() {
    navigator.clipboard
      .writeText(currentUser.uid)
      .then(() => {
        // Show the tooltip
        const tooltip = document.getElementById("tooltip");
        tooltip.style.visibility = "visible";

        // Hide the tooltip after 2 seconds
        setTimeout(() => {
          tooltip.style.visibility = "hidden";
        }, 1500);
      })
      .catch((err) => {
        console.error("Error in copying text: ", err);
      });
  }

  function calculateBalance() {
    // Calculate the balance based on the wallet data
    let balance = 0;
    walletData.forEach((coin) => {
      balance += parseFloat(coin.amount) * coin.current_price;
    });
    if (selectedCoin.toLowerCase() === "usd") {
      return removeTrailingZeros(balance, 10);
    }
    const selectedCoinData = currenciesData.find(
      (coin) => coin.symbol.toLowerCase() === selectedCoin.toLowerCase(),
    );
    if (!selectedCoinData) {
      return removeTrailingZeros(balance, 10);
    }
    balance = balance / selectedCoinData.current_price;
    return removeTrailingZeros(balance, 10);
  }

  function calculateEstimatedValue() {
    // Calculate the estimated value based on the wallet data
    let estimatedValue = 0;
    walletData.forEach((coin) => {
      estimatedValue += parseFloat(coin.amount) * coin.current_price;
    });
    return removeTrailingZeros(estimatedValue, 10);
  }

  return (
    <div className="flex flex-col justify-between scrollable-content overflow-y-auto w-full content">
      <div className="m-2 md:m-5 text-slate-950 dark:text-white flex flex-col items-center gap-5 md:gap-10 ">
        <div className="flex divide-x gap-5 w-full md:w-[70%]">
          <div className="flex justify-center items-center">
            <i className="material-icons" style={{ fontSize: "100px" }}>
              account_circle
            </i>
            <h1 className="text-3xl font-bold ml-2">
              {currentUserData.displayName}
            </h1>
          </div>

          <div className="hidden md:flex justify-center items-center pl-5 gap-10">
            <div className="w-full">
              <h5 className="font-semibold text-gray-400">{t("userID")}</h5>
              <div className="flex justify-center items-center gap-2">
                {currentUserData.uid}
                <div className="relative inline-block">
                  <button
                    id="copyButton"
                    onClick={copyUserId}
                    className="material-icons text-sm text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-400"
                  >
                    content_copy
                  </button>
                  <div
                    id="tooltip"
                    className="tooltip bg-gray-200 dark:bg-gray-600 font-medium text-sm"
                  >
                    {t("userIDcopied")}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full">
              <h5 className="font-semibold text-gray-400">{t("mail")}</h5>
              <p>{currentUserData.email}</p>
            </div>
            <div className="w-full">
              <h5 className="font-semibold text-gray-400">{t("phone")}</h5>
              <p>{currentUserData.phone}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start md:border w-full md:w-[70%] dark:border-gray-500 md:rounded-lg p-2 md:p-5">
          <div className="flex flex-col w-full">
            <h2 className="mb-5 text-xl font-bold">{t("estimatedBalance")}</h2>
            <div className="mb-5 flex items-end">
              <h2 className="text-3xl font-bold me-3">{calculateBalance()}</h2>
              <div className="relative inline-block">
                <button
                  onClick={() => setDisplayedCoin(!displayedCoin)}
                  className="flex items-center"
                >
                  {selectedCoin}
                  <i className="material-icons text-sm text-gray-500 dark:text-gray-300">
                    expand_more
                  </i>
                </button>
                {displayedCoin && (
                  <div className="z-50 w-32 my-4 py-2 font-medium text-base list-none bg-white rounded-lg shadow dark:bg-gray-700 absolute origin-top left-0 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCoin("BTC");
                        setDisplayedCoin(false);
                      }}
                      className={`p-2 flex justify-start items-center hover:bg-gray-100 dark:hover:bg-gray-600 ${selectedCoin === "BTC" ? "text-teal-500 dark:text-custom-teal" : "text-black dark:text-white"}`}
                      style={{ width: "-webkit-fill-available" }}
                    >
                      BTC
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCoin("ETH");
                        setDisplayedCoin(false);
                      }}
                      className={`p-2 flex justify-start items-center hover:bg-gray-100 dark:hover:bg-gray-600 ${selectedCoin === "ETH" ? "text-custom-teal dark:text-custom-teal" : "text-black dark:text-white"}`}
                      style={{ width: "-webkit-fill-available" }}
                    >
                      ETH
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCoin("USD");
                        setDisplayedCoin(false);
                      }}
                      className={`p-2 flex justify-start items-center hover:bg-gray-100 dark:hover:bg-gray-600 ${selectedCoin === "USD" ? "text-custom-teal dark:text-custom-teal" : "text-black dark:text-white"}`}
                      style={{ width: "-webkit-fill-available" }}
                    >
                      USD
                    </button>
                  </div>
                )}
              </div>
            </div>
            <h2 className="mb-5 text-md">
              {"≈ $" + calculateEstimatedValue()}
            </h2>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between font-semibold mb-2 gap-3">
              <button
                onClick={() => setPathLocation("/home/dashboard/deposit")}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 w-full py-2 px-4 rounded-lg"
              >
                {t("deposit")}
              </button>
              <button
                onClick={() => setPathLocation("/home/dashboard/withdraw")}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 w-full py-2 px-4 rounded-lg"
              >
                {t("withdraw")}
              </button>
              <button
                onClick={() => setPathLocation("/home/dashboard/cashin")}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 w-full py-2 px-4 rounded-lg"
              >
                {t("cashIn")}
              </button>
            </div>
            <DataSparkline data={transactionsData} width={400} height={100} />
          </div>
        </div>
        <div className="flex flex-col justify-between items-start w-full md:w-[70%] md:border dark:border-gray-500 md:rounded-lg p-2 md:p-5 ">
          <h2 className="mb-5 text-xl font-bold">{t("holding")}</h2>

          <HoldingCoinTable data={walletData} currenciesData={currenciesData} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
