import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Logo from "../../../assets/icons/logo.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Alert from "../../alert/alert.jsx";
import { auth } from "../../../firebase";

export default function Signup() {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({
    title: "",
    message: "",
    type: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const showAlert = () => setAlertVisible(true);
  const hideAlert = () => setAlertVisible(false);
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSignUpSubmit = async (e) => {
    if (!checkFormFields()) return;

    setLoading(true);
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );
      const user = userCredential.user;
      // Update the user's profile
      await updateProfile(user, {
        displayName: formData.firstName + " " + formData.lastName,
        // You can also set the photoURL here if you have one
      });
      setAlertData({
        ...alertData,
        title: "success",
        message: "accountCreated",
        type: "success",
      });
      showAlert();
    } catch (error) {
      console.log(error);
      // showAlert();
    } finally {
      setLoading(false);
    }
  };

  function checkFormFields() {
    const email = formData.email;
    const firstName = formData.firstName;
    const lastName = formData.lastName;
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    console.log(formData);
    if (
      email === "" ||
      firstName === "" ||
      lastName === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      setAlertData({
        ...alertData,
        title: "error",
        message: "errorFillAllFields",
        type: "error",
      });
      showAlert();
      return false;
    }

    if (!checkMial(email)) {
      setAlertData({
        ...alertData,
        title: "error",
        message: "errorInvalidEmail",
        type: "error",
      });
      showAlert();
      return false;
    }

    if (password !== confirmPassword) {
      setAlertData({
        ...alertData,
        title: "error",
        message: "errorPasswordsDoNotMatch",
        type: "error",
      });
      showAlert();
      return false;
    }

    if (password.length < 6) {
      setAlertData({
        ...alertData,
        title: "error",
        message: "passwordTooShort",
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

  return (
    <div className="flex w-full justify-center items-center h-full pb-28">
      <div className="grid md:grid-cols-2 w-full">
        <div className="flex justify-end">
          <img
            src={Logo}
            loading="lazy"
            alt="CryptoPulse logo"
            className="flex h-auto w-auto md:max-h-[550px] p-10 m-auto"
          />
          <div className="h-full bg-gray-300 dark:bg-gray-600 hidden md:block w-px mx-[10px]" />
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="mx-10 text-5xl font-bold text-slate-950 dark:text-white">
            {t("signUp")}
          </h1>
          <input
            type="text"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="mx-10 mt-10 h-10 pl-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={t("email")}
          />
          <div className="flex flex-row w-full">
            <input
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="w-full ml-10 mt-5 mr-2 pl-3 h-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={t("firstName")}
            />
            <input
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="w-full mr-10 ml-2 mt-5 pl-3 h-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={t("lastName")}
            />
          </div>
          <div className="flex flex-row w-full">
            <input
              type={showPassword ? "text" : "password"}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full ml-10 mr-2 mt-5 h-10 pl-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={t("password")}
            />
            <input
              type={showPassword ? "text" : "password"}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full mr-10 ml-2 mt-5 h-10 pl-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={t("confirmPassword")}
            />
          </div>

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
            onClick={handleSignUpSubmit}
            className="m-10 text-gray-800 font-bold py-2 px-5 rounded-lg dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white flex justify-start"
          >
            {t("signUp")}
            {loading && (
              <div className="buttonLoader flex justify-center items-center my-auto ml-2" />
            )}
          </button>
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
