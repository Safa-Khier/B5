import React, { useState, useEffect } from "react";
import Logo from "../assets/icons/logo.png";
import Usa from "../assets/icons/usa.png";
import Germany from "../assets/icons/germany.webp";
import Italy from "../assets/icons/italy.webp";
import japan from "../assets/icons/japan.png";
import UserIcon from "../assets/icons/userIcon.webp";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { useRecoilState } from "recoil";
import { webSettings } from "../atoms/webSettings";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import "./authenticatedNavBar.css";

export default function AuthenticatedNavBar() {
  const { t } = useTranslation();
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const [settings, setSettings] = useRecoilState(webSettings);

  // Array of button identifiers
  const buttons = [
    { title: "coins", icon: "monetization_on" },
    { title: "news", icon: "feed" },
    { title: "compare", icon: "compare_arrows" },
  ];

  const selectedClassList =
    "block py-2 px-3 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500";
  const nonSelectedClassList =
    "block py-2 px-3 text-gray-900 dark:text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700";

  // Event handler to update the selected button
  const handleButtonClick = (button) => {
    setSettings({ ...settings, selectedTab: button });
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      alert(error.message); // Show error message
    }
  };

  useEffect(() => {
    switch (localStorage.language) {
      case "en":
        setSettings({ ...settings, language: "en", languageLogo: Usa });
        i18n.changeLanguage("en");
        break;
      case "de":
        setSettings({ ...settings, language: "de", languageLogo: Germany });
        i18n.changeLanguage("de");
        break;
      case "it":
        setSettings({ ...settings, language: "it", languageLogo: Italy });
        i18n.changeLanguage("it");
        break;
      case "zh":
        setSettings({ ...settings, language: "zh", languageLogo: japan });
        i18n.changeLanguage("zh");
        break;
      default:
        setSettings({ ...settings, language: "en", languageLogo: Usa });
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
    setSettings({ ...settings, language: language, languageLogo: logo });
  }

  return (
    <div className="sticky top-0 z-[1000]">
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="flex flex-wrap items-center justify-between mx-auto p-4">
          <div
            className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer"
            onClick={() => window.location.replace("/home")}
          >
            <img src={Logo} alt="CryptoPulse logo" className="h-8" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              {t("cryptoPulse")}
            </span>
          </div>
          <div className="flex md:order-2">
            <button
              type="button"
              data-collapse-toggle="navbar-search"
              aria-controls="navbar-search"
              aria-expanded="false"
              className="inline-flex items-center p-2 mr-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Search</span>
              <i className="material-icons">search</i>
            </button>
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 start-0 flex items-center pl-2 pointer-events-none">
                <i className="material-icons text-gray-900 dark:text-gray-400">
                  search
                </i>
              </div>
              <input
                type="text"
                id="search-navbar"
                className="pl-9 block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={t("search") + "..."}
              />
            </div>
            <div className="dropdown">
              <button
                type="button"
                onClick={() => setIsHamburgerMenuOpen(!isHamburgerMenuOpen)}
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="navbar-search"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <i className="material-icons">
                  {isHamburgerMenuOpen ? "close" : "menu"}
                </i>
              </button>
              {false && (
                <div className="z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 absolute origin-top right-0 mt-2 w-max">
                  <ul className="py-2 font-medium" role="none">
                    <li>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="h-10 px-5 flex items-center text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        style={{ width: "-webkit-fill-available" }}
                      >
                        <i className="material-icons">logout</i>
                        Log Out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-search"
          >
            {/* <div className="relative mt-3 md:hidden">
            <div className="absolute inset-y-0 start-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
          </div> */}
            <ul className="flex flex-col items-center p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {
                // Map the buttons array to create the buttons
                buttons.map((button) => (
                  <li key={button}>
                    <a
                      href={`/home/${button}`}
                      className={nonSelectedClassList}
                      // className={
                      //   settings.selectedTab === button
                      //     ? selectedClassList
                      //     : nonSelectedClassList
                      // }
                      onClick={() => handleButtonClick(button)}
                    >
                      {t(button)}
                    </a>
                  </li>
                ))
              }

              {/* <li>
              <ul>
                <li>
                  <a
                    id="dropdownHoverButton"
                    data-dropdown-toggle="dropdownHover"
                    data-dropdown-trigger="hover"
                    className="py-2 px-3 flex items-center text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-400 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    {t("tools")}
                    <i className="material-icons">arrow_drop_down</i>
                  </a>
                </li>
              </ul>

              <div
                id="dropdownHover"
                className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
              >
                <ul
                  className="py-2 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownHoverButton"
                >
                  <li>
                    <a className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      {t("dashboard")}
                    </a>
                  </li>
                  <li>
                    <a className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                      Earnings
                    </a>
                  </li>
                </ul>
              </div>
            </li> */}
            </ul>
          </div>

          <div className="hidden items-center md:order-2 space-x-2 md:space-x-0 rtl:space-x-reverse md:flex">
            <div className="dropdown">
              <button
                onClick={handleSignOut}
                type="button"
                className="material-icons text-black dark:text-white hover:bg-gray-100 p-2 hover:rounded-full dark:hover:bg-gray-700"
              >
                logout
              </button>
              <button
                onClick={() => {
                  setIsLanguageMenuOpen(false);
                  setIsThemeMenuOpen(!isThemeMenuOpen);
                }}
                type="button"
                className="material-icons text-black dark:text-white hover:bg-gray-100 p-2 mx-4 hover:rounded-full dark:hover:bg-gray-700"
              >
                {settings.theme === "dark" ? "dark_mode" : "light_mode"}
              </button>
              {isThemeMenuOpen && (
                <div
                  className="z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 absolute origin-top left-0 mt-2"
                  style={{ width: "max-content" }}
                >
                  <ul className="py-2 font-medium" role="none">
                    <li>
                      <button
                        onClick={() => handleThemeChange("light")}
                        type="button"
                        className="h-10 px-5 flex items-center text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                        style={{ width: "-webkit-fill-available" }}
                      >
                        <i className="material-icons mr-2">light_mode</i>
                        {t("lightMode")}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleThemeChange("dark")}
                        type="button"
                        className="h-10 px-5 flex items-center text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                        style={{ width: "-webkit-fill-available" }}
                      >
                        <i className="material-icons mr-2">dark_mode</i>
                        {t("darkMode")}
                      </button>
                    </li>
                  </ul>
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
                className="inline-flex items-center font-medium justify-center p-2 text-sm text-gray-900 dark:text-white rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white mr-4"
              >
                <img
                  src={settings.languageLogo}
                  width={20}
                  height={20}
                  className="mr-2"
                />
                {t("languageName")}
                <span className="dropdown-arrow">▾</span>
              </button>
              {isLanguageMenuOpen && (
                <div
                  className="z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 absolute origin-top left-0 mt-2"
                  style={{ width: "max-content" }}
                >
                  <ul className="py-2 font-medium" role="none">
                    <li>
                      <button
                        type="button"
                        onClick={() => handleLanguageChange("en", Usa)}
                        className="h-10 px-5 flex items-center text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        style={{ width: "-webkit-fill-available" }}
                      >
                        <img
                          src={Usa}
                          width={20}
                          height={20}
                          className="mr-2"
                        />
                        English (US)
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => handleLanguageChange("de", Germany)}
                        className="h-10 px-5 flex items-center text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        style={{ width: "-webkit-fill-available" }}
                      >
                        <img
                          src={Germany}
                          width={20}
                          height={20}
                          className="mr-2"
                        />
                        Deutsch
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => handleLanguageChange("it", Italy)}
                        className="h-10 px-5 flex items-center text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        style={{ width: "-webkit-fill-available" }}
                      >
                        <img
                          src={Italy}
                          width={20}
                          height={20}
                          className="mr-2"
                        />
                        Italiano
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => handleLanguageChange("zh", japan)}
                        className="h-10 px-5 flex items-center text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        style={{ width: "-webkit-fill-available" }}
                      >
                        <img
                          src={japan}
                          width={20}
                          height={20}
                          className="mr-2"
                        />
                        中文 (繁體)
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <a
              id="userIcon"
              data-dropdown-toggle="dropdownHoverUser"
              data-dropdown-trigger="hover"
              className="py-2 px-3 flex items-center text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-400 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
            >
              <img src={UserIcon} alt="User" className="h-6 rounded-full" />
              <span id="username"> Username </span>
            </a>

            <div
              id="userDataHover"
              className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownHoverUser"
              >
                <li>
                  <a className="block px-4 py-2 disabled:* pointer-events-none">
                    full Name
                  </a>
                </li>
                <li>
                  <a className="block px-4 py-2 disabled:* pointer-events-none">
                    Email
                  </a>
                </li>
                <li>
                  <a className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    Settings
                  </a>
                </li>
                <li>
                  <a className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      {isHamburgerMenuOpen && (
        <div className="flex justify-center items-start py-10 absolute bg-gray-200 dark:bg-gray-700 md:hidden w-full h-screen opacity-90 font-bold text-black dark:text-white">
          <div className="w-[75%] flex flex-col justify-center items-center gap-4">
            {buttons.map((button) => (
              <a
                href={`/home/${button.title}`}
                className="flex h-10 gap-5 w-full px-5 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-400"
                onClick={() => handleButtonClick(button.title)}
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
                    className="flex justify-between items-center gap-1"
                  >
                    {/* <img src={Usa} width={20} height={20} /> */}
                    English (US)
                  </button>
                  <button
                    onClick={() => handleLanguageChange("de", Germany)}
                    className="flex justify-between items-center gap-1"
                  >
                    {/* <img src={Germany} width={20} height={20} /> */}
                    Deutsch
                  </button>
                  <button
                    onClick={() => handleLanguageChange("it", Italy)}
                    className="flex justify-between items-center gap-1"
                  >
                    {/* <img src={Italy} width={20} height={20} /> */}
                    Italiano
                  </button>
                  <button
                    onClick={() => handleLanguageChange("zh", japan)}
                    className="flex justify-between items-center gap-1"
                  >
                    {/* <img src={japan} width={20} height={20} /> */}
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
            <div className="w-full p-5 h-12 flex justify-center items-center bg-gray-300 dark:bg-gray-800 rounded-lg">
              <button
                className="flex justify-center items-center gap-2"
                onClick={handleSignOut}
              >
                <i className="material-icons">logout</i>
                {t("logOut")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
