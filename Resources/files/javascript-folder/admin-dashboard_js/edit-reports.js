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

const docID = localStorage.getItem("docID");
const userID = localStorage.getItem("userID");

console.log(`Retrieved docID: ${docID}, userID: ${userID}`);

// Validate docID and userID before proceeding
if (!docID || !userID) {
  console.error("Missing docID or userID. Please ensure both are defined.");
  document.getElementById(
    "requestDetails"
  ).innerHTML = `<p>Error: Missing request or user ID.</p>`;
} else {
  async function loadRequestDetails(requestId, userId) {
    try {
      const userDocumentsRef = firebaseDB
        .collection("users")
        .doc(userId)
        .collection("userDocuments")
        .doc(requestId);

      const doc = await userDocumentsRef.get();

      if (!doc.exists) {
        console.log(`No request found for ID: ${requestId}`);
        document.getElementById(
          "requestDetails"
        ).innerHTML = `<p>No request found for ID: ${requestId}</p>`;
        return;
      }

      const data = doc.data();
      console.log("Request details:", data);
      displayRequestDetails(data, userId); // Pass `userID` to retrieve user data
    } catch (error) {
      console.error("Error retrieving request data:", error);
      document.getElementById(
        "requestDetails"
      ).innerHTML = `<p>Error loading request data. Please try again later.</p>`;
    }
  }

  async function displayRequestDetails(data, userId) {
    const requestDetailsElement = document.getElementById("userInfo");

    const userDocRef = firebaseDB.collection("users").doc(userId);
    const userDocSnapshot = await userDocRef.get();

    if (userDocSnapshot.exists) {
      const userData = userDocSnapshot.data();
      const user = userData.name || "Unknown User";
      const telNumber = userData.contactNumber || "Unknown Contact Number";

      const Useraddress = (userData.address = [
        (houseNumber = userData.address.houseNumber || "N/A"),
        (purok = userData.address.purok || "N/A"),
        (barangay = userData.address.barangay || "N/A"),
        (municipality = userData.address.municipality || "N/A"),
        (province = userData.address.province || "N/A"),
        (postalCode = userData.address.postalCode || "N/A"),
      ]
        .filter(Boolean) // Filters out any falsy values (null, undefined, empty strings)
        .join(", "));
      if (userData.address) {
      }
      requestDetailsElement.innerHTML = `
        <h2>Request Details</h2>
        <p>User: ${user}</p>
        <p>Recipients Contact Number: ${telNumber}</p>
        <p>Recipients Address: ${Useraddress}</p>
        <br>
        <p>Document Title: ${data.Document_Title}</p>
        <p>Planting Site Location: ${data.Project_Location}</p>
        <p>land Classification: ${data.Land_Classification}</p>
        <p>Purpose Of Activity: ${data.Activity_Type}</p>
        <p>Condition: ${data.Condition}</p>
        <p>Submitted At: ${data.submittedAt.toDate().toLocaleString()}</p>
        <br>
        <label for="note">Note</label>
      <textarea name="note"></textarea>
        <button id="approveButton">approve</button>
        <button id="declineButton">decline</button>
      `;
    } else {
      console.error("No user document found for userID:", userId);
    }
  }

  loadRequestDetails(docID, userID);
}

async function updateDocumentCondition(userID, documentID, condition, note) {
  try {
    const userDocRef = firebase.firestore().collection("users").doc(userID);
    const documentRef = userDocRef.collection("userDocuments").doc(documentID);

    await documentRef.update({
      Condition: condition, // Update the Condition field
      Note: note || "No note provided", // Add or update the Note field
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(), // Optional: Add an updated timestamp
    });

    alert(`Document successfully ${condition.toLowerCase()}!`);
  } catch (error) {
    console.error("Error updating document:", error);
    alert("Error updating document: " + error.message);
  }
}

// Add event listeners to buttons
document.addEventListener("click", async (event) => {
  if (event.target.matches("#approveButton, #declineButton")) {
    const button = event.target;
    const condition = button.id === "approveButton" ? "Approved" : "Declined";
    const noteField = document.querySelector("textarea[name='note']");
    const note = noteField ? noteField.value : "";

    // Replace these with actual userID and documentID

    await updateDocumentCondition(userID, docID, condition, note);
  }
});
function openFileById(id) {
  // Construct the file path using the id
  const filePath = `${id}.html`; // e.g., if id is "page2", it will open "page2.html"

  window.open(filePath, "_self");
}
