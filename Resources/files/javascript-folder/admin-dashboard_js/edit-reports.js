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
  // Don't forget to clear the storage if data is sensitive or no longer needed
  localStorage.removeItem("docID");

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
      displayRequestDetails(data); // Pass `data` to the display function
    } catch (error) {
      console.error("Error retrieving request data:", error);
      document.getElementById(
        "requestDetails"
      ).innerHTML = `<p>Error loading request data. Please try again later.</p>`;
    }
  }

  function displayRequestDetails(data) {
    const requestDetailsElement = document.getElementById("requestDetails");
    requestDetailsElement.innerHTML = `
      <h2>Request Details</h2>
      <p>Document Title: ${data.Document_Title}</p>
      <p>Condition: ${data.Condition}</p>
      <p>Submitted At: ${data.submittedAt.toDate().toLocaleString()}</p>
    `;
  }

  // Correct the argument order for loadRequestDetails
  loadRequestDetails(docID, userID);
}
