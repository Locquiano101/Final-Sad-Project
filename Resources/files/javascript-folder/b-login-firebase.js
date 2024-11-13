// FIREBASE
import {
  firebaseAuth,
  firebaseDB,
  userDocRef,
  userDocumentsRef,
} from "/Resources/files/javascript-folder/firebase-variables.js";
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

// SIGN UP SHIT
document.getElementById("creatNewUser").onclick = async function () {
  // USER NAME INFO
  const fname = document.getElementById("userFname").value;
  const lname = document.getElementById("userLname").value;
  const mI = document.getElementById("userMname").value;
  const suffix = document.getElementById("userSname").value;

  let fullName = fname;
  if (mI) {
    fullName += ` ${mI}.`;
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

let userID;
// Function to add a document to the user’s sub-collection
async function sendDocument(userID, documentData) {
  try {
    // Add a new document to the user's `userDocuments` sub-collection
    const userDocRef = firebase.firestore().collection("users").doc(userID);
    const userDocumentsRef = userDocRef.collection("userDocuments");

    await userDocumentsRef.add({
      documentData,
      submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    console.log("Document added successfully!");
    alert("Document sent successfully!");
  } catch (error) {
    console.error("Error sending document:", error);
    alert("Error sending document: " + error.message);
  }
}
