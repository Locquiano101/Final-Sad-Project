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
const firebaseAuth = firebase.auth();
const firebaseDB = firebase.firestore();

const userFirebase = firebaseDB.collection("Users");
const adminCloudBase = firebaseDB.collection("Admin");

// Get the modal
var popup = document.getElementById("popup");
// Get the link that opens the modal
var link = document.getElementById("openPopup");
// Get the <span> element that closes the modal
var span = document.getElementById("closePopup");

var loginHeader, adminRank;
//when an admin logs in
function showSection(sectionId, buttonId) {
  const sectionToShow = document.getElementById(sectionId);
  sectionToShow.scrollIntoView();

  // Change the header based on the buttonId
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

// When the user clicks the link, open the modal and prevent default behavior
link.onclick = function (event) {
  event.preventDefault(); // Prevent the default anchor behavior
  popup.style.display = "block";
};
window.onclick = function (event) {
  if (event.target == popup) {
    popup.style.display = "none";
  }
};
function loginAdmin(adminRank, inputUsername, inputPassword) {
  adminCloudBase
    .get()
    .then((snapshot) => {
      let foundAdmin = false;

      snapshot.forEach((doc) => {
        const data = doc.data();

        // Log data for debugging
        console.log("Admin data:", data);

        // Check for required fields
        if (
          !data.adminPassword ||
          !data.adminLoginInfo ||
          !data.adminRank ||
          typeof inputUsername !== "string" ||
          typeof inputPassword !== "string" ||
          typeof adminRank !== "string"
        ) {
          console.warn("Incomplete or invalid admin data:", data);
          return; // Skip this admin
        }

        if (
          inputUsername.toLowerCase() === data.adminLoginInfo.toLowerCase() &&
          inputPassword === data.adminPassword &&
          adminRank.toLowerCase() === data.adminRank.toLowerCase()
        ) {
          foundAdmin = true;
          alert("Login successful!");

          // Redirect based on admin rank
          if (adminRank === "Governor") {
            window.open("admin-dashboard/dashboard.html", "_self");
          } else if (adminRank === "PENRO") {
            window.open("e-penro-dashboard.ht ml", "_self");
          } else if (adminRank === "Nursery") {
            window.open("f-nursery-dashboard.html", "_self");
          }
        }
      });

      if (!foundAdmin) {
        alert("Invalid username or password.");
      }
    })
    .catch((error) => {
      console.error("Error loading records:", error);
      alert("Error loading records: " + error.message);
    });
}
let userID;
document.getElementById("userLogin").onclick = async function () {
  const email = document.getElementById("userSignInEmail").value;
  const password = document.getElementById("userSignInPassword").value;

  if (!email || !password) {
    alert("Email and password are required.");
    return;
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const userID = userCredential.user.uid; // Get the user's unique ID
      console.log("User signed in:", userCredential.user);

      // Store userID in localStorage for access in another file
      localStorage.setItem("userID", userID);

      alert("User signed in successfully!");
      window.open("client-dashboard/dashboard.html", "_self"); // Redirect to dashboard
    })
    .catch((error) => {
      console.error("Error signing in:", error);
      if (error.code === "auth/wrong-password") {
        alert("Incorrect password. Please try again.");
      } else if (error.code === "auth/user-not-found") {
        alert("No user found with this email. Please check and try again.");
      } else if (error.code === "auth/invalid-email") {
        alert("Invalid email format. Please enter a valid email address.");
      } else {
        alert("Error signing in: " + error.message);
      }
    });
};
document.getElementById("creatNewUser").onclick = async function () {
  // USER NAME INFO
  const fname = document.getElementById("userFname").value;
  const lname = document.getElementById("userLname").value;
  const mI = document.getElementById("userMname").value;
  const suffix = document.getElementById("userSname").value;

  let fullName = fname;
  if (mI) {
    fullName += ` ${mI}`;
  }
  fullName += ` ${lname}`;
  if (suffix) {
    fullName += ` ${suffix}`;
  }

  // USER ADDRESS
  const province = document.getElementById("Province").value;
  const municipality = document.getElementById("municipality").value;
  const barangay = document.getElementById("barangay").value;
  const purok = document.getElementById("purok").value;
  const houseNumber = document.getElementById("housenNum").value;
  const postalCode = document.getElementById("postalCode").value;

  const address = {
    province,
    municipality,
    barangay,
    purok,
    houseNumber,
    postalCode,
  };

  // USER CONTACT INFO
  const email = document.getElementById("userEmailRegister").value;
  const phoneNum = document.getElementById("userContactNum").value;
  const password = document.getElementById("userPasswordRegister").value;
  const confirmPassword = document.getElementById("userConfirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const signInMethods = await firebase
      .auth()
      .fetchSignInMethodsForEmail(email);
    if (signInMethods.length > 0) {
      alert("Email is already in use!");
      return;
    }

    // Create user with email and password
    const userCredential = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    console.log("User registered:", user);

    // Add new record to Firestore with a sub-collection for user documents
    const userRef = firebase.firestore().collection("users").doc(user.uid);
    await userRef.set({
      name: fullName,
      email: email,
      contactNumber: phoneNum,
      address: address,
      Account_Created: firebase.firestore.FieldValue.serverTimestamp(),
    });

    console.log("User added successfully!");
    alert("User registered successfully!");
  } catch (error) {
    console.error("Error registering user:", error);
    alert("Error registering user: " + error.message);
  }
};
