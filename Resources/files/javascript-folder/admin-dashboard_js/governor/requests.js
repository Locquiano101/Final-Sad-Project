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

// Function to retrieve and display all documents
async function retrieveAllDocuments() {
  try {
    const usersCollection = firebaseDB.collection("users");
    const usersSnapshot = await usersCollection.get();

    if (usersSnapshot.empty) {
      console.log("No users found!");
      return;
    }

    // Reference the table body
    const tableBody = document.querySelector("#documentTable tbody");
    tableBody.innerHTML = ""; // Clear previous rows

    foundPendingDocuments = false; // Flag to track if any pending documents are found

    // Iterate through all users
    for (const userDoc of usersSnapshot.docs) {
      const userID = userDoc.id;
      const userDocumentsRef = usersCollection
        .doc(userID)
        .collection("Documents");
      const documentsSnapshot = await userDocumentsRef.get();

      if (documentsSnapshot.empty) {
        console.log(`No documents found for user: ${userID}`);
        continue;
      }

      // Iterate through all documents for this user
      documentsSnapshot.forEach((doc) => {
        const docData = doc.data();

        // Log the document data to check its structure
        console.log("Document data:", docData);

        // Validate required fields
        const { fileName, user: requestor, status, formattedDate } = docData;
        if (!fileName || !status || !requestor) {
          console.log("Missing necessary fields in document:", doc.id);
          return;
        }

        // Only proceed if the status is "Pending for Approval"
        if (status !== "Ready for Pick Up") {
          return;
        }

        // Mark that we found a pending document
        foundPendingDocuments = true;

        // Create a new table row
        const row = document.createElement("tr");
        row.dataset.id = doc.id; // Store docID for row identification during deletion

        row.innerHTML = `
          <td>${fileName}</td>
          <td>${requestor}</td>
          <td>${formattedDate || "N/A"}</td>
          <td>${status}</td>
          <td>
            <div style="display: flex; gap: 5px;">
              <button
                class="edit-button"
                onclick="editDocument('${userID}', '${doc.id}')"
              >
                View
              </button>
            </div>
          </td>
        `;

        // Append the row to the table body
        tableBody.appendChild(row);
      });
    }

    // If no pending documents are found, show a message
    if (!foundPendingDocuments) {
      const noPendingRow = document.createElement("tr");
      noPendingRow.innerHTML = `
        <td colspan="5" style="text-align: center; color: gray;">
          No documents pending for approval.
        </td>
      `;
      tableBody.appendChild(noPendingRow);
    }

    console.log("All pending documents retrieved and displayed successfully!");
  } catch (error) {
    console.error("Error retrieving documents:", error);
  }
}

//double it and give it to the next fucntion
function editDocument(userID, docID) {
  localStorage.setItem("docID", docID);
  alert(`Edit function called for User: ${userID}, Document: ${docID}`);
  window.open("view-requests.html", "_self");
}

retrieveAllDocuments();
