import React from "react";
import Logo from "../assets/icons/logo.png";
import { useTranslation } from "react-i18next";

const LoadingScreen = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className=" flex flex-col justify-center items-center bg-white">
        <img
          className="flex justify-center items-center max-w-48"
          loading="lazy"
          src={Logo}
          alt={t("cryptoPulse") + " logo"}
        />
        <div className="absolute loader" />
      </div>
      <h1 className="m-10 text-5xl font-bold text-gray-800 dark:text-gray-100">
        {t("loading")}
      </h1>
    </div>
  );
};

export default LoadingScreen;
