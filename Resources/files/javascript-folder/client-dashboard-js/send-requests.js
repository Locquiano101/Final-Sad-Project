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
const firebaseDB = firebase.firestore();

// Placeholder for the fetchUserData function
const userID = localStorage.getItem("userID");

const firebaseTrees = firebaseDB.collection("trees");
let completeAddress, houseNumber, userName, userEmail, userContactNumber;

const signedInUser = firebaseDB.collection("users").doc(userID);
let purok, barangay, municipality, province, postalCode;

async function displayUserData(userId) {
  try {
    const userRef = firebase.firestore().collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();

      // Extract user details
      userName = userData.name || "N/A";
      userEmail = userData.email || "N/A";
      userContactNumber = userData.contactNumber || "N/A";

      // Extract address details
      if (userData.address) {
        houseNumber = userData.address.houseNumber || "N/A";
        purok = userData.address.purok || "N/A";
        barangay = userData.address.barangay || "N/A";
        municipality = userData.address.municipality || "N/A";
        province = userData.address.province || "N/A";
        postalCode = userData.address.postalCode || "N/A";
      } else {
        // Handle case when address is missing
        houseNumber =
          purok =
          barangay =
          municipality =
          province =
          postalCode =
            "N/A";
      }
      completeAddress = [
        houseNumber,
        purok,
        barangay,
        municipality,
        province,
        postalCode,
      ].join(", ");
      console.log("user data retrieved successfully");
    } else {
      console.log("No user data found for this ID.");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}
displayUserData(userID);
// displayUserData(userID);
const treesCollection = firebaseDB.collection("trees");

const treeSelect = document.getElementById("treeSelect");
const initialTreeSelect = document.getElementById("treeSelect");
populateTreeSelect(initialTreeSelect);
// Map to store tree IDs and their corresponding names
const treeNameMap = new Map();

function populateTreeSelect(selectElement) {
  const treesCollection = firebaseDB.collection("trees");

  treesCollection
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        // Clear previous options
        selectElement.innerHTML = '<option value="">Select a tree</option>';

        // Populate options with tree names
        querySnapshot.forEach((doc) => {
          const tree = doc.data();
          const option = document.createElement("option");
          option.value = doc.id; // Use the document ID as the value
          option.textContent = tree.name; // Display the tree name
          selectElement.appendChild(option);

          // Store tree ID and name in the map
          treeNameMap.set(doc.id, tree.name);
        });
      } else {
        selectElement.innerHTML =
          '<option value="">No trees available</option>';
      }
    })
    .catch((error) => {
      console.error("Error fetching tree data:", error);
      selectElement.innerHTML = '<option value="">Error loading trees</option>';
    });
}
// Add Seedling input group with functional tree select
document.getElementById("addButton").addEventListener("click", (event) => {
  event.preventDefault();

  // Create a new input group
  const newInputGroup = document.createElement("div");
  newInputGroup.classList.add("seedling-input-group");

  newInputGroup.innerHTML = `
    <p>Quantity of seedlings</p>
    <input type="number" name="number[]" required />
    <p>Type of Seedling</p>
    <select name="treeSelect[]" required></select>
    <button class="deleteSection">DELETE</button>
  `;

  // Append the new input group to the container
  const container = document.querySelector(".seedling-input-container");
  container.appendChild(newInputGroup);

  // Populate the new treeSelect dropdown
  const newTreeSelect = newInputGroup.querySelector(
    'select[name="treeSelect[]"]'
  );
  populateTreeSelect(newTreeSelect);
});
// Use event delegation for DELETE buttons
const seedlingContainer = document.querySelector(".seedling-input-container");
seedlingContainer.addEventListener("click", (event) => {
  if (event.target && event.target.classList.contains("deleteSection")) {
    event.target.parentElement.remove();
  }
});
const propertyDetailsContainer = document.querySelector(
  ".property-details-container"
);
const landClassificationInputs = document.querySelectorAll(
  'input[name="land-classification"]'
);
// Add event listeners to the radio buttons
landClassificationInputs.forEach((input) => {
  input.addEventListener("change", () => {
    if (input.value === "Public" && input.checked) {
      propertyDetailsContainer.style.display = "none";
    } else if (input.value === "Private" && input.checked) {
      propertyDetailsContainer.style.display = "block";
    }
  });
});
function showPopup() {
  document.getElementById("popup").style.display = "block";
  document.querySelector(".overlay").style.display = "block";
}
function closePopup() {
  document.getElementById("popup").style.display = "none";
  document.querySelector(".overlay").style.display = "none";
}
//UPLOAD AND DOWNLOAD FILE
let requestorSignature = null; // To store the uploaded image

