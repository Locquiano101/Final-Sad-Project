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
    }

    // Clear previous content
    requestsContainer.innerHTML = `
      <h3>Latest Requests Received:</h3>
      <button onclick="openFileById('requests')">View All Requests</button>
    `;

    let requestCount = 0; // Initialize counter to track the number of requests displayed

    if (!usersSnapshot.empty) {
      // Iterate over each user document
      for (const userDoc of usersSnapshot.docs) {
        // Get documents related to the user and order by timestamp
        const userDocumentsRef = userDoc.ref
          .collection("Documents")
          .orderBy("formattedDate", "desc") // Sort by timestamp in descending order
          .limit(4); // Limit to the latest 4 documents

        // Fetch the user's documents
        const userDocumentsSnapshot = await userDocumentsRef.get();

        if (!userDocumentsSnapshot.empty) {
          // Iterate over each document for the current user
          for (const doc of userDocumentsSnapshot.docs) {
            if (requestCount >= 3) break; // Stop if 5 requests are displayed

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
              <img
                src="/Resources/image/white-client-profile.svg"
                alt="User Icon"
                class="profile-icon"
                height="64px"
                width="auto"
              />
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
            requestCount++; // Increment the request counter

            // Optional: Log the request data for debugging
            console.log("Request Data:", requestData);
          }

          if (requestCount >= 5) break; // Exit loop if 5 requests are already added
        } else {
          console.log("No documents found for user:", userDoc.id);
        }

        if (requestCount >= 5) break; // Exit outer loop if 5 requests are already added
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
function loadNotifications() {
  const notificationsList = document.getElementById("notifications-list");
  firebaseDB
    .collection("notifications")
    .orderBy("timestamp", "desc") // Optional: Order by timestamp to show the latest ones first
    .get()
    .then((querySnapshot) => {
      // Clear the existing notifications
      notificationsList.innerHTML = "";

      // Loop through the notifications and display them
      querySnapshot.forEach((doc) => {
        const notificationData = doc.data();
        const notificationTime = new Date(
          notificationData.timestamp.seconds * 1000
        ).toLocaleString();

        // Create the notification element
        const notificationElement = document.createElement("div");
        notificationElement.classList.add("notification");

        // Add notification content
        notificationElement.innerHTML = `
          <img
            src="/Resources/image/notification-bell.svg"
            alt="Notification Icon"
            class="icon"
            style="height: 64px; width: auto"
          />
          <div class="notification-details">
            <h3>${notificationData.title}</h3>
            <span id="notification-time-stamp">${notificationTime}</span>
          </div>
        `;

        // Create and append the button programmatically
        const button = document.createElement("button");
        button.textContent = "View Notification Details";
        button.addEventListener("click", () => {
          showPopup(
            notificationData.title,
            notificationData.message,
            notificationTime
          );
        });
        notificationElement
          .querySelector(".notification-details")
          .appendChild(button);

        // Append the notification to the container
        notificationsList.appendChild(notificationElement);
      });
    })
    .catch((error) => {
      console.error("Error getting notifications: ", error);
    });
}

function showPopup(title, message, time) {
  // Populate the popup with the notification details
  document.getElementById("popup").innerHTML = `
    <div class="notification">
      <img
        src="/Resources/image/notification-bell.svg"
        alt="Notification Icon"
        class="icon"
        style="height: 120px; width: auto"
      />
      <div class="notification-details">
        <h1>${title}</h1>
        <p>${message}</p>
        <h3 id="notification-time-stamp">${time}</h3>
        <button onclick="closePopUp()" style="background-color: #cf4747; border-style: none;">Close</button>
      </div>
    </div>
  `;

  // Show the popup and overlay
  document.getElementById("overlay").style.display = "block"; // Show the dim background
  document.getElementById("popup").style.display = "flex"; // Show the pop-up
}

function closePopUp() {
  document.getElementById("overlay").style.display = "none"; // Hide the dim background
  document.getElementById("popup").style.display = "none"; // Hide the pop-up
}

// Call the function to load notifications when the page loads
loadNotifications();

// Call the functions to display the latest requests and document counts
retrieveLatestRequests();
retrieveAndCountDocuments();
