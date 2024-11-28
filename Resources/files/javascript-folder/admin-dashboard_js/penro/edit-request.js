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

let filenamefromFirebase,
  activityType,
  address,
  fileName,
  formattedDate,
  landClassification,
  projectLocation,
  seedlingsNumber,
  seedlingsType,
  status,
  user,
  userNumber;

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

    // Fetch document
    const docSnap = await userDocumentRef.get();

    // Check if the document exists
    if (!docSnap.exists) {
      console.warn(`Document with ID '${docID}' not found.`);
      return;
    }

    // Fetch and log sub-collection data
    const documentsCollectionSnap = await firebaseDB
      .collection("users")
      .doc(userID)
      .collection("Documents")
      .get();

    documentsCollectionSnap.forEach((docSnap) => {
      const docData = docSnap.data();

      // Assign values to global variables
      activityType = docData.activityType;
      address = docData.address;
      fileName = docData.fileName;
      formattedDate = docData.formattedDate;
      landClassification = docData.landClassification;
      projectLocation = docData.projectLocation;
      seedlingsNumber = docData.seedlingsNumber;
      seedlingsType = docData.seedlingsType;
      status = docData.status;
      user = docData.user;
      userNumber = docData.userNum;

      // Update DOM elements with document data
      document.getElementById("recipient").textContent = user;
      document.getElementById("recipientNum").textContent = userNumber;
      document.getElementById("recipientAddress").textContent = address;
      document.getElementById("seedlingQuantity").textContent = seedlingsNumber;
      document.getElementById("seedlingType").textContent = seedlingsType;
      document.getElementById("plantingSite").textContent = projectLocation;
      document.getElementById("landClassification").textContent =
        landClassification;
      document.getElementById("activityPurpose").textContent = activityType;
    });
  } catch (error) {
    console.error("Error retrieving request data:", error);
  }
}
async function updateDocumentStatus(userID, documentID, newStatus, notes) {
  try {
    // Define the path to the specific document in the "Documents" collection
    const docRef = firebaseDB
      .collection("users")
      .doc(userID)
      .collection("Documents")
      .doc(documentID);

    // Update the status field and add notes to the document
    await docRef.update({
      status: newStatus,
      notes: notes || "",
      UpdateTime: firebase.firestore.FieldValue.serverTimestamp(), //Optional: Add an updated timestamp
    });

    console.log("Document status updated successfully!");
  } catch (error) {
    console.error("Error updating document status: ", error);
    alert("Failed to update status.");
  }
}

// Add event listeners to buttons
document.addEventListener("click", async (event) => {
  if (event.target.matches("#ConfirmPickUp")) {
    // Define the status condition
    const condition = "Ready for pick up"; // or any other status value you need

    try {
      // Reference the user's Firestore document
      const userDocRef = firebaseDB.collection("users").doc(userID);
      const userDocSnapshot = await userDocRef.get();

      if (!userDocSnapshot.exists) {
        throw new Error("User not found");
      }

      // Reference the specific document in the "Documents" subcollection
      const userDocumentsRef = userDocRef.collection("Documents").doc(docID);
      const documentSnapshot = await userDocumentsRef.get();

      if (!documentSnapshot.exists) {
        throw new Error("Document not found");
      }

      // Update the document's status in Firestore
      await userDocumentsRef.update({
        status: condition,
      });
      showPopup(docID, condition);
    } catch (error) {
      console.error("Error processing request:", error);
      alert(`Error: ${error.message}`);
    }
  }
});

function showPopup(docuIDValue, condition) {
  document.getElementById("docuID").textContent = `Request ID:${docuIDValue}`;
  document.getElementById("detailsPopUp").textContent = `status:${condition}`;
  document.getElementById("popup").style.display = "flex";
  document.getElementById("overlay").style.display = "block";
}
function closePopup() {
  document.getElementById("overlay").style.display = "none"; // Hide the dim background
  document.getElementById("popup").style.display = "none"; // Hide the pop-up
}

// Load request details
loadRequestDetails(docID, userID);
