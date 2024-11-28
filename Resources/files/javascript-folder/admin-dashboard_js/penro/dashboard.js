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
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Fetch and display data
const inventoryGrid = document.getElementById("inventoryGrid");

async function fetchReadyForPickup() {
  const documentsContainer = document.getElementById("documents-container");

  try {
    const usersSnapshot = await db.collection("users").get();

    if (usersSnapshot.empty) {
      documentsContainer.innerHTML = "<p>No users found!</p>";
      return;
    }

    let foundReadyDocuments = false;
    let displayedCount = 0; // Counter to limit displayed documents

    for (const userDoc of usersSnapshot.docs) {
      if (displayedCount >= 3) break; // Stop processing if limit reached

      const userID = userDoc.id;
      const userDocumentsRef = db
        .collection("users")
        .doc(userID)
        .collection("Documents");
      const documentsSnapshot = await userDocumentsRef.get();

      if (documentsSnapshot.empty) {
        console.log(`No documents found for user: ${userID}`);
        continue;
      }

      for (const doc of documentsSnapshot.docs) {
        if (displayedCount >= 3) break; // Stop displaying if limit reached

        const docData = doc.data();
        console.log("Document data:", docData);

        const { fileName, formattedDate, status } = docData;

        if (!fileName || !status) {
          console.log("Missing necessary fields in document:", doc.id);
          continue;
        }

        if (status !== "Ready for Pick Up") {
          continue;
        }

        foundReadyDocuments = true;

        let displayDate = "N/A";
        if (formattedDate instanceof firebase.firestore.Timestamp) {
          displayDate = formattedDate.toDate().toLocaleDateString();
        } else if (formattedDate) {
          displayDate = formattedDate;
        }

        const div = document.createElement("div");
        div.className = "stats";

        div.innerHTML = `
            <img
              src="/Resources/image/pickUpReady.svg"
              alt="Request Icon"
              class="icon"
              style="height: 48px; width: auto"
            />
            <div>
              <p>Document Title: ${fileName}</p>
              <p>Status: ${status}</p>
              <small>Time Stamp: ${displayDate}</small>
            </div>
            <button class="button" data-id="${doc.id}">
              Confirm Pick-up
            </button>
        `;

        div.querySelector(".button").addEventListener("click", () => {
          openPopup(`Confirming pick-up for: ${fileName}`);
        });

        documentsContainer.appendChild(div);
        displayedCount++; // Increment the counter
      }
    }

    if (!foundReadyDocuments) {
      documentsContainer.innerHTML = "<p>No documents ready for pick up.</p>";
    }
  } catch (error) {
    console.error("Error fetching documents:", error);
  }
}

function openPopup(requestId) {
  const overlay = document.getElementById("overlay");
  const popup = document.getElementById("popup");
  const requestIdSpan = document.getElementById("request-id");
  const statusSpan = document.getElementById("status");

  // Set request ID and status dynamically
  requestIdSpan.innerText = requestId;
  statusSpan.innerText = "Pending"; // You can customize the status based on actual logic

  overlay.style.display = "block"; // Show the overlay
  popup.style.display = "block"; // Show the popup
}

function closePopup() {
  const overlay = document.getElementById("overlay");
  const popup = document.getElementById("popup");

  overlay.style.display = "none"; // Hide the overlay
  popup.style.display = "none"; // Hide the popup
}

fetchReadyForPickup();

