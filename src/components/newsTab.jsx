import React from "react";
import { useTranslation } from "react-i18next";

export default function NewsTab({ news_object }) {
  const { t } = useTranslation();

  function formatTimestamp(timestamp) {
    // Check if the timestamp is likely in seconds (reasonable cutoff is year 2001)
    if (timestamp < 10000000000) {
      timestamp *= 1000; // convert to milliseconds
    }

    // Create a new date object using the timestamp
    const date = new Date(timestamp);
    // Format the date as a string in the format: 'YYYY-MM-DD'
    const formattedDate =
      ("0" + date.getDate()).slice(-2) +
      "/" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "/" +
      date.getFullYear();
    return formattedDate;
  }

  return (
    <div className="flex flex-col justify-between rounded-lg shadow-md p-4 bg-gray-100 dark:bg-gray-700">
      <div className="flex items-center">
        <img
          src={news_object.imageurl}
          alt={news_object.title}
          className="w-16 h-16 rounded-full object-cover bg-white p-2"
        />
        <div>
          <h3 className="text-xl font-bold ml-4 dark:text-gray-100">
            {news_object.title}
          </h3>
          <h6 className="text-sm m-4 text-gray-400 dark:text-gray-400">
            {"tags: " + news_object.categories.replaceAll("|", ", ")}
          </h6>
        </div>
      </div>
      <div className="w-full bg-gray-3 bg-gray-300 dark:bg-gray-600 h-px mx-3" />
      <p className="h-full text-gray-600 my-2 dark:text-gray-100">
        {news_object.body}
      </p>
      <div className="flex justify-between items-center">
        <div className="flex items-center text-gray-600 dark:text-gray-100">
          <img
            className="w-6 h-6 mr-2 rounded-full"
            loading="lazy"
            src={news_object.source_info.img}
            alt={news_object.source_info.name}
          />
          <span>{news_object.source_info.name}</span>
        </div>
        {t("publishedAt") + ": " + formatTimestamp(news_object.published_on)}
      </div>
    </div>
  );
}
