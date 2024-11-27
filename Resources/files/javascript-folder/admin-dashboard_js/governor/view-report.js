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

// Initialize Firestore
const firebaseDB = firebase.firestore();

console.log("Firebase initialized!");

// Retrieve values from localStorage
const userID = localStorage.getItem("userID");
const docID = localStorage.getItem("docID");

async function loadRequestDetails(docID, userID) {
  try {
    // Validate input
    if (!docID || !userID) {
      console.warn("Missing required parameters:", { docID, userID });
      return;
    }

    // Reference to the user's document
    const userDocumentRef = firebaseDB
      .collection("users")
      .doc(userID)
      .collection("Documents")
      .doc(docID);

    console.log("Fetching document from path:", userDocumentRef.path);

    // Fetch document
    const docSnap = await userDocumentRef.get();

    // Check if the document exists
    if (!docSnap.exists) {
      console.warn(`Document with ID '${docID}' not found.`);
      return;
    }

    // Extract and log document data
    const data = docSnap.data();

    // Fetch and log sub-collection data
    const documentsCollectionSnap = await firebaseDB
      .collection("users")
      .doc(userID)
      .collection("Documents")
      .get();

    documentsCollectionSnap.forEach((docSnap, index) => {
      const docData = docSnap.data();
      console.log(`Document:`, {
        ActivityType: docData.activityType,
        Address: docData.address,
        FileName: docData.fileName,
        FormattedDate: docData.formattedDate,
        LandClassification: docData.landClassification,
        ProjectLocation: docData.projectLocation,
        SeedlingsNumber: docData.seedlingsNumber,
        SeedlingsType: docData.seedlingsType,
        Status: docData.status,
        User: docData.user,
        UserNumber: docData.userNum,
      });
      document.getElementById("recipient").textContent = docData.user;
      document.getElementById("fileName").textContent = docData.fileName;
      document.getElementById("recipientNum").textContent = docData.userNum;
      document.getElementById("recipientAddress").textContent = docData.address;
      document.getElementById("seedlingQuantity").textContent =
        docData.seedlingsNumber;
      document.getElementById("seedlingType").textContent =
        docData.seedlingsType;
      document.getElementById("plantingSite").textContent =
        docData.seedlingsType;
      document.getElementById("landClassification").textContent =
        docData.landClassification;
      document.getElementById("activityPurpose").textContent =
        docData.activityType;
    });
  } catch (error) {
    console.error("Error retrieving request data:", error);
  }
}

// Load request details
loadRequestDetails(docID, userID);
