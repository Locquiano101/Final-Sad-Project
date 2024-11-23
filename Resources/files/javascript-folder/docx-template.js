import {
  userName,
  userEmail,
  userContactNumber,
  houseNumber,
  purok,
  barangay,
  municipality,
  province,
  postalCode,
  fetchUserData,
} from "./firebase-variables.js";

const userID = localStorage.getItem("userID");

const privateRadio = document.getElementById("private");
const publicRadio = document.getElementById("public");
const privateSection = document.getElementById("privateSection");

const togglePrivateSection = () => {
  privateSection.classList.toggle("hidden", !privateRadio.checked);
};
privateRadio.addEventListener("change", togglePrivateSection);
publicRadio.addEventListener("change", togglePrivateSection);

let user, userNum, address;
fetchUserData(userID).then(() => {
  console.log("User data retrieved successfully.");
  user = userName;
  userNum = userContactNumber;
  address = [houseNumber, purok, barangay, municipality, province, postalCode]
    .filter(Boolean) // Filters out any falsy values (null, undefined, empty strings)
    .join(", ");
});

const documentData = {
  Document_Title: "Seedling Request Form", // Title of the document
  Condition: "Pending Approval", // Default condition/status of the document
};
const trees = [
  // Non-Fruit-Bearing Trees
  {
    value: "Mahogany",
    typeOfTree: "not fruit-bearing Tree",
    width: 3,
    length: 4,
  },
  {
    value: "Narra",
    typeOfTree: "not fruit-bearing Tree",
    width: 3,
    length: 4,
  },
  {
    value: "Kamagong",
    typeOfTree: "not fruit-bearing Tree",
    width: 3,
    length: 3,
  },
  {
    value: "Dancalan",
    typeOfTree: "not fruit-bearing Tree",
    width: 3,
    length: 3,
  },
  {
    value: "Makaasim",
    typeOfTree: "not fruit-bearing Tree",
    width: 3,
    length: 3,
  },
  {
    value: "Malapili",
    typeOfTree: "not fruit-bearing Tree",
    width: 3,
    length: 3,
  },
  {
    value: "Kulipapa",
    typeOfTree: "not fruit-bearing Tree",
    width: 3,
    length: 3,
  },
  {
    value: "Neem tree",
    typeOfTree: "not fruit-bearing Tree",
    width: 3,
    length: 4,
  },
  {
    value: "Bulala",
    typeOfTree: "not fruit-bearing Tree",
    width: 3,
    length: 3,
  },
  {
    value: "Lawaan",
    typeOfTree: "not fruit-bearing Tree",
    width: 2,
    length: 2,
  },
  {
    value: "Lubas",
    typeOfTree: "not fruit-bearing Tree",
    width: 3,
    length: 3,
  },
  {
    value: "Dao",
    typeOfTree: "not fruit-bearing Tree",
    width: 7,
    length: 7,
  },
  {
    value: "Manayaw",
    typeOfTree: "not fruit-bearing Tree",
    width: 10,
    length: 10,
  },
  {
    value: "Amugis",
    typeOfTree: "not fruit-bearing Tree",
    width: 3,
    length: 3,
  },

  // Fruit-Bearing Trees
  {
    value: "Cacao",
    typeOfTree: "fruit-bearing Tree",
    width: 3,
    length: 4,
  },
  {
    value: "Coffee",
    typeOfTree: "fruit-bearing Tree",
    width: 4,
    length: 4,
  },
  {
    value: "Maligang",
    typeOfTree: "fruit-bearing Tree",
    width: 4,
    length: 4,
  },
  {
    value: "Lukban",
    typeOfTree: "fruit-bearing Tree",
    width: 10,
    length: 10,
  },
  {
    value: "Marang",
    typeOfTree: "fruit-bearing Tree",
    width: 10,
    length: 10,
  },
  {
    value: "Pili",
    typeOfTree: "fruit-bearing Tree",
    width: 10,
    length: 10,
  },
  {
    value: "Sampalok",
    typeOfTree: "fruit-bearing Tree",
    width: 10,
    length: 10,
  },
  {
    value: "Kalamata",
    typeOfTree: "fruit-bearing Tree",
    width: 5,
    length: 5,
  },
  {
    value: "Bagras",
    typeOfTree: "fruit-bearing Tree",
    width: 4,
    length: 4,
  },
  {
    value: "Batuan",
    typeOfTree: "fruit-bearing Tree",
    width: 10,
    length: 10,
  },
];

const selectedtree = document.getElementById("selectedTreeType");
trees.forEach((tree) => {
  const option = document.createElement("option");
  option.value = tree.value;
  option.textContent = `(${tree.typeOfTree}) ${tree.value}`;
  selectedtree.appendChild(option);
});

