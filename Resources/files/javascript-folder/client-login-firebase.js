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
