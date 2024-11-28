document.addEventListener("click", async (event) => {
  if (event.target.matches("#approve, #decline")) {
    const button = event.target;
    const condition =
      button.id === "approve" ? "Ready for Pick Up" : "Declined";
    const noteField = document.querySelector("textarea#Note");
    const note = noteField ? noteField.value : "";

    try {
      const userDocRef = firebaseDB.collection("users").doc(userID);
      const userDocSnapshot = await userDocRef.get();

      if (!userDocSnapshot.exists) {
        throw new Error("User not found");
      }

      const userData = userDocSnapshot.data();
      const userEmail = userData.email || "No Name";

      const userDocumentsRef = userDocRef.collection("Documents").doc(docID);
      const documentSnapshot = await userDocumentsRef.get();

      if (!documentSnapshot.exists) {
        throw new Error("Document not found");
      }

      emailjs.init("CHysrc6RIJb6U2SkY"); // Replace with your actual EmailJS public key

      // Send email notification
      const emailResponse = await emailjs.send(
        "service_rihrhh4",
        "template_4fh1w57",
        {
          Seedling: seedlingsType,
          seedling_quantity: seedlingsNumber,
          Note: note,
          user_name: userEmail,
          Condition: condition,
          user_email: userEmail,
        }
      );

      console.log(
        "Email sent successfully:",
        emailResponse.status,
        emailResponse.text
      );

      // Prepare notification details
      const notificationDetails = {
        title: `Request ${condition}`,
        message: `Your request titled "${fileName}" has been ${condition}.`,
        note: note || "No additional notes provided.",
        condition: condition,
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
        emailStatus: "Sent", // Track email status
      };

      // Store notification using the document title as the ID
      await firebaseDB
        .collection("users")
        .doc(userID)
        .collection("Notifications")
        .doc(fileName)
        .set(notificationDetails);

      // Update document status in Firestore
      await userDocumentsRef.update({
        status: condition,
        notes: note,
      });

      // Now populate and display the popup with the relevant information
      document.getElementById("idNum").textContent = docID; // Set the document ID
      document.getElementById("detailsPopUp").textContent = condition; // Set the request condition (Approved/Declined)

      function showPopup() 
    } catch (error) {
      console.error("Error processing request:", error);
    }
  }
});
