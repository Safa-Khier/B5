import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBU7bpMsc4MZhNgQUr5fctbKZnOrQGvaFI",
  authDomain: "webproject-84623.firebaseapp.com",
  projectId: "webproject-84623",
  storageBucket: "webproject-84623.appspot.com",
  messagingSenderId: "597356177781",
  appId: "1:597356177781:web:39ad9bd19b927870744b3c",
  measurementId: "G-S7GQ7V2FJC",
};

const app = firebase.initializeApp(firebaseConfig);

export const auth = app.auth();

export default app;
