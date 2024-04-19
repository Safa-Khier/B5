import React from "react";
import { useTranslation } from "react-i18next";
import ParticlesBackground from "../../particlesBackground.jsx";
import Footer from "../../footer.jsx";

export default function Welcome() {
  const { t } = useTranslation();
  return (
    <div className="text-slate-950 dark:text-white content">
      <ParticlesBackground />
      <div className="h-full w-full flex flex-col justify-center items-center z-10">
        <h1 className="mb-5 text-6xl font-thin">{t("welcomeTo")}</h1>
        <h1 className="mb-5 text-8xl font-bold">{t("cryptoPulse")}</h1>
      </div>
      <Footer />
    </div>
  );
}
