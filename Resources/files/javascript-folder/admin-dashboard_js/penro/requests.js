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

    let foundApprovedDocuments = false; // Flag to track if any approved documents are found

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

        // Filter for "Approved" status
        if (status !== "Approved") {
          return; // Skip this document if it doesn't match the required status
        }

        // Mark that we found an "Approved" document
        foundApprovedDocuments = true;

        // Convert the formattedDate if it's a Firestore Timestamp
        let displayDate = "N/A";
        if (formattedDate instanceof firebase.firestore.Timestamp) {
          displayDate = formattedDate.toDate().toLocaleDateString(); // Convert to local date string
        } else if (formattedDate) {
          displayDate = formattedDate; // Use the formattedDate directly if it's already a string
        }

        // Create a new table row
        const row = document.createElement("tr");
        row.dataset.id = doc.id; // Store docID for row identification during deletion

        row.innerHTML = `
          <td>
            <button class="download-file" data-file="${fileName}">Download File</button> ${fileName}
          </td>
          <td>${requestor}</td>
          <td>${displayDate}</td>
          <td>${status}</td>
          <td>
            <div style="display: flex; gap: 5px;">
              <button class="edit-button" onclick="editDocument('${userID}', '${doc.id}')">
                View
              </button>
            </div>
          </td>
        `;

        // Append the row to the table body
        tableBody.appendChild(row);
      });
    }

    if (!foundApprovedDocuments) {
      console.log("No documents with status 'Approved' found!");
    } else {
      console.log(
        "All 'Approved' documents retrieved and displayed successfully!"
      );
    }
  } catch (error) {
    console.error("Error retrieving documents:", error);
  }
}

// Event listener for download buttons
document.querySelector("#documentTable").addEventListener("click", (event) => {
  if (event.target.classList.contains("download-file")) {
    const fileName = event.target.getAttribute("data-file"); // Retrieve fileName from the button's data attribute
    const fileUrl = `https://aliceblue-owl-540826.hostingersite.com//client-dashboard/uploads/documents/${fileName}`;

    // Create an anchor element
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;

    // Append the anchor to the body
    document.body.appendChild(a);

    // Trigger a click event on the anchor
    a.click();

    // Remove the anchor from the body
    document.body.removeChild(a);
  }
});

// double it and give it to the next fucntion
function editDocument(userID, docID) {
  localStorage.setItem("docID", docID);
  localStorage.setItem("userID", userID);
  alert(`Edit function called for User: ${userID}, Document: ${docID}`);
  window.open("view-requests.html", "_self");
}

retrieveAllDocuments();
