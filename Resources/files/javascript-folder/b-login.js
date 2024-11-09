// Get the modal
var popup = document.getElementById("popup");
// Get the link that opens the modal
var link = document.getElementById("openPopup");
// Get the <span> element that closes the modal
var span = document.getElementById("closePopup");

// When the user clicks the link, open the modal and prevent default behavior
link.onclick = function (event) {
  event.preventDefault(); // Prevent the default anchor behavior
  popup.style.display = "block";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == popup) {
    popup.style.display = "none";
  }
};

// Function to show a specific section and hide others
function showSection(sectionId) {
  // Show and scroll to the selected section
  const sectionToShow = document.getElementById(sectionId);
  sectionToShow.scrollIntoView();
}
var loginHeader, adminRank;
//when an admin logs in
function showSection(sectionId, buttonId) {
  // Display the correct section
  const sectionToShow = document.getElementById(sectionId);
  sectionToShow.scrollIntoView();
  //change the header and get the ID for the admin
  loginHeader = document.getElementById("admin-login");
  switch (buttonId) {
    case "governor":
      loginHeader.textContent = "Governor Login";
      adminRank = "Governor";
      break;
    case "penro":
      loginHeader.textContent = "PENRO Login";
      adminRank = "PENRO";
      break;
    case "nursery":
      loginHeader.textContent = "Nursery Login";
      adminRank = "Nursery";
      break;
    default:
      loginHeader.textContent = "Administrator Login";
  }
  console.log(adminRank);
}
