import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import AnimatedBackground from "../../AnimatedBackground.jsx";
import ParticlesBackground from "../../particlesBackground.jsx";
import Logo from "../../../assets/icons/logoB.png";
import { useAuth } from "../../../AuthContext";

export default function Home() {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [userName, setUserName] = useState(currentUser.displayName);

  useEffect(() => {
    // Set the document title when the component mounts
    document.title = t("home") + " | " + t("cryptoPulse");

    // Optional: Clean up function to set the document title back when the component unmounts
    return () => {
      document.title = t("cryptoPulse");
    };
  }, []);

  useEffect(() => {
    setUserName(currentUser.displayName);
  }, [currentUser]);

  return (
    <div className="text-slate-950 dark:text-white scrollable-content overflow-hidden content">
      <ParticlesBackground />
      <div className="h-full flex flex-col md:flex-row justify-start md:justify-center items-center mt-24 md:m-0 md:left-1/2 md:-translate-x-[20%] gap-10">
        <img
          src={Logo}
          loading="lazy"
          alt="CryptoPulse logo"
          className="flex h-auto w-auto max-h-80 md:max-h-[1500px]"
        />
        <div className="flex flex-col w-full text-center md:text-start gap-1 md:gap-5">
          <h1 className="text-4xl md:text-6xl font-thin whitespace-nowrap">
            {t("welcomeBack")}
          </h1>
          <h1 className=" text-6xl md:text-8xl font-bold whitespace-nowrap">
            {currentUser.displayName}
          </h1>
        </div>
      </div>
    </div>
  );
}
