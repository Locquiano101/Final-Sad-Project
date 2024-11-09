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

//cloud firestore DATABASES
const userFirebase = firebaseDB.collection("Users");
const adminCloudBase = firebaseDB.collection("Admin");
function loginAdmin(adminRank, inputUsername, inputPassword) {
  // Reference to the Firestore collection for admin credentials
  adminCloudBase
    .get()
    .then((snapshot) => {
      let foundAdmin = false;

      // Loop through each document in the snapshot
      snapshot.forEach((doc) => {
        const data = doc.data();

        // Convert adminRank to lowercase for a case-insensitive comparison
        if (
          data.adminPassword &&
          data.adminLoginInfo &&
          data.adminRank &&
          inputUsername.toLowerCase() === data.adminLoginInfo.toLowerCase() &&
          inputPassword === data.adminPassword &&
          adminRank.toLowerCase() === data.adminRank.toLowerCase()
        ) {
          foundAdmin = true;
          alert("Login successful!");

          // Redirect to the appropriate dashboard based on admin rank
          if (adminRank === "Governor") {
            window.open("d-gov-dashboard.html", "_self");
          } else if (adminRank === "PENRO") {
            window.open("e-penro-dashboard.html", "_self");
          } else if (adminRank === "Nursery") {
            window.open("f-nursery-dashboard.html", "_self");
          }
        }
      });

      // If no matching admin credentials were found, display an error
      if (!foundAdmin) {
        alert("Invalid username or password.");
      }
    })
    .catch((error) => {
      console.error("Error loading records:", error);
      alert("Error loading records: " + error.message);
    });
}
function userLogin() {
  const email = document.getElementById("userSignInEmail").value;
  const password = document.getElementById("userSignInPassword").value;

  firebaseAuth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log("User signed in:", userCredential.user);
      alert("User signed in successfully!");
      window.open("database.html", "_self");
    })
    .catch((error) => {
      console.error("Error signing in:", error);
      alert("Error signing in: " + error.message);
    });
}
