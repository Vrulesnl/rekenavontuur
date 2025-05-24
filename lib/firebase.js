// lib/firebase.js

// Import the functions you need from the SDKs you want to use
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCp19PfYfg4LagBoKlErAiGw-EhJnJgPv4",
  authDomain: "rekenavontuur.firebaseapp.com",
  projectId: "rekenavontuur",
  storageBucket: "rekenavontuur.firebasestorage.app",
  messagingSenderId: "156235988967",
  appId: "1:156235988967:web:b986406e8ff933d2230742",
  measurementId: "G-FX5EX78BT8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optional: Analytics (only works in browsers)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Realtime Database and Storage instances
const db = getDatabase(app);
const storage = getStorage(app);

// Utility functions for saving and subscribing to progress
/**
 * Save a player’s star count for a given stadion.
 * @param {string} playerName 
 * @param {string} stadion 
 * @param {number} stars 
 * @returns {Promise}
 */
export function saveProgress(playerName, stadion, stars) {
  return set(ref(db, `users/${playerName}/${stadion}`), {
    stars,
    timestamp: Date.now()
  });
}

/**
 * Subscribe to realtime updates of a player’s progress.
 * @param {string} playerName 
 * @param {function} callback  Receives the snapshot value object.
 * @returns {function} unsubscribe
 */
export function subscribeProgress(playerName, callback) {
  const userRef = ref(db, `users/${playerName}`);
  const unsubscribe = onValue(userRef, snapshot => {
    callback(snapshot.val());
  });
  return () => userRef.off("value", unsubscribe);
}

// Exports
export { app, analytics, db, storage };