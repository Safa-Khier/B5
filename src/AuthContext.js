import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase.js"; // Ensure this points to your Firebase setup file
import { onAuthStateChanged } from "firebase/auth";
import LoadingScreen from "./components/loading.screen.jsx";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // Update loading state to false once user is fetched
      console.log("====================================");
      console.log("User:", user);
      console.log("====================================");
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  const value = {
    currentUser,
    loading, // Include loading in the context value
  };

  if (loading) {
    return <LoadingScreen />; // Show loading screen while checking user status
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