function fetchLowStocks() {
  const lowStockThreshold = 100; // Define the threshold for "low stock"
  const lowSeedTypeQtyElement = document.getElementById("lowSeedTypeQty"); // Rename for clarity

  db.collection("trees")
    .where("quantity", "<", lowStockThreshold)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        lowSeedTypeQtyElement.innerText = "None"; // Update the DOM
        return;
      }

      let lowSeedTypes = []; // Array to collect item names
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        lowSeedTypes.push(data.name); // Collect item names
      });

      // Update the DOM with the collected names
      lowSeedTypeQtyElement.innerText = lowSeedTypes.join(", ");
    })
    .catch((error) => {
      console.error("Error fetching low stock data:", error);
      // Handle errors gracefully
      lowSeedTypeQtyElement.innerText = "Error fetching data";
    });
}
function fetchOutOfStocks() {
  const outOfStocksSeedlings = document.getElementById("outofStocksSeedlings");

  db.collection("trees")
    .where("quantity", "==", 0)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        outOfStocksSeedlings.innerText = "None"; // If no out-of-stock items
        return;
      }

      let outOfStockItems = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        outOfStockItems.push(data.name); // Collect item names
      });

      // Update the DOM
      outOfStocksSeedlings.innerText = outOfStockItems.join(", ");
    })
    .catch((error) => {
      console.error("Error fetching out-of-stock data:", error);
      outOfStocksSeedlings.innerText = "Error";
    });
}
function fetchSeedlingsQuantity() {
  const seedlingQuantity = document.getElementById("seedlingQuantity");
  let totalQuantity = 0;

  db.collection("trees")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        totalQuantity += data.quantity; // Sum up the quantities
      });

      // Update the DOM with the total quantity
      seedlingQuantity.innerText = totalQuantity;
    })
    .catch((error) => {
      console.error("Error fetching total quantity:", error);
      seedlingQuantity.innerText = "Error";
    });
}
function fetchMostStocks() {
  const mostStockSeedType = document.getElementById("mostStockSeedType");
  const mostStockSeedTypeQty = document.getElementById("mostStockSeedTypeQty");

  db.collection("trees")
    .get()
    .then((querySnapshot) => {
      let mostStockItem = null;
      let highestQuantity = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.quantity > highestQuantity) {
          highestQuantity = data.quantity;
          mostStockItem = data.name;
        }
      });

      // Update the DOM
      if (mostStockItem) {
        mostStockSeedType.innerText = mostStockItem;
        mostStockSeedTypeQty.innerText = highestQuantity;
      } else {
        mostStockSeedType.innerText = "None";
        mostStockSeedTypeQty.innerText = "0";
      }
    })
    .catch((error) => {
      console.error("Error fetching most stocks data:", error);
      mostStockSeedType.innerText = "Error";
      mostStockSeedTypeQty.innerText = "N/A";
    });
}
function fetchSeedlingsData() {
  const seedTypeAvailable = document.getElementById("seedTypeAvailable");
  const seedQuantityAvailable = document.getElementById(
    "seedQuantityAvailable"
  );

  db.collection("trees")
    .get()
    .then((querySnapshot) => {
      const seedTypes = querySnapshot.size; // Number of documents = number of seed types
      let totalQuantity = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        totalQuantity += data.quantity; // Sum up the quantity
      });

      // Update the DOM
      seedTypeAvailable.innerText = seedTypes;
      seedQuantityAvailable.innerText = totalQuantity;
    })
    .catch((error) => {
      console.error("Error fetching seedlings data:", error);
      seedTypeAvailable.innerText = "Error";
      seedQuantityAvailable.innerText = "Error";
    });
}
function fetchTopRequestedSeedsAndSeedlings() {
  // Fetch top requested seeds
  firebase
    .firestore()
    .collection("trees")
    .orderBy("request", "desc") // Sort by 'request' field in descending order
    .limit(3) // Limit to the top 3 most requested seeds
    .get()
    .then((querySnapshot) => {
      let topSeeds = [];
      let seedlingTypes = [];
      let seedlingQuantities = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        topSeeds.push({
          name: data.name,
          request: data.request,
          typeOfTree: data.name,
          quantity: data.quantity,
        });

        // Collect data for chart
        seedlingTypes.push(data.name);
        seedlingQuantities.push(parseInt(data.request, 10)); // Ensure seedlingQty is a number
      });

      // Fetch Most Requested Seedlings for chart
      const ctx = document
        .getElementById("mostRequestedChart")
        .getContext("2d");

      // Render chart
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: seedlingTypes,
          datasets: [
            {
              label: "Most Requested Seedlings",
              data: seedlingQuantities,
              backgroundColor: [
                "rgba(255, 179, 186, 0.65)", // Pastel pink
                "rgba(255, 223, 186, 0.65)", // Pastel peach
                "rgba(255, 255, 186, 0.65)", // Pastel yellow
                "rgba(186, 255, 201, 0.65)", // Pastel green
                "rgba(186, 225, 255, 0.65)", // Pastel blue
              ],
              borderColor: [
                "rgba(255, 179, 186, 1)", // Darker pastel pink
                "rgba(255, 223, 186, 1)", // Darker pastel peach
                "rgba(255, 255, 186, 1)", // Darker pastel yellow
                "rgba(186, 255, 201, 1)", // Darker pastel green
                "rgba(186, 225, 255, 1)", // Darker pastel blue
              ],
              borderWidth: 2,
              borderRadius: 5, // Rounds bar corners
              barPercentage: 0.8, // Adjust bar width
            },
          ],
        },
        options: {
          responsive: true, // Ensures chart adjusts to screen size
          maintainAspectRatio: false, // Flexible height-to-width ratio
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                font: {
                  size: 16, // Font size for Y-axis labels
                  family: "Arial", // Font family
                },
                color: "#4A4A4A", // Darker text color
              },
              grid: {
                color: "rgba(200, 200, 200, 0.3)", // Light gridlines
              },
            },
            x: {
              ticks: {
                font: {
                  size: 16, // Font size for X-axis labels
                  family: "Arial", // Font family
                },
                color: "#4A4A4A",
              },
              grid: {
                display: false, // Hides gridlines for X-axis
              },
            },
          },
          plugins: {
            legend: {
              display: true,
              labels: {
                font: {
                  size: 18, // Font size for the legend
                  family: "Arial", // Font family
                },
                color: "#4A4A4A",
              },
            },
            tooltip: {
              backgroundColor: "rgba(0,0,0,0.7)", // Dark tooltip background
              titleFont: {
                size: 16, // Tooltip title font size
              },
              bodyFont: {
                size: 14, // Tooltip body font size
              },
              cornerRadius: 4, // Rounded corners for tooltips
            },
          },
          animation: {
            duration: 1000, // Smooth animation for rendering
            easing: "easeInOutCubic", // Custom animation style
          },
        },
      });
    })
    .catch((error) => {
      console.error("Error fetching top seeds: ", error);
    });
}

// Call the function to fetch data and render chart
fetchTopRequestedSeedsAndSeedlings();
// Call the function to fetch and display seedlings data
fetchSeedlingsData();
// Call the function to fetch and display the item with the most stocks
fetchMostStocks();
// Call the function to fetch and display total seedlings quantity
fetchSeedlingsQuantity();
// Call the function to fetch and display out-of-stock items
fetchOutOfStocks();
// Call the function to fetch and display low stocks
fetchLowStocks();
