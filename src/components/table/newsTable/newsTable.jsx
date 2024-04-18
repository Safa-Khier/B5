import React, { useEffect, useState } from "react";
import NewsTab from "./newsTab";
import { Paging } from "../paging";
import LoadingDataScreen from "../loading.data.screen";

export default function NewsTable({ news }) {
  const newsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([...news].slice(0, newsPerPage));

  useEffect(() => {
    if (totalPageNumber() < currentPage) {
      setCurrentPage(1);
    }
    handlePageChange();
  }, [news, currentPage]);

  const totalPageNumber = () => {
    return Math.ceil(news.length / newsPerPage) || 1;
  };

  function handlePageChange() {
    setData(
      [...news].slice(
        (currentPage - 1) * newsPerPage,
        currentPage * newsPerPage,
      ),
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-5">
        {data.map((news_object) => {
          return <NewsTab news_object={news_object} key={news_object.id} />;
        })}
      </div>
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
