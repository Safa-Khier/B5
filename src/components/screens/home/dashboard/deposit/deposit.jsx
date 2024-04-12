import React from "react";
import Footer from "../../../../footer";
import { useTranslation } from "react-i18next";

export default function Deposit() {
  const { t } = useTranslation();

  return (
    <div className="scrollable-content overflow-y-auto w-full content flex flex-col justify-between items-center text-black dark:text-white">
      <div></div>
      <Footer />
    </div>
  );
}
