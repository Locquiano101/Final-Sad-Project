function openFileById(id) {
  // Construct the file path using the id
  const filePath = `${id}.html`; // e.g., if id is "page2", it will open "page2.html"

  window.open(filePath, "_self");
}
