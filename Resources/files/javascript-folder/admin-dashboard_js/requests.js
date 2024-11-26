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

        // Ensure necessary fields exist
        if (!docData.fileName || !docData.status || !docData.user) {
          console.log("Missing necessary fields in document:", doc.id);
          return;
        }

        // Extract fields from the document
        const docTitle = docData.fileName;
        const requestor = docData.user;
        const docTimeStamp = docData.formattedDate || "N/A";
        const status = docData.status;
        const docID = doc.id; // Firestore-generated ID

        // Set condition color based on status
        let conditionColor;
        switch (status) {
          case "Pending for Approval":
            conditionColor = "white";
            break;
          case "Approved":
            conditionColor = "green";
            break;
          case "Declined":
            conditionColor = "red";
            break;
          default:
            conditionColor = "gray";
        }

        // Create a new row for the table
        const row = document.createElement("tr");
        row.dataset.id = docID; // Store docID for row identification during deletion

        row.innerHTML = `
          <td>${docTitle}</td>
          <td>${requestor}</td>
          <td>${docTimeStamp}</td>
          <td style="color: ${conditionColor} !important;">${status}</td>
          <td>
           <div style="display: flex">
              <button
                class="edit-button"
                onclick="edit('${userID}', '${docID}')"
              >
                Edit
              </button>
              <br />
              <button
                class="delete-button"
                onclick="Delete('${userID}', '${docID}')"
              >
                Delete
              </button>
            </div></td>
        `;

        // Append the row to the table body
        tableBody.appendChild(row);
      });
    }

    console.log("All documents retrieved and displayed successfully!");
  } catch (error) {
    console.error("Error retrieving documents:", error);
  }
}

async function deleteDocument(userID, docID) {
  try {
    // Reference to the document in Firestore
    const docRef = firebaseDB
      .collection("users")
      .doc(userID)
      .collection("Documents")
      .doc(docID);

    // Delete the document from Firestore
    await docRef.delete();

    // Remove the row from the table
    const row = document.querySelector(`tr[data-id="${docID}"]`);
    if (row) {
      row.remove();
    }

    console.log(
      `Document with ID: ${docID} for user: ${userID} deleted successfully!`
    );
  } catch (error) {
    console.error("Error deleting document:", error);
  }
}

// Call the function to retrieve and display all documents
retrieveAllDocuments();
