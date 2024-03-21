import React from "react";
import { useTranslation } from "react-i18next";
import NewsTab from "../../newsTab";

export default function News() {
  const { t } = useTranslation();

  const mockNews = {
    Type: 100,
    Message: "News list successfully returned",
    Promoted: [],
    Data: [
      {
        id: "23857346",
        guid: "https://coingape.com/?p=177570",
        published_on: 1709223954,
        imageurl: "https://images.cryptocompare.com/news/default/coingape.png",
        title: "7 Best Cryptocurrency Futures Trading Platforms in 2024",
        url: "https://coingape.com/best-cryptocurrency-futures-trading-platforms/",
        body: "Crypto futures trading allows traders to predict future price movements and enter agreements to buy or sell assets at predetermined prices on future dates. However, it calls for traders to address and stay strong in the market with higher crypto volatility. In this segment, each market fluctuation becomes an opportunity – and whether you make The post 7 Best Cryptocurrency Futures Trading Platforms in 2024 appeared first on CoinGape .",
        tags: "Top",
        lang: "EN",
        upvotes: "0",
        downvotes: "0",
        categories: "TRADING|MARKET",
        source_info: {
          name: "CoinGape",
          img: "https://images.cryptocompare.com/news/default/coingape.png",
          lang: "EN",
        },
        source: "coingape",
      },
      {
        id: "23857348",
        guid: "https://coingape.com/?p=183309",
        published_on: 1709223954,
        imageurl: "https://images.cryptocompare.com/news/default/coingape.png",
        title: "Bonk Crypto Price Prediction: Whales Set Sight on New ATH",
        url: "https://coingape.com/bonk-crypto-price-prediction-whales-set-sight-on-new-ath/",
        body: "In an intriguing turn of events, aligning with the bullish sentiment prevailing within the broader crypto market, Bonk, a meme coin, gained significant traction across the global crypto realm as it surged nearly 30% today, February 29. This surge by the meme coin promptly garnered noteworthy attention as a Smart Money’s accumulation, pushing the price The post Bonk Crypto Price Prediction: Whales Set Sight on New ATH appeared first on CoinGape .",
        tags: "24/7 Cryptocurrency News|Altcoin News|Bonk (BONK)",
        lang: "EN",
        upvotes: "0",
        downvotes: "0",
        categories: "TRADING|MARKET",
        source_info: {
          name: "CoinGape",
          img: "https://images.cryptocompare.com/news/default/coingape.png",
          lang: "EN",
        },
        source: "coingape",
      },
      {
        id: "23857807",
        guid: "https://coingape.com/?post_type=trending&p=183305",
        published_on: 1709223850,
        imageurl: "https://images.cryptocompare.com/news/default/coingape.png",
        title: "Binance (BNB) Introduced VIP Programs For Non-Crypto Traders",
        url: "https://coingape.com/trending/binance-bnb-introduced-vip-programs-for-non-crypto-traders/",
        body: "Binance is the largest centralized exchange according to the trading volume and has its native token. To expand its reach, Binance has taken one more step, introducing the VIP program. This blog will cover ‘what is this VIP program and how it will affect the BNB prices.’ Understanding the Binance (BNB) VIP Program Binance has The post Binance (BNB) Introduced VIP Programs For Non-Crypto Traders appeared first on CoinGape .",
        tags: "24/7 Cryptocurrency News|Binance (BNB) Coin|binance lawsuit|trending news",
        lang: "EN",
        upvotes: "0",
        downvotes: "0",
        categories: "EXCHANGE|ICO|TRADING",
        source_info: {
          name: "CoinGape",
          img: "https://images.cryptocompare.com/news/default/coingape.png",
          lang: "EN",
        },
        source: "coingape",
      },
    ],
  };

  return (
    <div className="m-5 text-slate-950 dark:text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5">
        <h1 className="text-3xl font-bold">{t("latestNews")}</h1>
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 start-0 flex items-center pl-2 pointer-events-none material-icons text-gray-500 dark:text-gray-400">
            search
          </div>
          <input
            type="text"
            // onChange={filterData}
            className="pl-9 w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={t("search") + "..."}
          />
        </div>
      </div>
      <div className="scrollable-content overflow-y-auto rounded-lg grid gap-4 border-gray-300 dark:border-gray-600 h-[calc(100vh-170px)]">
        {mockNews.Data.map((news) => {
          return <NewsTab news_object={news} key={news.id} />;
        })}
      </div>
    </div>
  );
}
