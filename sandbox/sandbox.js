function showContent(contentId) {
  // Hide all content divs
  const contentDivs = document.querySelectorAll(".content-div");
  contentDivs.forEach((div) => div.classList.remove("active"));

  // Show the clicked content div
  const activeDiv = document.getElementById(contentId);
  if (activeDiv) {
    activeDiv.classList.add("active");
  }
}
