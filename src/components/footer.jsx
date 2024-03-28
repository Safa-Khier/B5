import React from "react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-white dark:bg-gray-800 text-black dark:text-white text-center p-5 pb-24 bottom-0">
      <p>&copy; {new Date().getFullYear() + " " + t("rights")}</p>
    </footer>
  );
}
