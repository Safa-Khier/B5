import React from "react";
import "./alert.css"; // Assuming you have a CSS file for styling
import { useTranslation } from "react-i18next";

export default function Alert({ title, message, isVisible, onClose }) {
  const { t } = useTranslation();
  if (!isVisible) return null;

  return (
    <div className="alert border border-gray-600 dark:border-white flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-700 min-h-fit">
      <div className="text-2xl w-full font-bold text-black dark:text-white">
        {t(title)}
      </div>

      <div className="text-lg my-5 h-full w-full font-semibold text-black dark:text-white">
        {t(message)}
      </div>

      <button
        className="w-1/4 text-black dark:text-white bg-gray-300 dark:bg-gray-500 p-1 hover:bg-gray-200 dark:hover:bg-gray-400 rounded-lg"
        onClick={onClose}
      >
        {t("ok")}
      </button>
    </div>
  );
}
