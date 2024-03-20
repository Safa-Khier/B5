import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyBU7bpMsc4MZhNgQUr5fctbKZnOrQGvaFI",
//   authDomain: "webproject-84623.firebaseapp.com",
//   projectId: "webproject-84623",
//   storageBucket: "webproject-84623.appspot.com",
//   messagingSenderId: "597356177781",
//   appId: "1:597356177781:web:39ad9bd19b927870744b3c",
//   measurementId: "G-S7GQ7V2FJC",
// };

const firebaseConfig = {
  apiKey: "AIzaSyCDj5lHl9qwaIhVVxKFyK-m-ENvw8bKvlk",
  authDomain: "cryptopulse-e45b9.firebaseapp.com",
  projectId: "cryptopulse-e45b9",
  storageBucket: "cryptopulse-e45b9.appspot.com",
  messagingSenderId: "308291913891",
  appId: "1:308291913891:web:fa95a3feb4999f921c5716",
  measurementId: "G-FGVTZMFMSL",
};

const app = firebase.initializeApp(firebaseConfig);

export const auth = app.auth();

export default app;

export async function fetchCryptoCurrenciesFromFirestore() {
  const db = firebase.firestore(); // Initialize Firestore database reference
  try {
    const snapshot = await db.collection("cryptocurrencies").get();
    const returnData = {};
    const currencies = [];
    snapshot.forEach((doc) => {
      if (doc.id !== "updatedTimeStamp") currencies.push(doc.data());
      else returnData.updatedTimeStamp = doc.data().timeStamp;
    });

    returnData.currencies = currencies;

    console.log(returnData);
    return returnData;
  } catch (error) {
    console.error("Error fetching cryptocurrency data from Firestore:", error);
  }
}