async function sendDocument(userID, documentData) {
  try {
    const userDocRef = firebase.firestore().collection("users").doc(userID);
    const userDocumentsRef = userDocRef.collection("userDocuments");

    // Retrieve all documents to determine the next sequential number
    const documentsSnapshot = await userDocumentsRef.get();
    const documentCount = documentsSnapshot.size; // Number of existing documents

    // Define the new document ID as the next sequential number
    const newDocumentID = (documentCount + 1).toString();

    await userDocumentsRef.doc(newDocumentID).set({
      ...documentData,
      submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    console.log("Document added successfully with ID:", newDocumentID);
    alert("Document sent successfully with ID: " + newDocumentID);
  } catch (error) {
    console.error("Error sending document:", error);
    alert("Error sending document: " + error.message);
  }
}

const readFileAsArrayBuffer = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });

document.getElementById("projectForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent form submission

  const submitButton = document.querySelector(
    "#projectForm button[type='submit']"
  );

  submitButton.disabled = true;
  submitButton.textContent = "Uploading...";

  try {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.toLocaleString("en-US", { month: "long" });
    const year = currentDate.getFullYear();
    const formattedDate = `of ${month} ${day}, ${year}`;

    const formData = new FormData(e.target);
    const projectLocation = formData.get("project-location");
    const landClassification = formData.get("land-classification");
    const propertyDocument = formData.get("property-document");
    const titleNo = formData.get("title-no");
    const taxDeclaration = formData.get("tax-declaration");
    const activityType = formData.get("activity-type");
    const vicinityMap = formData.get("vicinity-map");
    const seedlingsNumber = formData.get("seedlings-number");
    const seedlingsType = selectedtree.value;
    const requestorSignature = formData.get("requestor-signature");

    const isPublicLand = landClassification === "Public";
    const privateFields = {
      propertyDocument: isPublicLand ? null : propertyDocument,
      titleNo: isPublicLand ? null : titleNo,
      taxDeclaration: isPublicLand ? null : taxDeclaration,
    };

    const documentDetails = {
      ...documentData,
      Project_Location: projectLocation || "Not specified",
      Land_Classification: landClassification || "Not specified",
      Activity_Type: activityType || "Not specified",
      Seedlings_Number: seedlingsNumber || 0,
      Seedlings_Type: seedlingsType || "Not specified",
      ...privateFields,
    };

    if (!user) {
      alert("User information is missing. Please refresh and try again.");
      return;
    }

    await sendDocument(userID, documentDetails);

    alert("Form submitted successfully!");
    const requestorName = user;
    if (!requestorName) {
      alert("Please enter the requestor's name.");
      return;
    }

    const doc = new docx.Document({
      sections: [
        {
          properties: {},
          children: [
            // Recipient's Profile
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: "RECIPIENT’S PROFILE",
                  bold: true,
                  font: "Arial",
                  size: 24, // Font size is set in half-points, so 24 means 16pt
                }),
              ],
              spacing: { after: 150 },
              alignment: docx.AlignmentType.CENTER,
            }),
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: `Requestor's Name: ${user} \t\t\t TEL No. / CP # ${userNum}`,
                  font: "Arial",
                }),
              ],
              spacing: { after: 150 },
            }),
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: `ADDRESS: ${address}`,
                  font: "Arial",
                }),
              ],
              spacing: { after: 150 },
            }),

            // Project Profile
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: "PROJECT PROFILE",
                  bold: true,
                  size: 24, // Font size is set in half-points, so 24 means 16pt
                  font: "Arial",
                }),
              ],
              alignment: docx.AlignmentType.CENTER,
              spacing: { after: 150 },
            }),
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: `LOCATION PROJECT/PLANTING SITE : ${projectLocation}`,
                  font: "Arial",
                }),
              ],
              spacing: { after: 150 },
            }),
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: `LAND CLASSIFICATION OF THE PROPERTY: ${landClassification}`,
                  font: "Arial",
                }),
              ],
              spacing: { after: 150 },
            }),
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: `IF PRIVATE (Pls. attach Xerox copy)`,
                  font: "Arial",
                }),
              ],
              spacing: { after: 150 },
            }),
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: `TITLE NO: ____________\t\t\tTAX DECLARATION: ____________`,
                  font: "Arial",
                }),
              ],
              spacing: { after: 150 },
            }),
            new docx.Paragraph({
              spacing: { after: 150 },
              children: [
                new docx.TextRun({
                  text: `Purpose of the Activity:${activityType}`,
                  font: "Arial",
                }),
              ],
            }),
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: ` LOCATION / VICINITY MAP OF PLANTING SITE: `,
                  font: "Arial",
                }),
              ],
              spacing: { after: 150 },
            }),
            ...(vicinityMap
              ? [
                  new docx.Paragraph({
                    spacing: { after: 150 },
                    alignment: docx.AlignmentType.CENTER,
                    children: [
                      new docx.ImageRun({
                        data: vicinityMap,
                        transformation: { width: 500, height: 150 }, // Adjust dimensions as needed
                      }),
                    ],
                  }),
                ]
              : []),
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: `Total Number of Seeds: ${seedlingsNumber}\t\t\tSeedling Type: ${seedlingsType}`,
                  font: "Arial",
                }),
              ],
              spacing: { after: 150 },
            }),

            // Promissory Note
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: "PROMISSORY NOTE",
                  bold: true,
                  font: "Arial",
                  size: 24, // Font size is set in half-points, so 24 means 16pt
                }),
              ],
              spacing: { after: 150 },
              alignment: docx.AlignmentType.CENTER,
            }),
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: `I am aware that PG-PENRO staff will monitor the growth of the planted seedlings. I will maintain and protect said seedlings to ensure a 150% survival rate. Otherwise, I will pay for the seedlings that do not survive in the amount of THIRTY PESOS (P30.00 each).`,
                  font: "Arial",
                }),
              ],
              alignment: docx.AlignmentType.JUSTIFY,
              spacing: { after: 150 },
            }),
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: `\tI am signifying through this Promissory Note my interest and willingness to execute and abide by the above intentions.`,
                  font: "Arial",
                }),
              ],
              alignment: docx.AlignmentType.JUSTIFY,
              spacing: { after: 150 },
            }),
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: `\tSigned this ${formattedDate}`,
                  font: "Arial",
                }),
              ],
              spacing: { after: 150 },
            }),
            ...(requestorSignature
              ? [
                  new docx.Paragraph({
                    alignment: docx.AlignmentType.CENTER,
                    children: [
                      new docx.ImageRun({
                        data: requestorSignature,
                        transformation: { width: 150, height: 100 }, // Adjust dimensions as needed
                      }),
                    ],
                  }),
                ]
              : []),
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: `${user}`,
                  font: "Arial",
                }),
              ],
              alignment: docx.AlignmentType.CENTER,
              spacing: { after: 150 },
            }),
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: "(Name and Signature of the Requesting Person)",
                  font: "Arial",
                }),
              ],
              alignment: docx.AlignmentType.CENTER,
              spacing: { after: 300 },
            }),
            new docx.Paragraph({}),

            // Recommending Approval and Approved By
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: `Recommending Approval: \t\t\t\t\t APPROVED BY:`,
                  font: "Arial",
                }),
              ],
              spacing: { after: 150 },
              font: "Arial",
              size: 24,
            }),
            new docx.Paragraph({}),
            new docx.Paragraph({}),
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: `LEOPOLDO P. BADIOLA \t\t\t\t\t HON. RICARTE R. PADILLA`,
                  font: "Arial",
                }),
              ],
              spacing: { after: 150 },
              font: "Arial",
              size: 24,
            }),
            new docx.Paragraph({
              children: [
                new docx.TextRun({
                  text: `Prov’l Environmental and Natural Resources Officer \t\t Governor`,
                  font: "Arial",
                }),
              ],
              spacing: { after: 150 },
              font: "Arial",
              size: 24,
            }),
          ],
        },
      ],
    });

    // Generate file name in the format: documents/{user}__treeRequest.docx
    const sanitizedRequestorName = requestorName.replace(/[\/\\:*?"<>|]/g, "_");
    const fileName = `${sanitizedRequestorName}_${selectedtree}_request.docx`;

    // Convert the document to Blob
    docx.Packer.toBlob(doc).then((blob) => {
      const formData = new FormData();
      formData.append("file", blob, fileName); // Append the file with the correct name
      formData.append("requestorName", requestorName);

      fetch(
        "https://aliceblue-owl-540826.hostingersite.com//client-dashboard/upload.php",
        {
          method: "POST",
          body: formData,
          headers: {
            // No additional headers needed unless authentication is required
          },
          mode: "cors", // Enable CORS
          credentials: "omit", // Do not include credentials unless needed
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Network response was not ok: " + response.statusText
            );
          }
          return response.json();
        })
        .then((data) => {
          if (data.status === "success") {
            alert(data.message);
          } else {
            console.error("Upload failed:", data.message);
            alert("Error: " + data.message);
          }
        })
        .catch((error) => {
          console.error("Upload error:", error);
          alert("An error occurred: " + error.message);
        });
    });
  } catch (error) {
    console.error("Upload failed:", error);
    alert("An error occurred during file upload.");
  } finally {
    // Re-enable the button and reset text
    submitButton.disabled = false;
    submitButton.textContent = "Submit";
  }
});
