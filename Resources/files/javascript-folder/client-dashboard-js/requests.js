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

    querySnapshot.forEach((doc) => {
      const docData = doc.data();

      // Log the document data to check its structure
      console.log("Document data:", docData);

      // Check if the necessary fields exist inside documentData
      if (!docData.Document_title || !docData.Condition) {
        console.log("Missing Document_Title or Condition in document:", doc.id);
        return;
      }

      // Access Document_Title and Condition from documentData
      const docTimeStamp = docData.submittedAt;
      const Condition = docData.Condition;
      const docID = doc.id;

      let conditionColor;
      if (Condition === "Pending for Approval") {
        conditionColor = "blue";
      } else if (Condition === "Approved") {
        conditionColor = "green";
      } else if (Condition === "Declined") {
        conditionColor = "red";
      } else {
        conditionColor = "black"; // Default color for any other condition
      }

      // If timestamp exists, process it
      if (docTimeStamp) {
        const date = docTimeStamp.toDate(); // Convert Firestore timestamp to JS Date
        const day = date.getDate(); // Correct day method
        const month = date.getMonth(); // 0-indexed (0 = January)
        const year = date.getFullYear();

        // Month names array
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

        const formattedDate = `${monthNames[month]} ${day}, ${year}`;

        // Create a new row for the table
        const tableBody = document.querySelector("#documentTable tbody");
        const row = document.createElement("tr");

        row.innerHTML = `
          <td><input type="checkbox" id="checkbox-${docID}" name="documentCheckbox" value="${docID}"></td>
          <td>${docID}</td>
          <td>${formattedDate}</td>
          <td style="color: ${conditionColor} !important;">${Condition}</td>
          <td><button class="edit-button" onclick="editDocument('${docID}')">Edit</button></td>
        `;

        // Append the row to the table body
        tableBody.appendChild(row);
      } else {
        console.log("Timestamp field does not exist for document:", docID);
        return;
      }
    });

    // Sample editDocument function
    function editDocument(id) {
      alert(`Edit document with ID: ${id}`);
    }
    console.log("Documents retrieved and displayed successfully!");
  } catch (error) {
    console.error("Error retrieving documents:", error);
  }
}
retrieveDocuments();
