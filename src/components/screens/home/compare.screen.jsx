import React from "react";
import { useTranslation } from "react-i18next";

export default function Compare() {
  const { t } = useTranslation();
  return (
    <div className="m-5 text-slate-950 dark:text-white">
      <h1 className="mb-5 text-3xl font-bold">{t("compareCurrencies")}</h1>
    </div>
  );
}
