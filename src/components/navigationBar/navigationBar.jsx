import React, { useState, useEffect } from "react";
import Logo from "../../assets/icons/logo.png";
import Usa from "../../assets/icons/usa.png";
import Germany from "../../assets/icons/germany.webp";
import Italy from "../../assets/icons/italy.webp";
import china from "../../assets/icons/china.png";
import Russia from "../../assets/icons/russia.png";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { useRecoilState } from "recoil";
import { webSettings } from "../../atoms/webSettings";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import "./navigationBar.css";
import { useAuth } from "../../AuthContext";
import UserMenu from "../userMenu/userMenu";
import SearchBar from "../searchBar/searchBar";
import { useLocation } from "react-router-dom";
import { setPathLocation } from "../../App";
import Halving from "./halving";

export default function NavigationBar() {
  const { t } = useTranslation();
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [dashboardMenuOpened, setDashboardMenuOpened] = useState(false);

  const [settings, setSettings] = useRecoilState(webSettings);
  const { currentUser, currentUserData } = useAuth();
  const [logo, setLogo] = useState(Usa);
  const [location, setLocation] = useState("");
  const locationPath = useLocation();

  useEffect(() => {
    console.log(currentUserData);
  }, [currentUserData]);

  // Array of button identifiers
  const buttons = [
    { title: "coins", icon: "monetization_on" },
    { title: "news", icon: "feed" },
    { title: "transactions-history", icon: "history" },
  ];

  const dashboardButtons = [
    { title: "cashIn", icon: "shopping_cart" },
    { title: "withdraw", icon: "account_balance" },
  ];

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
  }, [locationPath]);

  useEffect(() => {
    switch (i18n.language) {
      case "en":
        setLogo(Usa);
        break;
      case "de":
        setLogo(Germany);
        break;
      case "it":
        setLogo(Italy);
        break;
      case "zh":
        setLogo(china);
        break;
      case "ru":
        setLogo(Russia);
        break;
      default:
        setLogo(Usa);
    }
  }, [i18n.language]);

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
    i18n.changeLanguage(language);
    setLogo(logo);
  }

  const languageMenuRow = (language, logo) => {
    return (
      <button
        type="button"
        onClick={() => handleLanguageChange(language, logo)}
        className="w-full h-10 px-5 flex items-center text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 gap-2"
      >
        <img src={logo} loading="lazy" width={20} height={20} />
        {t(language)}
      </button>
    );
  };

  return (
    <div className="z-10">
      <nav className="flex flex-wrap items-center justify-between mx-auto p-4 bg-gray-100 border-gray-200 dark:bg-gray-900">
        <div
          className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer"
          onClick={() => setPathLocation("/home")}
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
          {!isHamburgerMenuOpen &&
            (location === "coins" || location === "news") && (
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

        <div className="text-black dark:text-white hidden justify-start items-center lg:order-2 rtl:space-x-reverse xl:flex">
          <img
            className="mr-2"
            src="https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400"
            loading="lazy"
            width={20}
            height={20}
          />
          <Halving />
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
              className="material-icons text-black dark:text-white hover:bg-gray-200 p-2 mx-4 hover:rounded-full dark:hover:bg-gray-700"
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
              className="inline-flex items-center font-medium p-2 text-sm text-gray-900 dark:text-white rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 mr-2"
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
              <div className="z-50 my-4 py-2 font-medium text-base list-none bg-white divide-gray-200 rounded-lg shadow dark:bg-gray-700 absolute origin-top left-0 mt-2 w-max">
                {languageMenuRow("en", Usa)}
                {languageMenuRow("ru", Russia)}
                {languageMenuRow("de", Germany)}
                {languageMenuRow("it", Italy)}
                {languageMenuRow("zh", china)}
              </div>
            )}
          </div>

          {currentUser && currentUserData && (
            <button
              type="button"
              onClick={() => {
                setIsThemeMenuOpen(false);
                setIsLanguageMenuOpen(false);
                setIsUserMenuOpen(!isUserMenuOpen);
              }}
              className={`flex items-center font-medium p-2 text-sm text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700`}
            >
              <i className="material-icons mr-2">account_circle</i>
              <span> {currentUser.displayName} </span>
            </button>
          )}

          {!currentUser || !currentUserData ? (
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
          ) : null}
        </div>
      </nav>
      <SearchBar isSearchOpen={isSearchOpen} searchData={location} />
      <UserMenu isUserMenuOpen={isUserMenuOpen} />
      {isHamburgerMenuOpen && (
        <div
          className="scrollable-content content items-center py-10 absolute md:bg-white bg-opacity-95 md:bg-opacity-5 bg-gray-200 dark:bg-gray-700 md:hidden font-bold text-black dark:text-white"
          style={{
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
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
            <div className="w-full flex items-start">
              <a
                key={"dashboard"}
                href={`/home/dashboard`}
                className="flex h-10 gap-5 w-full px-5 border-b border-gray-400"
                onClick={() => setLocation("dashboard")}
              >
                <i className="material-icons">dashboard</i>
                {t("dashboard")}
              </a>
              <button
                onClick={() => {
                  setDashboardMenuOpened(!dashboardMenuOpened);
                }}
                className="material-icons"
              >
                {dashboardMenuOpened ? "expand_less" : "expand_more"}
              </button>
            </div>
            {dashboardMenuOpened &&
              dashboardButtons.map((button) => (
                <a
                  key={button.title}
                  href={`/home/dashboard/${button.title}`}
                  className="flex w-full pl-10 h-10  "
                  onClick={() => setLocation(button.title)}
                >
                  <div className="w-full flex gap-5 border-b border-gray-400">
                    <i className="material-icons">{button.icon}</i>
                    {t(button.title)}
                  </div>
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
                    onClick={() => handleLanguageChange("ru", Russia)}
                    className="flex justify-between items-center"
                  >
                    Русский
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
