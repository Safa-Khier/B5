import React, { useEffect } from "react";
import "./index.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { useRecoilState } from "recoil";
import { webSettings } from "./atoms/webSettings";
import ProtectedRoute from "./protectedRoute.jsx";

import Home from "./components/screens/home/home.jsx";
import NavBar from "./components/navBar.jsx";
import Login from "./components/screens/welcome/login.jsx";
import Signup from "./components/screens/welcome/signup.jsx";
import Coin from "./components/screens/home/coins.screen.jsx";
import News from "./components/screens/home/news.screen.jsx";
import Compare from "./components/screens/home/compare.screen.jsx";
import Welcome from "./components/screens/welcome/welcome.jsx";
import { useAuth } from "./AuthContext.js";
import Dashboard from "./components/screens/home/dashboard.jsx";

const RedirectToHomeIfAuth = ({ isAuthenticated, children }) => {
  return isAuthenticated ? <Navigate to="/home" replace /> : children;
};

function App() {
  const [settings, setSettings] = useRecoilState(webSettings);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setSettings({ ...settings, theme: "dark" });
    } else {
      document.documentElement.classList.remove("dark");
      setSettings({ ...settings, theme: "light" });
    }
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route
          path="welcome"
          element={
            <RedirectToHomeIfAuth isAuthenticated={currentUser}>
              <NavBar />
              <Outlet />
            </RedirectToHomeIfAuth>
          }
        >
          <Route path="" element={<Welcome />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="*" element={<Navigate replace to="" />} />
        </Route>

        <Route
          path="home"
          element={<ProtectedRoute isAuthenticated={currentUser} />}
        >
          <Route index element={<Home />} />
          <Route path="coins" element={<Coin />} />
          <Route path="news" element={<News />} />
          <Route path="compare" element={<Compare />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate replace to="" />} />
        </Route>

        <Route
          path="*"
          element={
            <RedirectToHomeIfAuth isAuthenticated={currentUser}>
              <Navigate replace to="/welcome" />
            </RedirectToHomeIfAuth>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

export function setPathLocation(path) {
  window.location.replace(path);
}
