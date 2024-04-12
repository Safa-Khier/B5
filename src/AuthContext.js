import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, fetchUserDataFromFirestore } from "./firebase.js"; // Ensure this points to your Firebase setup file
import { onAuthStateChanged } from "firebase/auth";
import LoadingScreen from "./components/loading.screen.jsx";
import { userData } from "./atoms/userData";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true); // Add loading state
  const [currentUserData, setCurrentUserData] = useState(userData);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // fetch user data here
        fetchUserDataFromFirestore(user).then((userData) => {
          setCurrentUserData(userData);
          setLoading(false); // Update loading state to false once user is fetched
        });
      } else {
        setLoading(false); // Update loading state to false once user is fetched
      }
      // setLoading(false); // Update loading state to false once user is fetched

      console.log("====================================");
      console.log("User:", user);
      console.log("====================================");
    });

    return () => {
      unsubscribe();
    }; // Cleanup subscription on unmount
  }, []);

  const value = {
    currentUser,
    currentUserData,
    loading, // Include loading in the context value
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
}

// import React, { createContext, useContext, useEffect, useState } from "react";
// import { auth, fetchUserDataFromFirestore } from "./firebase"; // Ensure this points to your Firebase setup file
// import { onAuthStateChanged } from "firebase/auth";
// import LoadingScreen from "./components/loading.screen.jsx";
// import { userData } from "./atoms/userData";

// const AuthContext = createContext();

// export function useAuth() {
//   return useContext(AuthContext);
// }

// export function AuthProvider({ children }) {
//   const [currentUser, setCurrentUser] = useState();
//   const [loading, setLoading] = useState(true); // Add loading state
//   const [currentUserData, setCurrentUserData] = useState(userData);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setCurrentUser(user);
//       if (user) {
//         // Check if user data exists in localStorage first
//         const storedUserData = localStorage.getItem(`userData_${user.uid}`);
//         if (storedUserData) {
//           // Parse the stored string back into an object
//           const userData = JSON.parse(storedUserData);
//           setCurrentUserData(userData);
//           setLoading(false);
//         }
//         // Fetch user data from Firestore if not found in localStorage
//         fetchUserDataFromFirestore(user).then((userData) => {
//           setCurrentUserData(userData);
//           // Save fetched user data to localStorage
//           localStorage.setItem(
//             `userData_${user.uid}`,
//             JSON.stringify(userData),
//           );
//           setLoading(false);
//         });
//       } else {
//         setLoading(false);
//       }
//     });

//     return () => {
//       unsubscribe();
//     }; // Cleanup subscription on unmount
//   }, []);

//   const value = {
//     currentUser,
//     currentUserData,
//     loading, // Include loading in the context value
//   };

//   if (loading) {
//     return <LoadingScreen />; // Show loading screen while checking user status
//   }

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }
