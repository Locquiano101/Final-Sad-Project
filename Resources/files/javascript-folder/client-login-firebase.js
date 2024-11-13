import {
  firebaseAuth,
  firebaseDB,
  userDocRef,
  userDocumentsRef,
} from "Resources/files/javascript-folder/firebase-variables.js";

// Function to send a document to a user's sub-collection
async function sendDocument(documentData, userID) {
  try {
    // Step 1: Get the last document ID and increment it
    const querySnapshot = await userDocumentsRef
      .orderBy("id", "desc")
      .limit(1)
      .get();
    let newID;

    if (!querySnapshot.empty) {
      const lastDoc = querySnapshot.docs[0];
      newID = lastDoc.data().id + 1; // Increment last document's ID
    } else {
      newID = 1; // If no documents, start with ID 1
    }

    // Step 2: Add the document data to the sub-collection with the new ID
    const subCollectionRef = userDocumentsRef.doc(newID.toString());

    await subCollectionRef.set({
      id: newID,
      ...documentData,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Document added with ID: ${newID}`);

    // Step 3: Notify the user
    console.log("Document added successfully!");
    alert("Document sent successfully!");
  } catch (error) {
    console.error("Error sending document:", error);
    alert("Error sending document: " + error.message);
  }
}

// Function to retrieve documents from a user's 'userDocuments' sub-collection
async function retrieveDocuments() {
  try {
    // Assuming userDocumentsRef is already defined as a reference to the Firestore sub-collection
    const querySnapshot = await userDocumentsRef.get();

    // Check if the querySnapshot is empty
    if (querySnapshot.empty) {
      console.log("No documents found!");
      return;
    }

    // Get the container element where documents will be displayed
    const container = document.getElementById("documentsContainer");
    container.innerHTML = ""; // Clear previous Conditions

    // Array of month names
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Loop through each document and create a div for each
    querySnapshot.forEach((doc) => {
      const docData = doc.data();

      // Log the document data to check its structure
      console.log("Document data:", docData);

      // Check if the necessary fields exist inside documentData
      if (!docData.Document_Title || !docData.Condition) {
        console.log("Missing Document_Title or Condition in document:", doc.id);
        return;
      }

      // Access Document_Title and Condition from documentData
      const docTimeStamp = docData.timestamp;
      const Condition = docData.Condition;
      const docID = doc.id;

      // Create a div element for each document
      const docDiv = document.createElement("div");
      docDiv.classList.add("document");

      if (docTimeStamp) {
        // Convert Firestore Timestamp to JavaScript Date object
        const date = docTimeStamp.toDate();

        // Get the month and year
        const day = date.getDay(); // Get the month (0 = January, 11 = December)
        const month = date.getMonth(); // Get the month (0 = January, 11 = December)
        const year = date.getFullYear(); // Get the full year (e.g., 2024)

        // Set inner HTML with the document's Document_Title and Condition
        docDiv.innerHTML = `
          <h3>${docID}</h3>
          <h3>${monthNames[month]} ${day}, ${year}</h3> <!-- Use month name instead of number -->
          <p>${Condition}</p>
          <button class="edit-button" onclick="editDocument('${doc.id}')">Edit</button>
        `;

        // Append the document div to the container
        container.appendChild(docDiv);
      } else {
        console.log("Timestamp field does not exist.");
        return null;
      }
    });

    console.log("Documents retrieved and displayed successfully!");
  } catch (error) {
    console.error("Error retrieving documents:", error);
  }
}

const exampleDocumentData = {
  Document_Title: "User Document Document_Title",
  Condition: "Ready for PickUp",
};
// Call functions if userID is available
if (userID) {
  retrieveDocuments();
} else {
  console.log("No User ID found in localStorage. User might not be logged in.");
}
