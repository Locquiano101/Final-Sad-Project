// Firebase Configuration
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

// Function to retrieve and display documents for all users
async function retrieveAllUserDocuments() {
  try {
    // Reference to the "users" collection
    const usersCollectionRef = firebaseDB.collection("users");

    // Get all user documents
    const usersSnapshot = await usersCollectionRef.get();

    if (usersSnapshot.empty) {
      console.log("No users found!");
      alert("No users found in the database!");
      return;
    }

    // Get the container element where documents will be displayed
    const container = document.getElementById("documentsContainer");
    container.innerHTML = ""; // Clear any previous content

    // Array of month names for timestamp formatting
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

    // Iterate through each user
    for (const userDoc of usersSnapshot.docs) {
      const userID = userDoc.id; // Get the user ID
      const userData = userDoc.data(); // Get user document data
      const userName = userData.name || "Unknown User"; // Fallback if name is missing
      console.log(`Fetching documents for user: ${userID} (${userName})`);

      // Reference to the "userDocuments" sub-collection for the current user
      const userDocumentsRef = usersCollectionRef
        .doc(userID)
        .collection("userDocuments");

      // Get all documents in the "userDocuments" sub-collection
      const documentsSnapshot = await userDocumentsRef.get();

      if (documentsSnapshot.empty) {
        console.log(`No documents found for user: ${userID} (${userName})`);
        continue;
      }

      // Create a container for each user
      const userContainer = document.createElement("div");
      userContainer.classList.add("user-container");

      // Create a header for the user with their name and ID
      const userHeader = document.createElement("h2");
      userHeader.textContent = `Documents of: ${userName}  `;
      userContainer.appendChild(userHeader);

      // Add user container to the main container
      container.appendChild(userContainer);

      // Iterate through each document in the sub-collection
      documentsSnapshot.forEach((doc) => {
        const docData = doc.data();

        if (!docData.Document_title || !docData.Condition) {
          console.log(`Missing required fields in document: ${doc.id}`);
          return;
        }

        const docTimeStamp = docData.submittedAt;
        const doctitle = docData.Document_Title;
        const Condition = docData.Condition;
        const docID = doc.id;

        // Create a div element for each document
        const docDiv = document.createElement("div");
        docDiv.classList.add("document");

        let conditionColor = null;
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

          // Get the day, month, and year
          const day = date.getDate();
          const month = date.getMonth();
          const year = date.getFullYear();

          // Set inner HTML with the document's details
          docDiv.innerHTML = `
              <h3>${doctitle}</h3>
              <h4>${userName}</h4>
              <h4>${monthNames[month]} ${day}, ${year}</h4>
              <p style="color: ${conditionColor};">${Condition}</p>
              <button class="edit-button" onclick="editDocument('${docID}', '${userID}')">Edit</button>
            `;

          // Append the document div to the user's container
          userContainer.appendChild(docDiv);
        } else {
          console.log(`Timestamp field is missing for document ID: ${docID}`);
          docDiv.innerHTML = `
              <h3>${doctitle}</h3>
              <p style="color: red;">Error: Missing timestamp for this document.</p>
            `;
          userContainer.appendChild(docDiv);
        }
      });
    }

    console.log("All user documents retrieved and displayed successfully!");
  } catch (error) {
    console.error("Error retrieving documents:", error);
    alert("Error retrieving documents: " + error.message);
  }
}

// Function to edit a document
async function editDocument(docID, userID) {
  localStorage.removeItem("docID");
  localStorage.setItem("docID", docID);
  localStorage.setItem("userID", userID);
  window.open(`edit-requests.html`, "_self");
  console.log(
    `Edit button clicked for document ID: ${docID}, User ID: ${userID}`
  );
  await loadRequestDetails(docID, userID);
}

// Call the function to retrieve and display documents
retrieveAllUserDocuments();
