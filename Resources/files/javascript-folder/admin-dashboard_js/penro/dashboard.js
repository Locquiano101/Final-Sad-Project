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

function fetchLowStocks() {
  const lowStockThreshold = 10; // Define the threshold for "low stock"
  const lowSeedType = document.getElementById("lowSeedType");
  const lowSeedTypeQty = document.getElementById("lowSeedTypeQty");

  db.collection("trees")
    .where("quantity", "<", lowStockThreshold)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        lowSeedType.innerText = "None";
        lowSeedTypeQty.innerText = "0";
        return;
      }

      let lowStockItems = [];
      let totalLowQuantity = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        lowStockItems.push(data.name); // Collect item names
        totalLowQuantity += data.quantity; // Sum up the quantities
      });

      // Update the DOM
      lowSeedTypeQty.innerText = lowStockItems.join(", ");
    })
    .catch((error) => {
      console.error("Error fetching low stock data:", error);
      lowSeedType.innerText = "Error";
      lowSeedTypeQty.innerText = "N/A";
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
              backgroundColor: "white",
              borderWidth: 1,
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
