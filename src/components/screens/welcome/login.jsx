import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Logo from "../../../assets/icons/logo.png";
import Alert from "../../alert/alert.jsx";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../../firebase";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const showAlert = () => setAlertVisible(true);
  const hideAlert = () => setAlertVisible(false);
  const { t } = useTranslation();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [alertData, setAlertData] = useState({
    title: "",
    message: "",
    type: "",
  });

  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    if (!checkFormFields()) return;
    setIsLoggingIn(true);
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password,
      );
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        setAlertData({
          ...alertData,
          title: "error",
          message: "errorInvalidCredentials",
          type: "error",
        });
      } else {
        setAlertData({
          ...alertData,
          title: "error",
          message: "somethingWentWrong",
          type: "error",
        });
      }
      showAlert();
    } finally {
      setIsLoggingIn(false);
    }
  };

  function checkFormFields() {
    const { email, password } = loginData;
    if (email === "" || password === "") {
      setAlertData({
        ...alertData,
        title: "error",
        message: "errorFillAllFields",
        type: "error",
      });
      showAlert();
      return false;
    }
    return true;
  }

  function checkMial(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const hundleForgotPassword = () => {
    const { email } = loginData;
    if (!checkMial(email)) {
      setAlertData({
        ...alertData,
        title: "error",
        message: "errorInvalidEmail",
        type: "error",
      });
      showAlert();
      return;
    }
    sendPasswordResetEmail(auth, loginData.email)
      .then(() => {
        setAlertData({
          ...alertData,
          title: "success",
          message: "resetPasswordEmailSent",
          type: "success",
        });
        showAlert();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex w-full justify-center items-center h-full pb-28">
      <div className="grid md:grid-cols-2 w-full">
        <div className="flex justify-end">
          <img
            src={Logo}
            alt="CryptoPulse logo"
            className="flex h-auto w-auto md:max-h-[550px] p-10 m-auto"
          />
          <div className="h-full bg-gray-300 dark:bg-gray-600 hidden md:block w-px mx-[10px]" />
        </div>
        <div onSubmit={handleSubmit} className="flex flex-col justify-center">
          <h1 className="mx-10 text-5xl font-bold text-slate-950 dark:text-white">
            {t("logIn")}
          </h1>

          <input
            type="text"
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
            className="mx-10 mt-10 h-10 pl-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={t("mail")}
          />
          <input
            type={showPassword ? "text" : "password"}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            className="mx-10 mt-5 h-10 pl-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={t("password")}
          />

          <div className="flex ml-10 mt-5 gap-2">
            <input
              type="checkbox"
              onClick={() => setShowPassword(!showPassword)}
            />
            <label className="text-gray-800 dark:text-white">
              {t("showPassword")}
            </label>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="mx-10 mt-10 text-gray-800 font-bold py-2 px-5 rounded-lg dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white flex justify-start"
          >
            {t("logIn")}
            {isLoggingIn && (
              <div className="buttonLoader flex justify-center items-center my-auto ml-2" />
            )}
          </button>

          <a
            className="mx-10 mt-5 text-gray-500 dark:text-gray-300 cursor-pointer font-semibold underline"
            onClick={hundleForgotPassword}
          >
            {t("forgotPassword")}
          </a>
        </div>
      </div>
      <Alert
        title={alertData.title}
        message={alertData.message}
        isVisible={alertVisible}
        onClose={hideAlert}
      />
    </div>
  );
}
