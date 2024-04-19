import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, fetchUserDataFromFirestore } from "./firebase.js"; // Ensure this points to your Firebase setup file
import { onAuthStateChanged } from "firebase/auth";
import LoadingScreen from "./components/loading.screen.jsx";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true); // Add loading state
  const [currentUserData, setCurrentUserData] = useState({
    displayName: "",
    email: "",
    photoURL: "",
    uid: "",
    wallet: [],
    Transactions: [],
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        fetchUserData(user); // Fetch user data if user exists (user is not null)
        // setLoading(false);
      } else {
        setLoading(false);
      }

      console.log("====================================");
      console.log("User:", user);
      console.log("====================================");
    });

    return () => {
      unsubscribe();
    }; // Cleanup subscription on unmount
  }, []);

  const fetchUserData = async (user) => {
    // Fetch user data here
    if (user) {
      const userData = await fetchUserDataFromFirestore(user);
      setCurrentUserData(userData);
    }
    setLoading(false); // Update loading state to false once user is fetched
  };

  const value = {
    currentUser,
    currentUserData,
    loading, // Include loading in the context value
    fetchUserData, // Include fetchUserData function in the context value
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
}
