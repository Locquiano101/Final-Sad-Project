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

function populateTreeInputs(containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found.`);
    return;
  }

  const treesCollection = firebaseDB.collection("trees");

  treesCollection
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        // Find all seedling input groups within the container
        const inputGroups = container.querySelectorAll(".seedling-input-group");

        inputGroups.forEach((group, index) => {
          const selectElement = group.querySelector(
            "select[name='treeSelect[]']"
          );
          if (selectElement) {
            // Clear existing options
            selectElement.innerHTML = "";

            // Add new options from the database
            querySnapshot.forEach((doc) => {
              const tree = doc.data();
              const option = document.createElement("option");
              option.value = doc.id;
              option.textContent = tree.name;

              selectElement.appendChild(option);
            });
          } else {
            console.warn(`Select element not found in group #${index + 1}`);
          }
        });
      } else {
        console.log("No trees available in the database.");
      }
    })
    .catch((error) => {
      console.error("Error fetching tree data:", error);
    });
}

populateTreeInputs("seedlingInputContainer");

let treeCount = 1; // Initialize a counter to track the number of trees

document.getElementById("addnewTree").addEventListener("click", function () {
  // Get the container where new seedling types will be added
  const container = document.getElementById("newSeedlingInputContainer");

  if (!container) {
    console.error("Container with id 'newSeedlingInputContainer' not found.");
    return;
  }

  // Create the HTML for the new seedling group with an incremented tree number
  const newTypeGroupHTML = `
      <div class="seedling-input-group">
          <div style="display:flex; align-items: center;">
            <h2 style="flex: 3;">New Tree #${treeCount}</h2>
            <button id="deleteThisDiv" style="flex: 1;background-color: #CF4747" >Delete</button>
          </div>
        <p>Name of Tree:</p>
        <input type="text" name="newTypeName" required />
        <p>Type of Tree:</p>
        <select name="newTypeTreeType" required>
          <option value="non-fruitbearing">Non-Fruit Bearing</option>
          <option value="fruitbearing">Fruit Bearing</option>
        </select>
        <p>Quantity of seedlings:</p>
        <input type="number" name="newTypeQuantity" required />
        <p>Length:</p>
        <input type="number" name="newTypeLength" required />
        <p>Width:</p>
        <input type="number" name="newTypeWidth" required />
      </div>
    `;

  // Append the new group to the container by updating innerHTML
  container.innerHTML += newTypeGroupHTML;

  // Increment the counter for the next tree
  treeCount++;
});

document.getElementById("addButton").addEventListener("click", function () {
  // Get the container for seedling inputs
  const container = document.getElementById("seedlingInputContainer");

  // Create a new input group
  const newGroup = document.createElement("div");
  newGroup.classList.add("seedling-input-group");

  // Find the current number of input groups
  const groupCount =
    container.getElementsByClassName("seedling-input-group").length + 1;

  // Add the content for the new input group
  newGroup.innerHTML = `
        <h2>Seedling #${groupCount}</h2>
        <p>Type of Seedling</p>
        <select name="treeSelect[]" required>
          <option>Loading...</option>
        </select>
        <p>Quantity of seedlings</p>
        <input type="number" name="number[]" required />
    `;

  // Append the new group to the container
  container.appendChild(newGroup);

  // Call populateTreeInputs with the ID of the container
  populateTreeInputs("seedlingInputContainer");
});

function updateTreeData(docId, updatedData) {
  const treeDocRef = firebaseDB.collection("trees").doc(docId);

  treeDocRef
    .update(updatedData)
    .then(() => {
      console.log(
        `Tree data with ID ${docId} updated successfully. Data Updated: ${updatedData}`
      );
    })
    .catch((error) => {
      console.error(`Error updating tree data: ${error}`);
    });
}
function addTreeData(newData) {
  const treesCollectionRef = firebaseDB.collection("trees");

  treesCollectionRef
    .add(newData)
    .then((docRef) => {
      console.log(`New tree data added with ID: ${docRef.id}`);
    })
    .catch((error) => {
      console.error(`Error adding tree data: ${error}`);
    });
}

document
  .getElementById("UpdateInventory")
  .addEventListener("click", function () {
    const existingInventory = [];
    const newInventory = [];

    // Gather data for existing inventory
    const existingSeedlings = document.querySelectorAll(
      "#seedlingInputContainer .seedling-input-group"
    );

    existingSeedlings.forEach((seedling, index) => {
      const type = seedling.querySelector('select[name="treeSelect[]"]').value;
      const quantity = parseInt(
        seedling.querySelector('input[name="number[]"]').value,
        10
      );
      existingInventory.push({
        id: `Seedling #${index + 1}`,
        type: type,
        quantity: quantity || 0,
      });
      // Example data to add or update
      const newTreeData = {
        quantity: quantity || 0,
      };

      updateTreeData(type, newTreeData);
    });

    // Gather data for new inventory
    const newSeedlings = document.querySelectorAll(
      "#newSeedlingInputContainer .seedling-input-group"
    );

    newSeedlings.forEach((seedling) => {
      const name = seedling.querySelector('input[name="newTypeName"]').value;
      const treeType = seedling.querySelector(
        'select[name="newTypeTreeType"]'
      ).value;
      const quantity = parseInt(
        seedling.querySelector('input[name="newTypeQuantity"]').value,
        10
      );
      const length = parseFloat(
        seedling.querySelector('input[name="newTypeLength"]').value
      );
      const width = parseFloat(
        seedling.querySelector('input[name="newTypeWidth"]').value
      );

      newInventory.push({
        name: name,
        treeType: treeType,
        quantity: quantity || 0,
        length: length || 0,
        width: width || 0,
      });

      const newTreeData = {
        name: name,
        treeType: treeType,
        quantity: quantity || 0,
        length: length || 0,
        width: width || 0,
        request: 0,
      };
      // Add the new tree data
      addTreeData(newTreeData);
    });

    // Log inventories (can be removed in production)
    console.log("Existing Inventory:", existingInventory);
    console.log("New Inventory:", newInventory);

    alert("Inventory updated successfully!");
  });
