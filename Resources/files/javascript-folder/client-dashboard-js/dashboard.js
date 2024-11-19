// Tree data: [tree name, width, length]
const trees = [
  // Non-Fruit-Bearing Trees
  {
    name: "Mahogany",
    typeOfTree: "not fruit-bearing Tree",
    width: 3,
    length: 4,
  },
  {
    name: "Narra",
    typeOfTree: "not fruit-bearing Tree",
    width: 3,
    length: 4,
  },
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
  {
    name: "Bulala",
    typeOfTree: "not fruit-bearing Tree",
    width: 3,
    length: 3,
  },
  {
    name: "Lawaan",
    typeOfTree: "not fruit-bearing Tree",
    width: 2,
    length: 2,
  },
  {
    name: "Lubas",
    typeOfTree: "not fruit-bearing Tree",
    width: 3,
    length: 3,
  },
  {
    name: "Dao",
    typeOfTree: "not fruit-bearing Tree",
    width: 7,
    length: 7,
  },
  {
    name: "Manayaw",
    typeOfTree: "not fruit-bearing Tree",
    width: 10,
    length: 10,
  },
  {
    name: "Amugis",
    typeOfTree: "not fruit-bearing Tree",
    width: 3,
    length: 3,
  },

  // Fruit-Bearing Trees
  {
    name: "Cacao",
    typeOfTree: "fruit-bearing Tree",
    width: 3,
    length: 4,
  },
  {
    name: "Coffee",
    typeOfTree: "fruit-bearing Tree",
    width: 4,
    length: 4,
  },
  {
    name: "Maligang",
    typeOfTree: "fruit-bearing Tree",
    width: 4,
    length: 4,
  },
  {
    name: "Lukban",
    typeOfTree: "fruit-bearing Tree",
    width: 10,
    length: 10,
  },
  {
    name: "Marang",
    typeOfTree: "fruit-bearing Tree",
    width: 10,
    length: 10,
  },
  {
    name: "Pili",
    typeOfTree: "fruit-bearing Tree",
    width: 10,
    length: 10,
  },
  {
    name: "Sampalok",
    typeOfTree: "fruit-bearing Tree",
    width: 10,
    length: 10,
  },
  {
    name: "Kalamata",
    typeOfTree: "fruit-bearing Tree",
    width: 5,
    length: 5,
  },
  {
    name: "Bagras",
    typeOfTree: "fruit-bearing Tree",
    width: 4,
    length: 4,
  },
  {
    name: "Batuan",
    typeOfTree: "fruit-bearing Tree",
    width: 10,
    length: 10,
  },
];
// Populate dropdown with tree options

// Populate dropdown with tree options
const treeDropdown = document.getElementById("treeDropdown");
trees.forEach((tree) => {
  const option = document.createElement("option");
  option.value = tree.name;
  option.textContent = `(${tree.typeOfTree}) ${tree.name}`;
  treeDropdown.appendChild(option);
});

// Function to calculate area for each tree based on width and length
function calculateArea(width, length) {
  return width * length;
}

function ConvertToArea() {
  const selectedTreeType = treeDropdown.value;
  const selectedTree = trees.find((tree) => tree.name === selectedTreeType);

  if (selectedTree) {
    const areaInput = parseFloat(document.getElementById("areaInput").value);
    const areaPerTree = calculateArea(selectedTree.width, selectedTree.length);
    const sqMeterInput = document.getElementById("sqMeterInput");

    if (!isNaN(areaInput) && areaPerTree > 0) {
      const totalArea = (areaInput * areaPerTree) / 10000;
      sqMeterInput.value = totalArea; // Round up to nearest whole number
    } else {
      sqMeterInput.value = "";
    }
  }
}

function ConvertToQuantity() {
  const selectedTreeType = treeDropdown.value;
  const selectedTree = trees.find((tree) => tree.name === selectedTreeType);

  if (selectedTree) {
    const sqMeterInput = parseFloat(
      document.getElementById("sqMeterInput").value
    );
    const areaPerTree = calculateArea(selectedTree.width, selectedTree.length);
    const areaInput = document.getElementById("areaInput");

    if (!isNaN(sqMeterInput) && areaPerTree > 0) {
      const numberOfTrees = (sqMeterInput * 10000) / areaPerTree;
      areaInput.value = Math.ceil(numberOfTrees); // Round up to nearest whole number
    } else {
      areaInput.value = "";
    }
  }
}

// Disable input boxes initially
document.getElementById("areaInput").disabled = true;
document.getElementById("sqMeterInput").disabled = true;

// Enable input boxes only when a tree is selected
document.getElementById("treeDropdown").addEventListener("change", (e) => {
  const selectedTreeType = e.target.value;
  if (selectedTreeType) {
    document.getElementById("areaInput").disabled = false;
    document.getElementById("sqMeterInput").disabled = false;
  } else {
    document.getElementById("areaInput").disabled = true;
    document.getElementById("sqMeterInput").disabled = true;
  }
});
function updateInputsBasedOnTree() {
  const selectedTreeType = treeDropdown.value;
  const selectedTree = trees.find((tree) => tree.name === selectedTreeType);

  if (selectedTree) {
    const areaInput = parseFloat(document.getElementById("areaInput").value);
    const sqMeterInput = parseFloat(
      document.getElementById("sqMeterInput").value
    );
    const areaPerTree = calculateArea(selectedTree.width, selectedTree.length);

    if (!isNaN(areaInput)) {
      // Calculate total area based on quantity entered
      document.getElementById("sqMeterInput").value = (
        (areaInput * areaPerTree) /
        10000
      ).toFixed(2);
    } else if (!isNaN(sqMeterInput)) {
      // Calculate quantity based on area entered
      document.getElementById("areaInput").value = Math.ceil(
        (sqMeterInput * 10000) / areaPerTree
      );
    }
  }
}

//CHART DISPLAY

// Get the context of the canvas
const ctx = document.getElementById("myBarChart").getContext("2d");

// Create a new bar chart
const myBarChart = new Chart(ctx, {
  type: "bar", // Specifies a bar chart
  data: {
    labels: ["seed1", "seed 2", "seed 3"], // X-axis labels
    datasets: [
      {
        label: "Mytop Requested Seeds", // Name of the dataset
        data: [12, 24, 65], // Data points
        backgroundColor: [
          "rgba(255, 255, 255, 1)",
          "rgba(255, 255, 255, 1)",
          "rgba(255, 255, 255, 1)",
        ],

        borderWidth: 1, // Width of the bar borders
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true, // Start y-axis from zero
      },
    },
  },
});
function openFileById(id) {
  // Construct the file path using the id
  const filePath = `${id}.html`; // e.g., if id is "page2", it will open "page2.html"

  window.open(filePath, "_self");
}
