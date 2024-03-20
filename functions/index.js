/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const fetch = require("node-fetch");
const admin = require("firebase-admin");
const { DateTime } = require("luxon");

admin.initializeApp();

// Schedule this function to run every hour
exports.fetchAndStoreCryptoData = functions.pubsub
  .schedule("every 60 minutes")
  .onRun(async (context) => {
    const url = "https://api.coingecko.com/api/v3/coins/markets";
    const parameters = {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: 100,
      sparkline: true,
      price_change_percentage: "1h,24h,7d",
    };
    const queryString = new URLSearchParams(parameters).toString();
    const fetchUrl = `${url}?${queryString}`;

    try {
      const response = await fetch(fetchUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // Assuming you have a 'cryptocurrencies' collection in Firestore
      const batch = admin.firestore().batch();
      data.forEach((coin) => {
        const docRef = admin
          .firestore()
          .collection("cryptocurrencies")
          .doc(coin.id);
        batch.set(docRef, coin);
      });
      const docRef = admin
        .firestore()
        .collection("cryptocurrencies")
        .doc("updatedTimeStamp");

      // Get the current time in Israel's time zone
      const timeInIsrael = DateTime.now().setZone("Asia/Jerusalem");

      // Format the time as you need it
      const formattedTime = timeInIsrael.toFormat("dd/MM/yyyy HH:mm:ss");
      batch.set(docRef, { timeStamp: formattedTime });
      await batch.commit();
      console.log("Successfully updated cryptocurrencies data");
    } catch (error) {
      console.error("Error fetching cryptocurrencies data:", error);
    }
  });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
