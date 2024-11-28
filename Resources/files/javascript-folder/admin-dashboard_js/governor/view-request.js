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

console.log("Firebase initialized!");

// Retrieve values from localStorage
const userID = localStorage.getItem("userID");
const docID = localStorage.getItem("docID");

let filenamefromFirebase,
  activityType,
  address,
  fileName,
  formattedDate,
  landClassification,
  projectLocation,
  seedlingsNumber,
  seedlingsType,
  status,
  user,
  userNumber;

async function loadRequestDetails(docID, userID) {
  try {
    // Validate input
    if (!docID || !userID) {
      console.warn("Missing required parameters:", { docID, userID });
      return;
    }

    // Reference to the user's document
    const userDocumentRef = firebaseDB
      .collection("users")
      .doc(userID)
      .collection("Documents")
      .doc(docID);

    // Fetch document
    const docSnap = await userDocumentRef.get();

    // Check if the document exists
    if (!docSnap.exists) {
      console.warn(`Document with ID '${docID}' not found.`);
      return;
    }

    // Fetch and log sub-collection data
    const documentsCollectionSnap = await firebaseDB
      .collection("users")
      .doc(userID)
      .collection("Documents")
      .get();

    documentsCollectionSnap.forEach((docSnap) => {
      const docData = docSnap.data();

      // Assign values to global variables
      activityType = docData.activityType;
      address = docData.address;
      fileName = docData.fileName;
      formattedDate = docData.formattedDate;
      landClassification = docData.landClassification;
      projectLocation = docData.projectLocation;
      seedlingsNumber = docData.seedlingsNumber;
      seedlingsType = docData.seedlingsType;
      status = docData.status;
      user = docData.user;
      userNumber = docData.userNum;

      // Update DOM elements with document data
      document.getElementById("recipient").textContent = user;
      document.getElementById("recipientNum").textContent = userNumber;
      document.getElementById("recipientAddress").textContent = address;
      document.getElementById("seedlingQuantity").textContent = seedlingsNumber;
      document.getElementById("seedlingType").textContent = seedlingsType;
      document.getElementById("plantingSite").textContent = projectLocation;
      document.getElementById("landClassification").textContent =
        landClassification;
      document.getElementById("activityPurpose").textContent = activityType;
    });
  } catch (error) {
    console.error("Error retrieving request data:", error);
  }
}
async function updateDocumentStatus(userID, documentID, newStatus, notes) {
  try {
    // Define the path to the specific document in the "Documents" collection
    const docRef = firebaseDB
      .collection("users")
      .doc(userID)
      .collection("Documents")
      .doc(documentID);

    // Update the status field and add notes to the document
    await docRef.update({
      status: newStatus,
      notes: notes || "",
      UpdateTime: firebase.firestore.FieldValue.serverTimestamp(), //Optional: Add an updated timestamp
    });

    console.log("Document status updated successfully!");
  } catch (error) {
    console.error("Error updating document status: ", error);
    alert("Failed to update status.");
  }
}
// Add event listeners to buttons
document.addEventListener("click", async (event) => {
  if (event.target.matches("#approve, #decline")) {
    const button = event.target;
    const condition = button.id === "approve" ? "Approved" : "Declined";
    const noteField = document.querySelector("textarea#Note");
    const note = noteField ? noteField.value : "";

    // Disable all buttons while processing
    const buttons = document.querySelectorAll("#approve, #decline");
    buttons.forEach((btn) => (btn.disabled = true));

    try {
      const userDocRef = firebaseDB.collection("users").doc(userID);
      const userDocSnapshot = await userDocRef.get();

      if (!userDocSnapshot.exists) {
        throw new Error("User not found");
      }

      const userData = userDocSnapshot.data();
      const userEmail = userData.email || "No Name";

      const userDocumentsRef = userDocRef.collection("Documents").doc(docID);
      const documentSnapshot = await userDocumentsRef.get();

      if (!documentSnapshot.exists) {
        throw new Error("Document not found");
      }
      // Now populate and display the popup with the relevant information

      emailjs.init("CHysrc6RIJb6U2SkY"); // Replace with your actual EmailJS public key

      // Send email notification
      const emailResponse = await emailjs.send(
        "service_rihrhh4",
        "template_4fh1w57",
        {
          Seedling: seedlingsType,
          seedling_quantity: seedlingsNumber,
          Note: note,
          user_name: userEmail,
          Condition: condition,
          user_email: userEmail,
        }
      );

      console.log(
        "Email sent successfully:",
        emailResponse.status,
        emailResponse.text
      );

      // Prepare notification details
      const notificationDetails = {
        title: `Request ${condition}`,
        message: `Your request titled "${fileName}" has been ${condition}.`,
        note: note || "No additional notes provided.",
        condition: condition,
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
        emailStatus: "Sent", // Track email status
      };

      // Store notification using the document title as the ID
      document.getElementById("idNum").textContent = `Request ID: ${docID}`; // Set the document ID
      document.getElementById("backTodashBoard").style.visibility = "visible";
      document.getElementById(
        "detailsPopUp"
      ).textContent = `Request titled "${fileName}" has been ${condition}`; // Set the request condition (Approved/Declined)

      await firebaseDB
        .collection("users")
        .doc(userID)
        .collection("Notifications")
        .doc(fileName)
        .set(notificationDetails);

      // Update document status in Firestore
      await userDocumentsRef.update({
        status: condition,
        notes: note,
      });

      showPopup();
    } catch (error) {
      console.error("Error processing request:", error);
    } finally {
      // Re-enable all buttons once processing is complete
      buttons.forEach((btn) => (btn.disabled = false));
    }
  }
});

function showPopup() {
  document.getElementById("overlay").style.display = "block"; // Show the dim background
  document.getElementById("popup").style.display = "flex"; // Show the pop-up
}

function closePopup() {
  document.getElementById("overlay").style.display = "none"; // Hide the dim background
  document.getElementById("popup").style.display = "none"; // Hide the pop-up
}
// Load request details
loadRequestDetails(docID, userID);