// Function to handle signature upload
function handleSignatureUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const arrayBuffer = e.target.result;
      requestorSignature = arrayBuffer; // Store the image as a Blob
    };
    reader.readAsArrayBuffer(file); // Read the file as ArrayBuffer
  }
}

async function generateTreeRequestDocument(params) {
  const {
    user,
    userNum,
    address,
    projectLocation,
    landClassification,
    activityType,
    seedlingsNumber,
    seedlingsType,
    formattedDate,
  } = params;

  const apiKey = "sbZ6dWI_66kQON_agpjlL2dNVCGwcy_FUkmiUI7MY84";
  const lat = 14.111243;
  const lng = 122.954755;
  const zoom = 15;

  const mapImageUrl = `https://image.maps.ls.hereapi.com/mia/1.6/mapview?c=${lat},${lng}&z=${zoom}&w=640&h=480&apiKey=${apiKey}`;

  // Fetch the map image
  const mapBlob = await fetch(mapImageUrl).then((res) => res.blob());
  const mapReader = await new Response(mapBlob).arrayBuffer();

  const doc = new docx.Document({
    sections: [
      {
        properties: {},
        children: [
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: "RECIPIENT’S PROFILE",
                bold: true,
                font: "Arial",
                size: 24,
              }),
            ],
            spacing: { after: 150 },
            alignment: docx.AlignmentType.CENTER,
          }),
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: `Requestor's Name: ${user} \t\t\t TEL No. / CP # ${userNum}`,
                font: "Arial",
              }),
            ],
            spacing: { after: 150 },
          }),
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: `ADDRESS: ${address}`,
                font: "Arial",
              }),
            ],
            spacing: { after: 150 },
          }),
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: "PROJECT PROFILE",
                bold: true,
                size: 24,
                font: "Arial",
              }),
            ],
            alignment: docx.AlignmentType.CENTER,
            spacing: { after: 150 },
          }),
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: `LOCATION PROJECT/PLANTING SITE: ${projectLocation}`,
                font: "Arial",
              }),
            ],
            spacing: { after: 150 },
          }),
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: `LAND CLASSIFICATION OF THE PROPERTY: ${landClassification}`,
                font: "Arial",
              }),
            ],
            spacing: { after: 150 },
          }),
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: `IF PRIVATE (Pls. attach Xerox copy)`,
                font: "Arial",
              }),
            ],
            spacing: { after: 150 },
          }),
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: `Purpose of the Activity: ${activityType}`,
                font: "Arial",
              }),
            ],
            spacing: { after: 150 },
          }),
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: `LOCATION / VICINITY MAP OF PLANTING SITE:`,
                font: "Arial",
              }),
            ],
            spacing: { after: 150 },
          }),
          new docx.Paragraph({
            alignment: docx.AlignmentType.CENTER,
            children: [
              new docx.ImageRun({
                data: mapReader,
                transformation: { width: 600, height: 250 },
              }),
            ],
          }),
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: `Total Number of Seeds: ${seedlingsNumber}\t\t\tSeedling Type: ${seedlingsType}`,
                font: "Arial",
              }),
            ],
            spacing: { after: 150 },
          }),
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: "PROMISSORY NOTE",
                bold: true,
                font: "Arial",
                size: 24,
              }),
            ],
            spacing: { after: 150 },
            alignment: docx.AlignmentType.CENTER,
          }),
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: `I am aware that PG-PENRO staff will monitor the growth of the planted seedlings. I will maintain and protect said seedlings to ensure a 150% survival rate. Otherwise, I will pay for the seedlings that do not survive in the amount of THIRTY PESOS (P30.00 each).`,
                font: "Arial",
              }),
            ],
            alignment: docx.AlignmentType.JUSTIFY,
            spacing: { after: 150 },
          }),
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: `Signed this ${formattedDate}`,
                font: "Arial",
              }),
            ],
            spacing: { after: 150 },
          }),
          new docx.Paragraph({
            alignment: docx.AlignmentType.CENTER,
            children: [
              new docx.ImageRun({
                data: requestorSignature,
                transformation: { width: 200, height: 100 },
              }),
            ],
          }),
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: `${user}`,
                font: "Arial",
              }),
            ],
            alignment: docx.AlignmentType.CENTER,
            spacing: { after: 150 },
          }),
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: "(Name and Signature of the Requesting Person)",
                font: "Arial",
              }),
            ],
            alignment: docx.AlignmentType.CENTER,
            spacing: { after: 300 },
          }),
          new docx.Paragraph({}),

          // Recommending Approval and Approved By
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: `Recommending Approval: \t\t\t\t\t APPROVED BY:`,
                font: "Arial",
              }),
            ],
            spacing: { after: 150 },
            font: "Arial",
            size: 24,
          }),
          new docx.Paragraph({}),
          new docx.Paragraph({}),
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: `LEOPOLDO P. BADIOLA \t\t\t\t\t HON. RICARTE R. PADILLA`,
                font: "Arial",
              }),
            ],
            spacing: { after: 150 },
            font: "Arial",
            size: 24,
          }),
          new docx.Paragraph({
            children: [
              new docx.TextRun({
                text: `Prov’l Environmental and Natural Resources Officer \t\t Governor`,
                font: "Arial",
              }),
            ],
            spacing: { after: 150 },
            font: "Arial",
            size: 24,
          }),
        ],
      },
    ],
  });

  const sanitizedRequestorName = user.replace(/[\/\\:.*?"<>| ]/g, "");
  const sanitizedseedlingsType = seedlingsType.replace(
    /[\/\\:*.?"<>|m, ]/g,
    ""
  );

  const fileName = `${sanitizedRequestorName}_${sanitizedseedlingsType}_tree_request.docx`;

  const docBlob = await docx.Packer.toBlob(doc);

  insertDocumentToFirestore(params, userID, fileName);

  // Create a link element to download the document
  const link = document.createElement("a");
  link.href = URL.createObjectURL(docBlob);
  link.download = fileName;
  link.click();
  docx.Packer.toBlob(doc).then((docBlob) => {
    const formData = new FormData();
    formData.append("file", docBlob, fileName);
    formData.append("requestorName", user);

    fetch(
      "https://aliceblue-owl-540826.hostingersite.com//client-dashboard/upload.php",
      {
        method: "POST",
        body: formData,
        mode: "cors",
        credentials: "omit",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Network response was not ok: " + response.statusText
          );
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === "success") {
          alert(data.message);
        } else {
          console.error("Upload failed:", data.message);
          alert("Error: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Upload error:", error);
        alert("An error occurred: " + error.message);
      });
  });
}
async function insertDocumentToFirestore(params, userID, fileName) {
  try {
    // Define the path where the user-specific document IDs are stored
    const userRef = firebaseDB.collection("users").doc(userID);

    // Reference to track the incrementing ID in a specific document (e.g., "metaData" or "counters")
    const counterRef = userRef.collection("metaData").doc("documentCounter");

    // Get the current counter value (incrementing ID)
    const docSnapshot = await counterRef.get();
    let currentCounter = docSnapshot.exists ? docSnapshot.data().counter : 0;

    // Increment the counter for the next document ID
    currentCounter += 1;

    // Set the document with the incrementing ID (you can set this as the document ID)
    const docRef = userRef.collection("Documents").doc(`${currentCounter}`);

    // Add "Pending for Approval" field to the params
    const documentData = {
      ...params, // Spread the existing params data
      status: "Pending for Approval",
      fileName: fileName, // Add the new field
    };

    // Insert the params data into Firestore
    await docRef.set(documentData);

    // Update the counter for the next time
    await counterRef.set({ counter: currentCounter });

    console.log(
      "Document successfully added to Firestore with ID: " + currentCounter
    );
  } catch (error) {
    console.error("Error adding document to Firestore: ", error);
  }
}
async function updateTreeData(treeId, treeName, requestedQuantity) {
  try {
    await firebaseDB.runTransaction(async (transaction) => {
      const treeDocRef = treesCollection.doc(treeId);
      const treeDoc = await transaction.get(treeDocRef);

      if (!treeDoc.exists) {
        console.error(`Tree document with ID "${treeId}" does not exist!`);
        return;
      }

      const currentData = treeDoc.data();
      const availableQuantity = currentData.quantity || 0;

      if (requestedQuantity > availableQuantity) {
        alert(
          `Low on stocks: Cannot request ${requestedQuantity} for "${treeName}".`
        );
        console.error(
          `Low on stocks: Cannot request ${requestedQuantity} for "${treeName}".`
        );
        return;
      }

      transaction.update(treeDocRef, {
        quantity: availableQuantity - requestedQuantity, // Ensure both are numbers
        request: (currentData.request || 0) + 1,
      });
    });
  } catch (error) {
    console.error(`Error updating tree data for ID "${treeId}":`, error);
  }
}
document
  .getElementById("projectForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const formData = {};

      // Collect Seedling Information
      const seedlings = [];
      document.querySelectorAll(".seedling-input-group").forEach((group) => {
        const treeId = group.querySelector('select[name="treeSelect[]"]').value;
        const requestedQuantity = parseInt(
          group.querySelector('input[name="number[]"]').value,
          10
        );

        if (isNaN(requestedQuantity) || requestedQuantity <= 0) {
          console.error("Invalid quantity entered:", requestedQuantity);
          return; // Skip invalid entries
        }

        const treeName = treeNameMap.get(treeId) || "Unknown Tree"; // Replace treeNameMap with actual mapping logic

        seedlings.push({ treeId, requestedQuantity, treeName });

        console.log(
          `Submitting Tree ID: ${treeId}, Quantity: ${requestedQuantity}`
        );
        // Call updateTreeData with the correct quantity
        updateTreeData(treeId, requestedQuantity); // Ensure this function is defined
      });

      // Populate formData with seedling details
      formData.seedlings = seedlings.map((seedling) => ({
        quantity: seedling.requestedQuantity,
        type: seedling.treeName, // Use the name instead of ID
      }));

      // Collect Project Location
      formData.projectLocation =
        document.getElementById("project-location").value;

      // Collect Land Classification
      const landClassification = document.querySelector(
        'input[name="land-classification"]:checked'
      );
      formData.landClassification = landClassification
        ? landClassification.value
        : null;

      // Collect Activity Type
      formData.activityType = document.getElementById("activity-type").value;

      // Collect Promissory Note Agreement
      formData.agreedToPromissoryNote =
        document.getElementById("agree-note").checked;

      // Get the current date for document
      const formattedDate = new Date().toISOString(); // Alternatively, use Firestore timestamp if required

      // Fetch the user's information
      const user = userName || "Anonymous User"; // Replace with actual user data
      const userNum = userContactNumber || "Unknown Contact"; // Replace with actual user contact number
      const address = completeAddress || "Unknown Address"; // Replace with the user's address

      // Parameters for generating the request document
      const params = {
        user: user,
        userNum: userNum,
        address: address,
        projectLocation: formData.projectLocation,
        landClassification: formData.landClassification,
        activityType: formData.activityType,
        seedlingsNumber: formData.seedlings.map((s) => s.quantity).join(", "),
        seedlingsType: formData.seedlings.map((s) => s.type).join(", "),
        formattedDate: formattedDate,
      };

      // Generate the tree request document
      generateTreeRequestDocument(params); // Ensure this function is defined

      // Show confirmation popup
      showPopup(); // Ensure this function is defined
    } catch (error) {
      console.error("Error collecting form data:", error);
    }
  });

