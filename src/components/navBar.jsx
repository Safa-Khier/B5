import React, { useState, useEffect } from "react";
import Logo from "../assets/icons/logo.png";
import Usa from "../assets/icons/usa.png";
import Germany from "../assets/icons/germany.webp";
import Italy from "../assets/icons/italy.webp";
import china from "../assets/icons/china.png";
import Russia from "../assets/icons/russia.png";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { useRecoilState } from "recoil";
import { webSettings } from "../atoms/webSettings";
import { setPathLocation } from "../App";

function NavBar() {
  const { t } = useTranslation();
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [settings, setSettings] = useRecoilState(webSettings);
  const [logo, setLogo] = useState(Usa);

  useEffect(() => {
    switch (localStorage.language) {
      case "en":
        setSettings({ ...settings, language: "en" });
        setLogo(Usa);
        i18n.changeLanguage("en");
        break;
      case "de":
        setSettings({ ...settings, language: "de" });
        setLogo(Germany);
        i18n.changeLanguage("de");
        break;
      case "it":
        setSettings({ ...settings, language: "it" });
        setLogo(Italy);
        i18n.changeLanguage("it");
        break;
      case "zh":
        setSettings({ ...settings, language: "zh" });
        setLogo(china);
        i18n.changeLanguage("zh");
        break;
      case "ru":
        setSettings({ ...settings, language: "ru" });
        setLogo(Russia);
        i18n.changeLanguage("ru");
        break;
      default:
        setSettings({ ...settings, language: "en" });
        setLogo(Usa);
        i18n.changeLanguage("en");
    }
  }, [settings.language]);

  function handleThemeChange(theme) {
    setIsThemeMenuOpen(false);
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setSettings({ ...settings, theme: "light" });
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setSettings({ ...settings, theme: "dark" });
    }
  }

  function handleLanguageChange(language, logo) {
    setIsLanguageMenuOpen(false);
    localStorage.language = language;
    i18n.changeLanguage(language);
    setLogo(logo);
    setSettings({ ...settings, language: language });
  }

  const languageMenuRow = (language, logo) => {
    let languageName = "English (US)";
    switch (language) {
      case "de":
        languageName = "Deutsch";
        break;
      case "it":
        languageName = "Italiano";
        break;
      case "zh":
        languageName = "中文 (繁體)";
        break;
      case "ru":
        languageName = "Русский";
        break;
      default:
        languageName = "English (US)";
    }
    return (
      <button
        type="button"
        onClick={() => handleLanguageChange(language, logo)}
        className="h-10 px-5 flex items-center text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
        style={{ width: "-webkit-fill-available" }}
      >
        <img
          src={logo}
          loading="lazy"
          width={20}
          height={20}
          className="mr-2"
        />
        {languageName}
      </button>
    );
  };

  return (
    <nav
      className="bg-white border-gray-200 dark:bg-gray-900"
      style={{ position: "sticky", top: 0, zIndex: 1000 }}
    >
      <div className="flex flex-wrap items-center justify-between mx-auto p-4">
        <div
          className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer"
          onClick={() => setPathLocation("/welcome")}
        >
          <img
            src={Logo}
            loading="lazy"
            alt="CryptoPulse logo"
            className="h-8"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            {t("cryptoPulse")}
          </span>
        </div>

        <div className="flex md:hidden flex-row items-center">
          <button
            onClick={() => setPathLocation("/welcome/signup")}
            type="button"
            className="material-icons text-black dark:text-white hover:bg-gray-100 p-2 mx-2 hover:rounded-full dark:hover:bg-gray-700"
          >
            edit
          </button>
          <button
            onClick={() => setPathLocation("/welcome/login")}
            type="button"
            className="material-icons text-black dark:text-white hover:bg-gray-100 p-2 mx-2 hover:rounded-full dark:hover:bg-gray-700"
          >
            login
          </button>
        </div>

        <div className="hidden md:flex flex-col md:flex-row items-center md:order-2 space-x-2 md:space-x-0 rtl:space-x-reverse">
          <div className="dropdown">
            <button
              onClick={() => {
                setIsLanguageMenuOpen(false);
                setIsThemeMenuOpen(!isThemeMenuOpen);
              }}
              type="button"
              className="material-icons text-black dark:text-white hover:bg-gray-100 p-2 mx-4 hover:rounded-full dark:hover:bg-gray-700"
            >
              <i className="material-icons">
                {settings.theme === "dark" ? "dark_mode" : "light_mode"}
              </i>
            </button>
            {isThemeMenuOpen && (
              <div
                className="z-50 my-4 text-base py-2 font-medium list-none bg-white divide-gray-100 rounded-lg shadow dark:bg-gray-700 absolute origin-top left-0 mt-2"
                style={{ width: "max-content" }}
              >
                <button
                  onClick={() => handleThemeChange("light")}
                  type="button"
                  className="h-10 px-5 flex items-center text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                  style={{ width: "-webkit-fill-available" }}
                >
                  <i className="material-icons mr-2">light_mode</i>
                  {t("lightMode")}
                </button>
                <button
                  onClick={() => handleThemeChange("dark")}
                  type="button"
                  className="h-10 px-5 flex items-center text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                  style={{ width: "-webkit-fill-available" }}
                >
                  <i className="material-icons mr-2">dark_mode</i>
                  {t("darkMode")}
                </button>
              </div>
            )}
          </div>
          <div className="dropdown">
            <button
              onClick={() => {
                setIsThemeMenuOpen(false);
                setIsLanguageMenuOpen(!isLanguageMenuOpen);
              }}
              type="button"
              className="inline-flex items-center font-medium justify-center p-2 text-sm text-gray-900 dark:text-white rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white mr-2"
            >
              <img
                src={logo}
                loading="lazy"
                width={20}
                height={20}
                className="mr-2"
              />
              {/* <i className="material-icons mr-2">translate</i> */}
              {t("languageName")}
              <i className="material-icons">arrow_drop_down</i>
            </button>
            {isLanguageMenuOpen && (
              <div className="z-50 my-4 py-2 font-medium text-base list-none bg-white divide-gray-100 rounded-lg shadow dark:bg-gray-700 absolute origin-top left-0 mt-2 w-max">
                {languageMenuRow("en", Usa)}
                {languageMenuRow("ru", Russia)}
                {languageMenuRow("de", Germany)}
                {languageMenuRow("it", Italy)}
                {languageMenuRow("zh", china)}
              </div>
            )}
          </div>
          <div className="space-x-4">
            <button
              onClick={() => setPathLocation("/welcome/signup")}
              className="text-gray-800 px-2 py-2 rounded-xl dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              {t("signUp")}
            </button>
            <button
              onClick={() => setPathLocation("/welcome/login")}
              className="text-gray-800 px-2 py-2 rounded-xl dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              {t("logIn")}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
