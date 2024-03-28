import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Footer from "../../footer";

export default function Compare() {
  const { t } = useTranslation();

  useEffect(() => {
    // Set the document title when the component mounts
    document.title = t("compare") + " | " + t("cryptoPulse");

    // Optional: Clean up function to set the document title back when the component unmounts
    return () => {
      document.title = t("cryptoPulse");
    };
  }, []);

  return (
    <div className="scrollable-content overflow-y-auto w-full h-screen">
      <div className="m-5 text-slate-950 dark:text-white h-full">
        <h1 className="mb-5 text-3xl font-bold">{t("compareCurrencies")}</h1>
      </div>
      <Footer />
    </div>
  );
}
