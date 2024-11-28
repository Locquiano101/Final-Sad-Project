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

// Get userID from local storage
const userID = localStorage.getItem("userID");

// Reference to user's document collection in 'users' sub-collection
const userDocumentsRef = firebaseDB
  .collection("users")
  .doc(userID)
  .collection("Documents");

// Function to display user data
async function displayUserData(userId) {
  try {
    const userRef = firebase.firestore().collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      document.getElementById("user").textContent = userData.name || "N/A";
      document.getElementById("email").textContent = userData.email || "N/A";
    } else {
      console.log("No user data found for this ID.");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

// Display user data on page load
displayUserData(userID);

// Function to retrieve and display documents
async function retrieveDocuments() {
  try {
    const querySnapshot = await userDocumentsRef.get();

    if (querySnapshot.empty) {
      console.log("No documents found!");
      return;
    }

    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      const { fileName, status, formattedDate: docTimeStamp } = docData;

      if (!fileName || !status) {
        console.log("Missing fileName or status in document:", doc.id);
        return;
      }

      let conditionColor = getStatusColor(status);

      if (docTimeStamp) {
        createDocumentRow(
          doc.id,
          fileName,
          docTimeStamp,
          conditionColor,
          status
        );
      } else {
        console.log("Timestamp field does not exist for document:", doc.id);
      }
    });
  } catch (error) {
    console.error("Error retrieving documents:", error);
  }
}

// Helper function to get status color
function getStatusColor(status) {
  switch (status) {
    case "Pending for Approval":
      return "white";
    case "Approved":
      return "blue";
    case "Declined":
      return "red";
    case "Ready for Pick Up":
      return "yellow";
    default:
      return "white";
  }
}

// Function to create and append document row
function createDocumentRow(
  docID,
  docTitle,
  docTimeStamp,
  conditionColor,
  status
) {
  const tableBody = document.querySelector("#documentTable tbody");
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${docID}</td>
    <td>${docTitle}</td>
    <td>${docTimeStamp}</td>
    <td style="color: ${conditionColor} !important;">${status}</td>
  `;

  // Append the row to the table body
  tableBody.appendChild(row);
}

// Function to delete a document
async function deleteDocument(docID) {
  try {
    const docRef = userDocumentsRef.doc(docID);
    await docRef.delete();

    // Remove the row from the table
    const row = document.querySelector(`tr[data-id="${docID}"]`);
    if (row) {
      row.remove();
    }

    console.log(`Document with ID: ${docID} deleted successfully!`);
  } catch (error) {
    console.error("Error deleting document:", error);
  }
}

// Call retrieveDocuments on page load
retrieveDocuments();
