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

export async function createNewUser(user, formData) {
  const db = firebase.firestore(); // Initialize Firestore database reference
  try {
    await db.collection("users").doc(user.uid).set({
      uid: user.uid,
      email: user.email,
      phone: formData.phone,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("Error creating new user in Firestore:", error);
  }
}

// Fetch user data from Firestore
export async function fetchUserDataFromFirestore(user) {
  const db = firebase.firestore(); // Initialize Firestore database reference

  try {
    // Fetch the main user document
    const userDocRef = db.collection("users").doc(user.uid);
    const userSnapshot = await userDocRef.get();
    const userData = userSnapshot.data() || {};

    // Assuming the names of the subcollections are 'wallet' and 'transactions'
    // Fetch data from the 'wallet' subcollection
    const walletCollectionRef = userDocRef.collection("wallet");
    const walletSnapshot = await walletCollectionRef.get();
    const walletData = walletSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Fetch data from the 'transactions' subcollection
    const transactionsCollectionRef = userDocRef.collection("transactions");
    const transactionsSnapshot = await transactionsCollectionRef.get();
    const transactionsData = transactionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Combine user data with subcollections data
    const combinedData = {
      ...userData,
      wallet: walletData,
      transactions: transactionsData,
    };

    return combinedData;
  } catch (error) {
    console.error(
      "Error fetching user data and collections from Firestore:",
      error,
    );
    return null; // Or handle the error as appropriate for your application
  }
}

export async function addCryptoToTheWallet(
  user,
  currency,
  amount,
  price,
  creditCardDetails,
  accountBalance,
) {
  const db = firebase.firestore(); // Initialize Firestore database reference
  const userWalletRef = db
    .collection("users")
    .doc(user.uid)
    .collection("wallet")
    .doc(currency.id);

  const userTransactionsRef = db
    .collection("users")
    .doc(user.uid)
    .collection("transactions")
    .doc(); // Generates a new document reference for a transaction

  try {
    await db.runTransaction(async (transaction) => {
      const walletDoc = await transaction.get(userWalletRef);

      // Retrieve the current amount from the document
      const currentAmount = walletDoc.data() ? walletDoc.data().amount : 0;

      // Calculate the new amount
      const newAmount = currentAmount + amount;

      // Update the document with the new amount
      if (walletDoc.exists) {
        transaction.update(userWalletRef, { amount: newAmount });
      } else {
        transaction.set(userWalletRef, { id: currency.id, amount: newAmount });
      }

      const creditCardDetailsToSave = {
        cardNumber:
          "**** **** **** " + creditCardDetails.cardNumber.slice(15, 19),
        cardName: creditCardDetails.cardName,
        expDate: creditCardDetails.expDate,
        ccv: creditCardDetails.ccv,
      };

      // Add a new transaction record
      transaction.set(userTransactionsRef, {
        accountBalance: accountBalance,
        currencyId: currency.id,
        transactionType: "buy",
        amount: amount,
        price: price,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(), // Stores the time the transaction was made
        creditCardDetails: creditCardDetailsToSave,
      });
    });

    console.log("Transaction successfully committed!");
  } catch (error) {
    console.log("Transaction failed: ", error);
  }
}
