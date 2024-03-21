import React, { useState, useEffect } from "react";
import "./userMenu.css"; // Import your stylesheet

const PhoneUserMenu = ({ isUserMenuOpen }) => {
  const [showMenu, setShowMenu] = useState(isUserMenuOpen);
  const [animateOut, setAnimateOut] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!isUserMenuOpen && showMenu) {
      // Trigger slide-out animation before removing the component
      setAnimateOut(true);
      setTimeout(() => setShowMenu(false), 500); // Match animation duration
    } else if (isUserMenuOpen && !showMenu) {
      setShowMenu(true);
      setAnimateOut(false);
    }
  }, [isUserMenuOpen, showMenu]);

  if (!showMenu) return null;

  return (
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
        <div className="w-full p-5 h-12 flex justify-start items-center bg-gray-300 dark:bg-gray-800 rounded-lg">
          <button
            className="flex justify-center items-center gap-2"
            onClick={handleSignOut}
          >
            <i className="material-icons">logout</i>
            {t("signOut")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhoneUserMenu;
