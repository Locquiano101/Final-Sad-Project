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
console.log(userID);

// Reference to user's document collection in 'users' sub-collection
const userDocRef = firebaseDB.collection("users").doc(userID);
const userDocumentsRef = userDocRef.collection("userDocuments");

// Export the instances and references

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

      let conditionColor;
      if (Condition === "Ready for PickUp") {
        conditionColor = "red";
      } else if (Condition === "Pending for PickUp") {
        conditionColor = "blue";
      } else if (Condition === "Declined for PickUp") {
        conditionColor = "green";
      } else {
        conditionColor = "black"; // Default color for any other condition
      }

      if (docTimeStamp) {
        // Convert Firestore Timestamp to JavaScript Date object
        const date = docTimeStamp.toDate();

        // Get the month and year
        const day = date.getDay(); // Get the month (0 = January, 11 = December)
        const month = date.getMonth(); // Get the month (0 = January, 11 = December)
        const year = date.getFullYear(); // Get the full year (e.g., 2024)

        // Set inner HTML with the document's Document_Title and Condition
        docDiv.innerHTML = `
        <input type="checkbox" id="checkbox-${docID}" name="documentCheckbox" value="${docID}">
        <h3>${docID}</h3>
        <h3>${monthNames[month]} ${day}, ${year}</h3>
        <p style="color: ${conditionColor};">${Condition}</p>
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
retrieveDocuments();
