let currentSlide = 0;
const slideshow = document.getElementById("slideshow");
const slides = document.querySelectorAll(".slide");
const totalSlides = slides.length;

// Clone the first slide and append it to the end
const firstSlideClone = slides[0].cloneNode(true);
slideshow.appendChild(firstSlideClone);

// Function to move the slides
function moveSlide() {
  currentSlide++;

  slideshow.style.transition = "transform 0.5s ease"; // Enable transition for sliding effect
  slideshow.style.transform = `translateX(-${currentSlide * 100}%)`;

  // If we've reached the end (the clone), reset to the real first slide without animation
  if (currentSlide === totalSlides) {
    setTimeout(() => {
      slideshow.style.transition = "none"; // Disable transition to avoid visual jump
      slideshow.style.transform = `translateX(0)`; // Jump back to the first real slide
      currentSlide = 0;
    }, 500); // Wait for the transition to finish (500ms)
  }
}

// Auto slide every 3 seconds
setInterval(() => {
  moveSlide();
}, 3000);

/*
 *************** SCROLLING ANIMATION ***************
 */
document.querySelectorAll(".sticky-nav a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetID = this.getAttribute("href");
    const targetSection = document.querySelector(targetID);
    const targetPosition = targetSection.offsetTop;

    slowScrollTo(targetPosition, 500); // 500ms = 0.5 seconds
  });
});

function slowScrollTo(targetPosition, duration) {
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);

    window.scrollTo(0, run);

    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }

  requestAnimationFrame(animation);
}

// Add 'active' class to clicked navigation links
const links = document.querySelectorAll(".nav-link");

links.forEach((link) => {
  link.addEventListener("click", function () {
    // Remove 'active' class from all links
    links.forEach((link) => link.classList.remove("active"));

    // Add 'active' class to the clicked link
    this.classList.add("active");
  });
});

// Change background color of the navigation bar on scroll
window.addEventListener("scroll", function () {
  const navbar = document.getElementById("navbar");

  // Check scroll position
  if (window.scrollY > 50) {
    // Add a class to change background color and add a smooth transition effect
    navbar.style.backgroundColor = "#4e7966"; // New background color
    navbar.style.transition =
      "background-color 0.5s ease, box-shadow 0.5s ease"; // Smooth effect
    navbar.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)"; // Adding a shadow for extra effect
  } else {
    // Revert the background to transparent and remove shadow
    navbar.style.backgroundColor = "transparent"; // Original background
    navbar.style.boxShadow = "none"; // No shadow
  }
});

function openFileById(id) {
  // Construct the file path using the id
  const filePath = `${id}.html`; // e.g., if id is "page2", it will open "page2.html"

  window.open(filePath, "_self");
}
