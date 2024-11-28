const firebaseConfig = {
  apiKey: "AIzaSyCPIdlzAlKkfZp3bu4YuI2fylSzxar1zA0",
  authDomain: "penro-db.firebaseapp.com",
  projectId: "penro-db",
  storageBucket: "penro-db.appspot.com",
  messagingSenderId: "25138598165",
  appId: "1:25138598165:web:9c8136ef9898df7803591c",
  measurementId: "G-8YBC8FE4XZ",
};

firebase.initializeApp(firebaseConfig);
const firebaseDB = firebase.firestore();
async function retrieveLatestRequests() {
  try {
    // Fetch all users
    const usersSnapshot = await firebaseDB.collection("users").get();
    const requestsContainer = document.getElementById("requests-container");

    // Check if the container exists in the DOM
    if (!requestsContainer) {
      console.error("The requests-container element is missing in the HTML.");
      return;
    } // Clear previous content

    if (!usersSnapshot.empty) {
      // Iterate over each user document
      for (const userDoc of usersSnapshot.docs) {
        // Get documents related to the user and order by timestamp
        const userDocumentsRef = userDoc.ref
          .collection("Documents")
          .orderBy("formattedDate", "desc") // Sort by timestamp in descending order
          .limit(4); // Limit to the latest 5 documents

        // Fetch the user's documents
        const userDocumentsSnapshot = await userDocumentsRef.get();

        if (!userDocumentsSnapshot.empty) {
          // Iterate over each document for the current user
          userDocumentsSnapshot.forEach((doc) => {
            const requestData = doc.data();
            const requestElement = document.createElement("div");
            requestElement.classList.add("latest-request");

            // Safely access the timestamp
            const timestamp = requestData.timestamp;
            let formattedDate = "N/A"; // Default value in case timestamp is missing or invalid

            if (timestamp && timestamp.seconds) {
              formattedDate = new Date(
                timestamp.seconds * 1000
              ).toLocaleDateString();
            } else if (timestamp instanceof Date) {
              formattedDate = timestamp.toLocaleDateString();
            }

            // Format the request details
            requestElement.innerHTML = `
              <img src="/Resources/image/notification-bell.svg" alt="Notification Icon" class="icon" style="height: 64px; width: auto" />
              <div class="request-details">
                <h2>Request from: ${requestData.user}</h2>
                <p>
                  ${requestData.fileName} - 
                  <span>${requestData.formattedDate}</span>
                </p>
                </div>
            `;

            // Append the new request to the container
            requestsContainer.appendChild(requestElement);

            // Optional: Log the request data for debugging
            console.log("Request Data:", requestData);
          });
        } else {
          console.log("No documents found for user:", userDoc.id);
        }
      }
    } else {
      console.log("No users found in the database.");
    }
  } catch (error) {
    console.error("Error retrieving latest requests:", error);
  }
}

async function retrieveAndCountDocuments() {
  const usersRef = firebaseDB.collection("users");

  try {
    const usersSnapshot = await usersRef.get();
    let pendingCount = 0,
      approvedCount = 0,
      declinedCount = 0;

    // Loop through each user
    for (const userDoc of usersSnapshot.docs) {
      const userDocumentsRef = userDoc.ref.collection("Documents");

      const querySnapshot = await userDocumentsRef.get();

      querySnapshot.forEach((doc) => {
        const status = doc.data().status;

        if (status === "Pending for Approval") pendingCount++;
        else if (status === "Approved") approvedCount++;
        else if (status === "Declined") declinedCount++;
      });
    }

    // Calculate total count
    const totalCount = pendingCount + approvedCount + declinedCount;

    // Update the DOM after all counts are gathered
    document.getElementById("pending-count").innerText = pendingCount;
    document.getElementById("approved-count").innerText = approvedCount;
    document.getElementById("declined-count").innerText = declinedCount;
    document.getElementById("total-count").innerText = totalCount; // Update total count
  } catch (error) {
    console.error("Error retrieving documents:", error);
  }
}

// Call the functions to display the latest requests and document counts
retrieveLatestRequests();
retrieveAndCountDocuments();