function displayMap() {
  // Initialize the platform object
  var platform = new H.service.Platform({
    apikey: "sbZ6dWI_66kQON_agpjlL2dNVCGwcy_FUkmiUI7MY84",
  });

  // Obtain the default map types from the platform object
  var maptypes = platform.createDefaultLayers();

  // Instantiate (and display) the map
  var map = new H.Map(
    document.getElementById("mapContainer"),
    maptypes.vector.normal.map,
    {
      center: { lat: 14.111243, lng: 122.954755 },
      zoom: 16,
      pixelRatio: window.devicePixelRatio || 1,
    }
  );

  // This adds a resize listener to make sure that the map occupies the whole container
  window.addEventListener("resize", () => map.getViewPort().resize());

  // Enable default interactions (pan/zoom) on the map
  var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

  // Create a custom DOM element for the marker with a label
  var markerLabel = `
  <div style="position: relative; text-align: center;">
    <div style="background-color: white; padding: 2px 5px; border: 1px solid black; border-radius: 3px; margin-bottom: 5px; font-size: 12px; font-weight: bold; color">
      <p style="color:black";>Daet Capitol</p>
    </div>
    <div style="width: 10px; height: 10px; background-color: red; border-radius: 50%;"></div>
  </div>
`;

  // Create a custom DOM Icon
  var domIcon = new H.map.DomIcon(markerLabel);

  // Add the custom marker to the map
  var marker = new H.map.DomMarker(
    { lat: 14.111243, lng: 122.954755 },
    { icon: domIcon }
  );
  map.addObject(marker);
}

displayMap();
