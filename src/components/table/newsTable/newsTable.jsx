import React from "react";
import NewsTab from "./newsTab";

export default function NewsTable({ news }) {
  return news.map((news_object) => {
    return <NewsTab news_object={news_object} key={news_object.id} />;
  });
}
