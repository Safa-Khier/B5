import React from "react";
import { useTranslation } from "react-i18next";
import AnimatedBackground from "../../AnimatedBackground";
import Logo from "../../../assets/icons/logoB.png";
import { useAuth } from "../../../AuthContext";

export default function Home() {
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  return (
    <div
      className="text-slate-950 dark:text-white flex justify-center items-center"
      style={{ height: "calc(100vh - 72px)" }}
    >
      <AnimatedBackground />
      <div className="flex justify-center items-center left-1/2 -translate-x-[20%] gap-10">
        <img
          src={Logo}
          alt="CryptoPulse logo"
          className="flex h-auto w-auto md:max-h-[1500px] "
        />
        <div className="flex flex-col w-full text-start">
          <h1 className="mb-5 text-6xl font-thin">{t("welcomeBack")}</h1>
          <h1 className="mb-5 text-8xl font-bold">{currentUser.displayName}</h1>
        </div>
      </div>
    </div>
  );
}
