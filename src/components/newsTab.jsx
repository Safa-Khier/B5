import React from "react";

export default function NewsTab({ news_object }) {
  return (
    <div className="rounded-lg shadow-md p-4 bg-gray-100 dark:bg-gray-700">
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
      <div
        className="w-full bg-gray-3 dark:bg-gray-600"
        style={{ height: "1px", margin: "10px 0" }}
      />
      <p className="text-gray-600 my-2 dark:text-gray-100">
        {news_object.body}
      </p>
      <div className="flex items-center text-gray-600 dark:text-gray-100">
        <img
          className="w-6 h-6 mr-2 rounded-full"
          src={news_object.source_info.img}
          alt={news_object.source_info.name}
        />
        <span>{news_object.source_info.name}</span>
      </div>
    </div>
  );
}
