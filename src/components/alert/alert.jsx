import React from "react";
import "./alert.css"; // Assuming you have a CSS file for styling
import { useTranslation } from "react-i18next";

export default function Alert({
  title,
  message,
  isVisible,
  onClose,
  messageType,
  action,
}) {
  const { t } = useTranslation();
  if (!isVisible) return null;

  const alertActionsButtons = () => {
    if (messageType === undefined) {
      return (
        <button
          className="w-1/4 text-black dark:text-white bg-gray-300 dark:bg-gray-500 p-1.5 hover:bg-gray-200 dark:hover:bg-gray-400 rounded-lg"
          onClick={onClose}
        >
          {t("ok")}
        </button>
      );
    } else {
      return (
        <div className="flex justify-around items-center w-full">
          <button
            className={`w-full max-w-32 mx-1 text-black dark:text-white bg-gray-300 dark:bg-gray-500 p-1.5 hover:bg-gray-200 dark:hover:bg-gray-400 rounded-lg`}
            onClick={onClose}
          >
            {t("cancel")}
          </button>
          <button
            className={`w-full max-w-32 mx-1 text-black dark:text-white ${messageType === "confirm-warnning" ? "bg-red-300 dark:bg-red-500 hover:bg-red-400 dark:hover:bg-red-400" : "bg-green-300 dark:bg-green-500 hover:bg-green-400 dark:hover:bg-green-400"} p-1.5 rounded-lg`}
            onClick={action}
          >
            {t("confirm")}
          </button>
        </div>
      );
    }
  };

  return (
    <div className="alert border border-gray-600 dark:border-white flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-700 min-h-fit">
      <div className="text-2xl w-full font-bold text-black dark:text-white">
        {t(title)}
      </div>

      <div className="text-lg my-5 h-full w-full font-semibold text-black dark:text-white whitespace-pre-line">
        {t(message)}
      </div>

      {alertActionsButtons()}
    </div>
  );
}
