// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPIdlzAlKkfZp3bu4YuI2fylSzxar1zA0",
  authDomain: "penro-db.firebaseapp.com",
  projectId: "penro-db",
  storageBucket: "penro-db.appspot.com",
  messagingSenderId: "25138598165",
  appId: "1:25138598165:web:9c8136ef9898df7803591c",
  measurementId: "G-8YBC8FE4XZ",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore and other services
const firebaseDB = firebase.firestore();
const userID = "exampleUserID"; // Replace with the actual user ID

import {
  userName,
  userEmail,
  userContactNumber,
  houseNumber,
  purok,
  barangay,
  municipality,
  province,
  postalCode,
  fetchUserData,
} from "./firebase-variables.js";

// Declare variables in a broader scope
let user, email, userNum, address;

// Fetch user data and assign values
async function fetchAndLogUserData(userID) {
  try {
    await fetchUserData(userID); // Assumes fetchUserData is an async function
    console.log("USER DATA RETRIEVED SUCCESSFULLY");

    // Assign values to the broader scope variables
    user = userName;
    email = userEmail;
    userNum = userContactNumber;
    address = [houseNumber, purok, barangay, municipality, province, postalCode]
      .filter(Boolean) // Filters out any falsy values (null, undefined, empty strings)
      .join(", ");

    // Log the values (inside block)
    console.log(user, email, userNum, address);
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

// Example document data
const documentData = {
  Document_Title: "User Document Title",
  Condition: "Ready for PickUp",
};

// Usage example
fetchAndLogUserData(userID);
sendDocument(userID, documentData);
