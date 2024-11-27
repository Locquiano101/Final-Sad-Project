// Tree data
const trees = [
  // Non-Fruit-Bearing Trees
  {
    name: "Mahogany",
    typeOfTree: "not fruit-bearing Tree",
    width: 3,
    length: 4,
  },
  { name: "Narra", typeOfTree: "not fruit-bearing Tree", width: 3, length: 4 },
  {
    name: "Kamagong",
    typeOfTree: "not fruit-bearing Tree",
    width: 3,
    length: 3,
  },
  {
    name: "Dancalan",
    typeOfTree: "not fruit-bearing Tree",
    width: 3,
    length: 3,
  },
  {
    name: "Makaasim",
    typeOfTree: "not fruit-bearing Tree",
    width: 3,
    length: 3,
  },
  {
    name: "Malapili",
    typeOfTree: "not fruit-bearing Tree",
    width: 3,
    length: 3,
  },
  {
    name: "Kulipapa",
    typeOfTree: "not fruit-bearing Tree",
    width: 3,
    length: 3,
  },
  {
    name: "Neem tree",
    typeOfTree: "not fruit-bearing Tree",
    width: 3,
    length: 4,
  },
  { name: "Bulala", typeOfTree: "not fruit-bearing Tree", width: 3, length: 3 },
  { name: "Lawaan", typeOfTree: "not fruit-bearing Tree", width: 2, length: 2 },
  { name: "Lubas", typeOfTree: "not fruit-bearing Tree", width: 3, length: 3 },
  { name: "Dao", typeOfTree: "not fruit-bearing Tree", width: 7, length: 7 },
  {
    name: "Manayaw",
    typeOfTree: "not fruit-bearing Tree",
    width: 10,
    length: 10,
  },
  { name: "Amugis", typeOfTree: "not fruit-bearing Tree", width: 3, length: 3 },

  // Fruit-Bearing Trees
  { name: "Cacao", typeOfTree: "fruit-bearing Tree", width: 3, length: 4 },
  { name: "Coffee", typeOfTree: "fruit-bearing Tree", width: 4, length: 4 },
  { name: "Maligang", typeOfTree: "fruit-bearing Tree", width: 4, length: 4 },
  { name: "Lukban", typeOfTree: "fruit-bearing Tree", width: 10, length: 10 },
  { name: "Marang", typeOfTree: "fruit-bearing Tree", width: 10, length: 10 },
  { name: "Pili", typeOfTree: "fruit-bearing Tree", width: 10, length: 10 },
  { name: "Sampalok", typeOfTree: "fruit-bearing Tree", width: 10, length: 10 },
  { name: "Kalamata", typeOfTree: "fruit-bearing Tree", width: 5, length: 5 },
  { name: "Bagras", typeOfTree: "fruit-bearing Tree", width: 4, length: 4 },
  { name: "Batuan", typeOfTree: "fruit-bearing Tree", width: 10, length: 10 },
];

// Populate dropdown with tree options
const treeDropdown = document.getElementById("treeDropdown");
trees.forEach((tree) => {
  const option = document.createElement("option");
  option.value = tree.name;
  option.textContent = `(${tree.typeOfTree}) ${tree.name}`;
  treeDropdown.appendChild(option);
});

// Utility function to calculate the area of a tree
function calculateArea(width, length) {
  return width * length;
}

