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
const firebaseAuth = firebase.auth();
const firebaseDB = firebase.firestore();

// Get userID from local storage
const userID = localStorage.getItem("userID");
console.log(userID);

// Reference to user's document collection in 'users' sub-collection
const userDocRef = firebaseDB.collection("users").doc(userID);
const userDocumentsRef = userDocRef.collection("userDocuments");

// Export the instances and references
export { firebaseAuth, firebaseDB, userDocRef, userDocumentsRef };
