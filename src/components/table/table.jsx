import React from "react";
import Row from "./row";
import { useTranslation } from "react-i18next";
import "./table.css";

export const Table = (prop) => {
  const { t } = useTranslation();

  return (
    <table className="table-hover w-full">
      <thead>
        <tr className="stickyHeader">
          <th className="py-3 px-6  bg-white dark:bg-gray-800 ">#</th>
          <th className="py-3 px-6  bg-white dark:bg-gray-800 ">{t("name")}</th>
          <th className="py-3 px-6  bg-white dark:bg-gray-800 ">
            {t("price")}
          </th>
          <th className="py-3 px-6  bg-white dark:bg-gray-800  md:table-cell hidden">
            1h%
          </th>
          <th className="py-3 px-6  bg-white dark:bg-gray-800  md:table-cell hidden">
            24h%
          </th>
          <th className="py-3 px-6  bg-white dark:bg-gray-800 ">7d%</th>
          <th className="py-3 px-6  bg-white dark:bg-gray-800  md:table-cell hidden">
            {t("marketCap")}
          </th>
          <th className="py-3 px-6  bg-white dark:bg-gray-800  md:table-cell hidden">
            {t("volume")}
          </th>
          <th className="py-3 px-6  bg-white dark:bg-gray-800  md:table-cell hidden">
            {t("circulatingSupply")}
          </th>
          <th className="py-3 px-6  bg-white dark:bg-gray-800  md:table-cell hidden">
            {t("last7Days")}
          </th>
        </tr>
      </thead>
      <tbody>
        {prop.data.map((d, index) => (
          <Row data={d} key={d.id} index={index + 1} header={false} />
        ))}
      </tbody>
    </table>
  );
};

export default Table;