// Convert input quantity to area
function convertToArea() {
  const selectedTreeName = treeDropdown.value;
  const selectedTree = trees.find((tree) => tree.name === selectedTreeName);

  if (selectedTree) {
    const areaInput = parseFloat(document.getElementById("areaInput").value);
    const areaPerTree = calculateArea(selectedTree.width, selectedTree.length);
    const sqMeterInput = document.getElementById("sqMeterInput");

    if (!isNaN(areaInput)) {
      sqMeterInput.value = ((areaInput * areaPerTree) / 10000).toFixed(2);
    } else {
      sqMeterInput.value = "";
    }
  }
}
// Convert input area to tree quantity
function convertToQuantity() {
  const selectedTreeName = treeDropdown.value;
  const selectedTree = trees.find((tree) => tree.name === selectedTreeName);

  if (selectedTree) {
    const sqMeterInput = parseFloat(
      document.getElementById("sqMeterInput").value
    );
    const areaPerTree = calculateArea(selectedTree.width, selectedTree.length);
    const areaInput = document.getElementById("areaInput");

    if (!isNaN(sqMeterInput)) {
      areaInput.value = Math.ceil((sqMeterInput * 10000) / areaPerTree);
    } else {
      areaInput.value = "";
    }
  }
}
function updateInputsBasedOnTree() {
  const selectedTreeName = document.getElementById("treeDropdown").value;
  const selectedTree = trees.find((tree) => tree.name === selectedTreeName);

  if (selectedTree) {
    // Enable inputs related to the selected tree
    document.getElementById("areaInput").disabled = false;
    document.getElementById("sqMeterInput").disabled = false;

    console.log(`Selected Tree: ${selectedTree.name}`);
  } else {
    // Disable inputs if no tree is selected
    document.getElementById("areaInput").disabled = true;
    document.getElementById("sqMeterInput").disabled = true;
  }
}
// Disable inputs initially until a tree is selected
document.getElementById("areaInput").disabled = true;
document.getElementById("sqMeterInput").disabled = true;

treeDropdown.addEventListener("change", () => {
  const isSelected = !!treeDropdown.value;
  document.getElementById("areaInput").disabled = !isSelected;
  document.getElementById("sqMeterInput").disabled = !isSelected;
});

// Firebase configuration and initialization
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

// User ID from local storage
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

// Update document counts
async function retrieveAndCountDocuments() {
  const userDocumentsRef = firebaseDB
    .collection("users")
    .doc(userID)
    .collection("Documents");

  try {
    const querySnapshot = await userDocumentsRef.get();

    let pendingCount = 0,
      approvedCount = 0,
      declinedCount = 0;

    querySnapshot.forEach((doc) => {
      const status = doc.data().status; // Use 'status' instead of 'Condition'

      if (!status) return; // Skip if status is undefined or null

      if (status === "Pending for Approval") pendingCount++;
      else if (status === "Approved") approvedCount++;
      else if (status === "Declined") declinedCount++;
    });

    document.getElementById("pending-count").innerText = pendingCount;
    document.getElementById("approved-count").innerText = approvedCount;
    document.getElementById("declined-count").innerText = declinedCount;
  } catch (error) {
    console.error("Error retrieving documents:", error);
  }
}

async function calculateTopRequestedSeeds(userID) {
  console.log("Calculating..");
  try {
    const userDocumentsRef = firebaseDB
      .collection("users")
      .doc(userID)
      .collection("Documents");

    const querySnapshot = await userDocumentsRef.get();

    if (querySnapshot.empty) {
      console.log("No documents found!");
      return;
    }

    // Initialize a map to aggregate seed requests
    const seedRequests = {};

    // Process each document
    querySnapshot.forEach((doc) => {
      const docData = doc.data();

      // Extract and split Seedlings_Type and Seedlings_Number
      const seedTypes =
        docData.seedlingsType?.split(",").map((s) => s.trim()) || [];
      const seedCounts =
        docData.seedlingsNumber
          ?.split(",")
          .map((n) => parseInt(n.replace(/,/g, ""), 10)) || [];

      // Ensure both arrays have the same length
      if (seedTypes.length !== seedCounts.length) {
        console.warn("Mismatch in seed types and counts for document:", doc.id);
        return;
      }

      // Aggregate seed counts
      seedTypes.forEach((type, index) => {
        const count = seedCounts[index];
        if (type && count > 0) {
          seedRequests[type] = (seedRequests[type] || 0) + count;
        }
      });
    });

    // Convert the map to an array and sort by seed count in descending order
    const sortedSeeds = Object.entries(seedRequests).sort(
      (a, b) => b[1] - a[1]
    );

    // Extract the top 3 requested seeds
    const topSeeds = sortedSeeds.slice(0, 3);

    // Update the chart with the top 3 seeds
    updateBarChart(topSeeds);
  } catch (error) {
    console.error("Error calculating top requested seeds:", error);
  }
}

