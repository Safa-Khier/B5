import { updateProfile, updatePassword } from "firebase/auth";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { Timestamp } from "firebase/firestore";

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
      else returnData.updatedTime = doc.data().timeStamp;
    });

    returnData.currencies = currencies;

    return returnData;
  } catch (error) {
    console.error("Error fetching cryptocurrency data from Firestore:", error);
  }
}

export async function fetchCryptoNewsFromFirestore() {
  const db = firebase.firestore(); // Initialize Firestore database reference
  try {
    const snapshot = await db.collection("cryptonews").get();
    const returnData = {};
    const news = [];
    snapshot.forEach((doc) => {
      if (doc.id !== "updatedTimeStamp") news.push(doc.data());
      else returnData.updatedTime = doc.data().timeStamp;
    });

    returnData.news = news;

    return returnData;
  } catch (error) {
    console.error("Error fetching crypto news data from Firestore:", error);
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

export async function tradeCrypto(
  user,
  soldCurrency,
  boughtCurrency,
  soldCurrencyAmount,
  boughtCurrencyAmount,
) {
  const db = firebase.firestore(); // Initialize Firestore database reference

  const boughtCurrenceyRef = db
    .collection("users")
    .doc(user.uid)
    .collection("wallet")
    .doc(boughtCurrency.id);

  const soldCurrenceyRef = db
    .collection("users")
    .doc(user.uid)
    .collection("wallet")
    .doc(soldCurrency.id);

  const userTransactionsRef = db
    .collection("users")
    .doc(user.uid)
    .collection("transactions")
    .doc(); // Generates a new document reference for a transaction

  try {
    await db.runTransaction(async (transaction) => {
      const soldCurrenceyDoc = await transaction.get(soldCurrenceyRef);
      const boughtCurrenceyDoc = await transaction.get(boughtCurrenceyRef);

      // Retrieve the current amount from the document
      const currentSoldAmount = soldCurrenceyDoc.data()
        ? soldCurrenceyDoc.data().amount
        : 0;
      // Retrieve the current amount from the document
      const currentBoughtAmount = boughtCurrenceyDoc.data()
        ? boughtCurrenceyDoc.data().amount
        : 0;

      if (currentSoldAmount < soldCurrencyAmount) {
        console.log("Insufficient funds!");
        return "Error: Insufficient funds!";
      }

      // Calculate the new amount
      const newSoldCurrenceyAmount = currentSoldAmount - soldCurrencyAmount;
      const newBoughtCurrenceyAmount =
        currentBoughtAmount + boughtCurrencyAmount;

      transaction.update(soldCurrenceyRef, { amount: newSoldCurrenceyAmount });

      // Update the document with the new amount
      if (boughtCurrenceyDoc.exists) {
        transaction.update(boughtCurrenceyRef, {
          amount: newBoughtCurrenceyAmount,
        });
      } else {
        transaction.set(boughtCurrenceyRef, {
          id: boughtCurrency.id,
          amount: newBoughtCurrenceyAmount,
        });
      }

      // Add a new transaction record
      transaction.set(userTransactionsRef, {
        soldCurrency: {
          id: soldCurrency.id,
          amount: soldCurrencyAmount,
        },
        boughtCurrency: {
          id: boughtCurrency.id,
          amount: boughtCurrencyAmount,
        },
        transactionType: "trade",
        timestamp: firebase.firestore.FieldValue.serverTimestamp(), // Stores the time the transaction was made
      });
    });

    console.log("Transaction successfully committed!");
  } catch (error) {
    console.log("Transaction failed: ", error);
  }
}

export async function withdrawCrypto(
  user,
  currency,
  amount,
  bankAccountDetails,
  accountBalance,
) {
  const db = firebase.firestore();

  const currenceyRef = db
    .collection("users")
    .doc(user.uid)
    .collection("wallet")
    .doc(currency.id);

  const transactionsRef = db
    .collection("users")
    .doc(user.uid)
    .collection("transactions")
    .doc(); // Generates a new document reference for a transaction

  try {
    await db.runTransaction(async (transaction) => {
      const currenceyDoc = await transaction.get(currenceyRef);

      // Retrieve the current amount from the document
      const currencyCurrentAmount = currenceyDoc.data()
        ? currenceyDoc.data().amount
        : 0;

      if (currencyCurrentAmount < amount) {
        console.log("Insufficient funds!");
        return "Error: Insufficient funds!";
      }

      // Calculate the new amount
      const newCurrenceyAmount = currencyCurrentAmount - amount;

      // Update the document with the new amount
      if (currenceyDoc.exists) {
        transaction.update(currenceyRef, {
          amount: newCurrenceyAmount,
        });
      } else {
        transaction.set(currenceyRef, {
          id: currency.id,
          amount: newCurrenceyAmount,
        });
      }

      // Add a new transaction record
      transaction.set(transactionsRef, {
        accountBalance: accountBalance,
        currencyId: currency.id,
        amount: amount,
        price: currency.current_price,
        bankAccountDetails: bankAccountDetails,
        transactionType: "withdraw",
        timestamp: firebase.firestore.FieldValue.serverTimestamp(), // Stores the time the transaction was made
      });
    });

    console.log("Transaction successfully committed!");
  } catch (error) {
    console.log("Transaction failed: ", error);
  }
}

export function convertTimestampToDate(timestamp) {
  return new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate();
}

export async function deleteUserAccount() {
  const db = firebase.firestore();
  const user = auth.currentUser;

  const userDocRef = db.collection("users").doc(user.uid);

  await db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userDocRef);

    // Delete the user document
    if (userDoc.exists) {
      transaction.delete(userDocRef);
    }

    // Delete the user's authentication record
    await user.delete();
  });
}

export async function updateUserProfile(
  firstName,
  lastName,
  phone,
  oldPassword,
  newPassword,
) {
  const db = firebase.firestore();
  const user = firebase.auth().currentUser;

  // Firestore document reference
  const userDocRef = db.collection("users").doc(user.uid);

  // If newPassword is provided, re-authenticate and update password
  if (newPassword) {
    try {
      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        oldPassword,
      );

      // Re-authenticate user
      await user.reauthenticateWithCredential(credential);
    } catch (error) {
      // Handle or throw specific error for re-authentication failure
      throw new Error("Re-authentication failed: " + error.message);
    }

    // Update password
    await updatePassword(user, newPassword);
  }

  // Update Firestore document
  await db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userDocRef);
    if (!userDoc.exists) {
      throw new Error("User document does not exist!");
    }
    transaction.update(userDocRef, {
      displayName: `${firstName} ${lastName}`,
      phone: phone,
    });
  });

  // Update profile
  await updateProfile(user, { displayName: `${firstName} ${lastName}` });

  console.log("User account successfully updated!");
}
