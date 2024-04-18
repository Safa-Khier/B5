import { Navigate, Outlet } from "react-router-dom";
import { useRecoilState } from "recoil";
import { cryptoData } from "./atoms/cryptoData";
import { cryptoNews } from "./atoms/cryptoNews";
import { useEffect } from "react";
import {
  fetchCryptoCurrenciesFromFirestore,
  fetchCryptoNewsFromFirestore,
} from "./firebase.js";

const ProtectedRoute = ({ isAuthenticated }) => {
  const [cryptoCurrenciesData, setCryptoCurrenciesData] =
    useRecoilState(cryptoData);
  const [cryptoCurrenciesNews, setCryptoCurrenciesNews] =
    useRecoilState(cryptoNews);

  useEffect(() => {
    if (isAuthenticated) {
      if (cryptoCurrenciesData.data.length === 0) {
        updateCurrenciesData();
      }
      if (cryptoCurrenciesNews.data.length === 0) {
        updateCryptoNewsData();
      }
    } else {
      setCryptoCurrenciesData({
        data: [],
        filterdData: [],
        updatedTime: null,
      });
      setCryptoCurrenciesNews({
        data: [],
        filterdData: [],
        updatedTime: null,
      });
    }
  }, [isAuthenticated]);

  async function updateCurrenciesData() {
    try {
      const currenciesData = await fetchCryptoCurrenciesFromFirestore();
      console.log(currenciesData);
      setCryptoCurrenciesData({
        data: currenciesData.currencies,
        filterdData: currenciesData.currencies,
        updatedTime: currenciesData.updatedTime,
      });
    } catch (error) {
      console.log("Transaction failed: ", error);
    }
  }

  async function updateCryptoNewsData() {
    try {
      const newsData = await fetchCryptoNewsFromFirestore();
      console.log(newsData);
      setCryptoCurrenciesNews({
        data: newsData.news,
        filterdData: newsData.news,
        updatedTime: newsData.updatedTime,
      });
    } catch (error) {
      console.log("Transaction failed: ", error);
    }
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/welcome" replace />;
};

export default ProtectedRoute;
