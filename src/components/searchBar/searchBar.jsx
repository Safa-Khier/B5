import React, { useState, useEffect } from "react";
import "./searchBar.css"; // Import your stylesheet
import { useTranslation } from "react-i18next";
import { useRecoilState } from "recoil";
import { cryptoData } from "../../atoms/cryptoData";
import { cryptoNews } from "../../atoms/cryptoNews";

const SearchBar = ({ isSearchOpen, searchData }) => {
  const [showMenu, setShowMenu] = useState(isSearchOpen);
  const [animateOut, setAnimateOut] = useState(false);
  const [cryptoCurrenciesData, setCryptoCurrenciesData] =
    useRecoilState(cryptoData);
  const [cryptoCurrenciesNews, setCryptoCurrenciesNews] =
    useRecoilState(cryptoNews);
  const { t } = useTranslation();

  const filterData = (e) => {
    const value = e.target.value.toLowerCase();
    if (searchData === "coins") {
      filterCoinsData(value);
    } else if (searchData === "news") {
      filterNewsData(value);
    }
  };

  const filterNewsData = (value) => {
    const data = [...cryptoCurrenciesNews.data];
    const filteredData = data.filter((news) => {
      return (
        news.title.toLowerCase().includes(value) ||
        news.body.toLowerCase().includes(value) ||
        news.tags.toLowerCase().includes(value) ||
        news.categories.toLowerCase().includes(value)
      );
    });
    setCryptoCurrenciesNews({
      ...cryptoCurrenciesNews,
      filterdData: filteredData,
    });
  };

  const filterCoinsData = (value) => {
    const data = [...cryptoCurrenciesData.data];
    const filteredData = data.filter((crypto) => {
      return (
        crypto.name.toLowerCase().includes(value) ||
        crypto.symbol.toLowerCase().includes(value)
      );
    });
    setCryptoCurrenciesData({
      ...cryptoCurrenciesData,
      filterdData: filteredData,
    });
  };

  useEffect(() => {
    if (!isSearchOpen && showMenu) {
      // Trigger slide-out animation before removing the component
      setAnimateOut(true);
      setTimeout(() => setShowMenu(false), 500); // Match animation duration
    } else if (isSearchOpen && !showMenu) {
      setShowMenu(true);
      setAnimateOut(false);
    }
  }, [isSearchOpen, showMenu]);

  if (!showMenu) return null;

  return (
    <div
      className={`flex flex-col justify-center p-5 items-center w-full rounded-b-2xl -z-10 absolute bg-gray-200 dark:bg-gray-900 opacity-95 font-bold text-black dark:text-white ${animateOut ? "slide-out-top" : "slide-in-top"}`}
    >
      <div className="relative w-full">
        <div className="absolute inset-y-0 start-0 flex items-center pl-2 pointer-events-none material-icons text-gray-500 dark:text-gray-400">
          search
        </div>
        <input
          type="text"
          onChange={filterData}
          className="pl-9 w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder={t("search") + "..."}
        />
      </div>
    </div>
  );
};

export default SearchBar;
