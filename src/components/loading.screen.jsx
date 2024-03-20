import React from "react";
import Logo from "../assets/icons/logo.png";
import { useTranslation } from "react-i18next";

const LoadingScreen = () => {
  const { t } = useTranslation();
  return (
    <div
      id="loaderBody"
      className="w-full h-full flex flex-col justify-center items-center bg-white"
    >
      <img
        className="flex justify-center items-center max-w-48"
        src={Logo}
        alt={t("cryptoPulse") + " logo"}
      />
      <div className="absolute loader" />
    </div>
  );
};

export default LoadingScreen;
