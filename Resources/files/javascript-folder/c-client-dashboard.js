const dataArray = [
  { id: 1, name: "Alice", age: 23 },
  { id: 2, name: "Bob", age: 30 },
  { id: 3, name: "Charlie", age: 28 },
];

// Function to append array data to the table
function appendDataToTable(array) {
  const tableBody = document
    .getElementById("data-table")
    .getElementsByTagName("tbody")[0];

  // Clear existing rows
  tableBody.innerHTML = "";

  array.forEach((item) => {
    // Create a new row
    const row = document.createElement("tr");

    // Insert data cells
    for (const key in item) {
      const cell = document.createElement("td");
      cell.textContent = item[key];
      row.appendChild(cell);
    }

    // Create action cell for Edit and Delete buttons
    const actionCell = document.createElement("td");

    // Create Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("button", "delete-button");
    deleteButton.onclick = () => deleteRow(item.id); // Call delete function
    actionCell.appendChild(deleteButton);

    // Append action cell to the row
    row.appendChild(actionCell);

    // Append the row to the table body
    tableBody.appendChild(row);
  });
}

// Function to handle edit button click
function editRow(id) {
  alert("Edit row with ID: " + id);
  // Implement edit functionality here
}

// Function to handle delete button click
function deleteRow(id) {
  const confirmed = confirm("Are you sure you want to delete this row?");
  if (confirmed) {
    // Remove the item with the given id from the array
    const index = dataArray.findIndex((item) => item.id === id);
    if (index !== -1) {
      dataArray.splice(index, 1);
      appendDataToTable(dataArray); // Refresh the table
    }
  }
}

// Initial table load
appendDataToTable(dataArray);
function searchData() {
  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase();

  // Filter the data array based on the search term
  const filteredData = dataArray.filter((item) =>
    item.name.toLowerCase().includes(searchTerm)
  );

  // Append filtered data to the table
  appendDataToTable(filteredData);
}
