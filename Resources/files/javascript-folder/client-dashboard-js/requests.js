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

// Reference to user's document collection in 'users' sub-collection
const userDocRef = firebaseDB.collection("users").doc(userID);
const userDocumentsRef = userDocRef.collection("Documents");

// Export the instances and references
async function displayUserData(userId) {
  try {
    const userRef = firebase.firestore().collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();

      userName = userData.name || "N/A";
      userEmail = userData.email || "N/A";

      document.getElementById("user").textContent = userName;
      document.getElementById("email").textContent = userEmail;
      console.log(userName, userEmail);
    } else {
      console.log("No user data found for this ID.");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}
displayUserData(userID);

async function retrieveDocuments() {
  try {
    // Assuming userDocumentsRef is already defined as a reference to the Firestore sub-collection
    const querySnapshot = await userDocumentsRef.get();

    // Check if the querySnapshot is empty
    if (querySnapshot.empty) {
      console.log("No documents found!");
      return;
    }

    querySnapshot.forEach((doc) => {
      const docData = doc.data();

      // Log the document data to check its structure
      console.log("Document data:", docData);

      // Check if the necessary fields exist inside documentData
      if (!docData.fileName || !docData.status) {
        console.log("Missing fileName or status in document:", doc.id);
        return;
      }

      // Access Document_Title and status from documentData
      const docTimeStamp = docData.formattedDate;
      const status = docData.status;
      const docID = doc.id;
      const docTitle = docData.fileName;

      let conditionColor;
      if (status === "Pending for Approval") {
        conditionColor = "white";
      } else if (status === "Approved") {
        conditionColor = "green";
      } else if (status === "Declined") {
        conditionColor = "red";
      } else {
        conditionColor = "white"; // Default color for any other condition
      }

      // If timestamp exists, process it
      if (docTimeStamp) {
        // Create a new row for the table
        const tableBody = document.querySelector("#documentTable tbody");
        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${docID}</td>
        <td>${docTitle}</td>
        
          <td>${docTimeStamp}</td>
          <td style="color: ${conditionColor} !important;">${status}</td>
          <td><button class="edit-button" onclick="deleteDocument('${docID}')">Delete</button></td>
        `;

        // Append the row to the table body
        tableBody.appendChild(row);
      } else {
        console.log("Timestamp field does not exist for document:", docID);
        return;
      }
    });

    console.log("Documents retrieved and displayed successfully!");
  } catch (error) {
    console.error("Error retrieving documents:", error);
  }
}
async function deleteDocument(docID) {
  try {
    // Reference to the document in Firestore
    const docRef = userDocumentsRef.doc(docID);

    // Delete the document from Firestore
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
retrieveDocuments();