// Function to update the bar chart with new data
function updateBarChart(topSeeds) {
  console.log(topSeeds); // Log the top seeds to check the data structure

  if (!myBarChart || !myBarChart.data) {
    console.error("Chart is not initialized or has invalid data structure.");
    return;
  }

  if (!myBarChart.data.datasets || !myBarChart.data.datasets[0]) {
    console.error("Dataset structure in the chart is missing.");
    return;
  }

  const labels = topSeeds.map((seed) => seed[0]); // Seed types
  const data = topSeeds.map((seed) => seed[1]); // Seed counts

  myBarChart.data.labels = labels;
  myBarChart.data.datasets[0].data = data;

  myBarChart.update();
}

// Initialize the bar chart (this must be done before updateBarChart is called)
const ctx = document.getElementById("myBarChart").getContext("2d");
const myBarChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: [], // Empty initially
    datasets: [
      {
        label: "Top Requested Seeds",
        data: [], // Empty initially
        backgroundColor: [
          "rgba(255, 255, 255, 1)",
          "rgba(255, 255, 255, 1)",
          "rgba(255, 255, 255, 1)",
        ],
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

const fetchAndDisplayNotifications = async (userID) => {
  try {
    const notificationsRef = firebaseDB
      .collection("users")
      .doc(userID)
      .collection("Notifications");

    const snapshot = await notificationsRef.get();

    if (snapshot.empty) {
      document.getElementById("notification-container").innerHTML =
        "<p>No notifications found.</p>";
      return;
    }

    // Get the container to append notifications
    const container = document.getElementById("notification-container");
    container.innerHTML = ""; // Clear existing notifications

    // Loop through each notification document
    snapshot.forEach((doc) => {
      const notification = doc.data();
      const notificationID = doc.id; // Get the document ID for deletion

      // Create a new notification div
      const notificationDiv = document.createElement("div");
      notificationDiv.classList.add("notification");

      // Set up the structure and content, adding a delete button
      notificationDiv.innerHTML = `
        <img
          src="/Resources/image/notification-bell.svg"
          alt="Request Icon"
          class="icon"
          style="height: 64px; width: 64"
        />
        <div>
          <h2>${notification.title || "Untitled Notification"}</h2>
          <small>${notification.message || "No message provided."}</small>
          <small>Timestamp: ${
            notification.timestamp?.toDate() || "Unknown"
          }</small>
          <button class="delete-btn" data-id="${notificationID}">Delete</button>
        </div>
      `;

      // Get the delete button and add event listener
      const deleteButton = notificationDiv.querySelector(".delete-btn");
      deleteButton.addEventListener("click", async () => {
        await deleteNotification(userID, notificationID);
      });

      // Append the notification div to the container
      container.appendChild(notificationDiv);
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
};

const deleteNotification = async (userID, notificationID) => {
  try {
    const notificationRef = firebaseDB
      .collection("users")
      .doc(userID)
      .collection("Notifications")
      .doc(notificationID);

    await notificationRef.delete(); // Delete the notification document

    // Optionally, update the UI after deletion
    document
      .querySelector(`button[data-id="${notificationID}"]`)
      .parentElement.remove();
    console.log("Notification deleted successfully!");
  } catch (error) {
    console.error("Error deleting notification:", error);
  }
};

fetchAndDisplayNotifications(userID);
calculateTopRequestedSeeds(userID);
retrieveAndCountDocuments();
