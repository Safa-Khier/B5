import React, { useState, useEffect } from "react";
import Logo from "../assets/icons/logo.png";
import Usa from "../assets/icons/usa.png";
import Germany from "../assets/icons/germany.webp";
import Italy from "../assets/icons/italy.webp";
import china from "../assets/icons/china.png";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { useRecoilState } from "recoil";
import { webSettings } from "../atoms/webSettings";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import "./authenticatedNavBar.css";
import { useAuth } from "../AuthContext";
import UserMenu from "./userMenu/userMenu";
import SearchBar from "./searchBar/searchBar";
import { useLocation } from "react-router-dom";

export default function AuthenticatedNavBar() {
  const { t } = useTranslation();
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [settings, setSettings] = useRecoilState(webSettings);
  const { currentUser } = useAuth();
  const [logo, setLogo] = useState(Usa);
  const [location, setLocation] = useState("");
  const locationPath = useLocation();

  // Array of button identifiers
  const buttons = [
    { title: "coins", icon: "monetization_on" },
    { title: "news", icon: "feed" },
    { title: "compare", icon: "compare_arrows" },
  ];

  const selectedButtonClass = "text-blue-700 dark:text-blue-500";
  const unselectedButtonClass =
    "text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-300 dark:border-gray-700";

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      alert(error.message); // Show error message
    }
  };

  useEffect(() => {
    const splitedPath = locationPath.pathname.split("/");
    setLocation(splitedPath[splitedPath.length - 1]);
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
    <div className="sticky top-0 z-[1000]">
      <nav className="flex flex-wrap items-center justify-between mx-auto p-4 bg-gray-100 border-gray-200 dark:bg-gray-900">
        <div
          className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer"
          onClick={() => window.location.replace("/home")}
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
        <div className="flex md:order-2">
          {!isHamburgerMenuOpen && location !== "home" && (
            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`inline-flex items-center p-2 mr-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600`}
            >
              <i className="material-icons">search</i>
            </button>
          )}

          <div className="dropdown">
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen(false);
                setIsHamburgerMenuOpen(!isHamburgerMenuOpen);
              }}
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <i className="material-icons">
                {isHamburgerMenuOpen ? "close" : "menu"}
              </i>
            </button>
          </div>
        </div>
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
          <ul className="flex flex-col items-center p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-100 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {
              // Map the buttons array to create the buttons
              buttons.map((button) => (
                <li key={button.title}>
                  <a
                    href={`/home/${button.title}`}
                    className={
                      location === button.title
                        ? selectedButtonClass
                        : unselectedButtonClass
                    }
                  >
                    {t(button.title)}
                  </a>
                </li>
              ))
            }
          </ul>
        </div>

        <div className="hidden items-center md:order-2 space-x-2 md:space-x-0 rtl:space-x-reverse md:flex">
          <div className="dropdown">
            <button
              onClick={() => {
                setIsLanguageMenuOpen(false);
                setIsUserMenuOpen(false);
                setIsThemeMenuOpen(!isThemeMenuOpen);
              }}
              type="button"
              className="material-icons text-black dark:text-white hover:bg-gray-100 p-2 mx-4 hover:rounded-full dark:hover:bg-gray-700"
            >
              {settings.theme === "dark" ? "dark_mode" : "light_mode"}
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
                setIsUserMenuOpen(false);
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
                {languageMenuRow("de", Germany)}
                {languageMenuRow("it", Italy)}
                {languageMenuRow("zh", china)}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setIsThemeMenuOpen(false);
              setIsLanguageMenuOpen(false);
              setIsUserMenuOpen(!isUserMenuOpen);
            }}
            className="inline-flex items-center font-medium justify-center p-2 text-sm text-gray-900 dark:text-white rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <i className="material-icons mr-2">account_circle</i>
            <span> {currentUser.displayName} </span>
          </button>
        </div>
      </nav>
      <SearchBar isSearchOpen={isSearchOpen} searchData={location} />
      <UserMenu isUserMenuOpen={isUserMenuOpen} />
      {isHamburgerMenuOpen && (
        <div className="flex justify-center items-start py-10 absolute bg-gray-200 dark:bg-gray-700 md:hidden w-full h-screen opacity-95 font-bold text-black dark:text-white">
          <div className="w-[75%] flex flex-col justify-center items-center gap-4">
            <div className="flex flex-col justify-center items-center gap-3">
              <i className="material-icons" style={{ fontSize: "100px" }}>
                account_circle
              </i>
              <p>{currentUser.displayName}</p>
            </div>
            {buttons.map((button) => (
              <a
                key={button.title}
                href={`/home/${button.title}`}
                className="flex h-10 gap-5 w-full px-5 border-b border-gray-400"
                onClick={() => setLocation(button.title)}
              >
                <i className="material-icons">{button.icon}</i>
                {t(button.title)}
              </a>
            ))}
            <div className="w-full py-2">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="flex justify-between items-center gap-1"
              >
                <i className="material-icons">translate</i>
                {t("languageName")}
                <i className="material-icons">expand_more</i>
              </button>
              {isLanguageMenuOpen && (
                <div className="flex flex-col justify-center items-start gap-3 py-2 px-7">
                  <button
                    onClick={() => handleLanguageChange("en", Usa)}
                    className="flex justify-between items-center"
                  >
                    English (US)
                  </button>
                  <button
                    onClick={() => handleLanguageChange("de", Germany)}
                    className="flex justify-between items-center"
                  >
                    Deutsch
                  </button>
                  <button
                    onClick={() => handleLanguageChange("it", Italy)}
                    className="flex justify-between items-center"
                  >
                    Italiano
                  </button>
                  <button
                    onClick={() => handleLanguageChange("zh", china)}
                    className="flex justify-between items-center"
                  >
                    中文 (繁體)
                  </button>
                </div>
              )}
            </div>
            <div className="w-full p-5 h-12 flex justify-between items-center bg-gray-300 dark:bg-gray-800 rounded-lg">
              {t("darkMode")}

              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.theme === "dark" ? true : false}
                  onChange={(e) =>
                    handleThemeChange(e.target.checked ? "dark" : "light")
                  }
                />
                <span className="switch" />
              </label>
            </div>
            <button
              className="w-full p-5 h-12 flex justify-start items-center bg-gray-300 dark:bg-gray-800 rounded-lg gap-2 hover:bg-gray-400 dark:hover:bg-gray-900"
              onClick={handleSignOut}
            >
              <i className="material-icons">logout</i>
              {t("signOut")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
