import React from "react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-white dark:bg-gray-800 text-black dark:text-white text-center p-5 bottom-0 font-semibold">
      <p>&copy; {new Date().getFullYear() + " " + t("rights")}</p>
    </footer>
  );
}
