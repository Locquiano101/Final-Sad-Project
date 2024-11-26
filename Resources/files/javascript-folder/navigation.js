function openFileById(id) {
  // Construct the file path using the id
  const filePath = `${id}.html`; // e.g., if id is "page2", it will open "page2.html"

  window.open(filePath, "_self");
}
function logout() {
  alert("Are you sure?");
  localStorage.removeItem("userID");
  window.open("../../b-login.html", "_self"); // ".." goes one level up
}
