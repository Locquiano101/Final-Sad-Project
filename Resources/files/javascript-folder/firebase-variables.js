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

const userID = localStorage.getItem("userID");
// Declare variables to export
let userName, userEmail, userContactNumber;
let houseNumber, purok, barangay, municipality, province, postalCode;

// Fetch user data
const fetchUserData = async (userID) => {
  const userDocRef = firebaseDB.collection("users").doc(userID);
  try {
    const doc = await userDocRef.get();
    if (doc.exists) {
      const userData = doc.data();

      // Extract user details
      userName = userData.name || "N/A";
      userEmail = userData.email || "N/A";
      userContactNumber = userData.contactNumber || "N/A";

      // Extract address details
      if (userData.address) {
        houseNumber = userData.address.houseNumber || "N/A";
        purok = userData.address.purok || "N/A";
        barangay = userData.address.barangay || "N/A";
        municipality = userData.address.municipality || "N/A";
        province = userData.address.province || "N/A";
        postalCode = userData.address.postalCode || "N/A";
      }
    } else {
      console.error("No user document found for userID:", userID);
    }
  } catch (error) {
    console.error("Error fetching user document:", error);
  }
};

// Export the variables and function
export {
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
};
