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
const firebaseDB = firebase.firestore();

const userID = localStorage.getItem("userID");

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

const fetchAndDisplayNotifications = async (userID) => {
  try {
    const notificationsRef = firebaseDB
      .collection("users")
      .doc(userID)
      .collection("Notifications");

    const snapshot = await notificationsRef.get();

    if (snapshot.empty) {
      document.getElementById("notifications-container").innerHTML =
        "<p>No notifications found.</p>";
      return;
    }

    const container = document.getElementById("notifications-container");
    container.innerHTML = ""; // Clear existing notifications

    snapshot.forEach((doc) => {
      const notification = doc.data();

      // Create a notification div
      const notificationDiv = document.createElement("div");
      notificationDiv.className = "notification";
      notificationDiv.id = doc.id; // Use document ID as the div ID for reference
      notificationDiv.style.border = "1px solid #ddd";
      notificationDiv.style.margin = "10px";
      notificationDiv.style.padding = "10px";
      notificationDiv.style.borderRadius = "5px";

      // Add content to the div
      notificationDiv.innerHTML = `
          <h3>${notification.title || "Untitled Notification"}</h3>
          <small>${notification.message || "No message provided."}</small>
          <small>Timestamp: ${
            notification.timestamp?.toDate() || "Unknown"
          }</small>
        `;

      // Create a delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.style.marginTop = "10px";
      deleteButton.addEventListener("click", () =>
        deleteNotification(userID, doc.id)
      );

      // Append button to the div
      notificationDiv.appendChild(deleteButton);

      // Append the div to the container
      container.appendChild(notificationDiv);
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
};

const deleteNotification = async (userID, notificationId) => {
  try {
    const notificationRef = firebaseDB
      .collection("users")
      .doc(userID)
      .collection("notifications")
      .doc(notificationId);

    await notificationRef.delete();

    // Remove the notification from the UI
    const notificationDiv = document.getElementById(notificationId);
    if (notificationDiv) {
      notificationDiv.remove();
    }

    console.log("Notification deleted successfully:", notificationId);
  } catch (error) {
    console.error("Error deleting notification:", error);
  }
};

// Example usage
fetchAndDisplayNotifications(userID);
