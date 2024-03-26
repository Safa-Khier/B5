import React, { useState, useEffect } from "react";
import "./userMenu.css"; // Import your stylesheet
import { useAuth } from "../../AuthContext";
import { signOut } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { auth } from "../../firebase";
import { setPathLocation } from "../../App";

const UserMenu = ({ isUserMenuOpen }) => {
  const [showMenu, setShowMenu] = useState(isUserMenuOpen);
  const [animateOut, setAnimateOut] = useState(false);
  const { currentUser } = useAuth();
  const { t } = useTranslation();

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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      alert(error.message); // Show error message
    }
  };

  if (!showMenu) return null;

  return (
    <div
      className={`flex flex-col justify-start right-0 items-center m-2 pt-5 pb-28 rounded-2xl absolute bg-gray-200 dark:bg-gray-700 min-w-96 h-screen opacity-95 font-bold text-black dark:text-white ${animateOut ? "slide-out-right" : "slide-in-right"}`}
    >
      <button className="flex justify-end items-end w-full pr-5 gap-3 material-icons">
        settings
      </button>

      <div className="w-[75%] h-full flex flex-col justify-between items-center gap-4">
        <div className="flex flex-col justify-center items-center gap-3">
          <i className="material-icons" style={{ fontSize: "100px" }}>
            account_circle
          </i>
          <p>{currentUser.displayName}</p>
        </div>

        <div className="flex flex-col justify-start items-start w-full h-full py-10 gap-3">
          <div className="flex justify-start items-start w-full h-10 gap-3 p-2 border-b border-gray-400 hover:bg-gray-300 dark:hover:bg-gray-800 rounded-t-md">
            <i className="material-icons">mail</i>
            <p>{currentUser.email}</p>
          </div>

          <div className="flex justify-start items-start w-full h-10 gap-3 p-2 border-b border-gray-400 hover:bg-gray-300 dark:hover:bg-gray-800 rounded-t-md">
            <i className="material-icons">schedule</i>
            <p>{currentUser.displayName}</p>
          </div>
          <div
            onClick={() => setPathLocation("/home/dashboard")}
            className="flex justify-start items-start w-full h-10 gap-3 p-2 border-b border-gray-400 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-800 rounded-t-md"
          >
            <i className="material-icons">dashboard</i>
            <p>{t("dashboard")}</p>
          </div>
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
  );
};

export default UserMenu;
