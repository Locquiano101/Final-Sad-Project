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

// Mock data for demonstration purposes. Replace with actual user data.
// Fetch user data and log it
let user, userNum, address;
fetchUserData(userID).then(() => {
  console.log("USER DATA RETREIVED SUCCESFULLY");
  user = userName;
  userNum = userContactNumber;
  address = [houseNumber, purok, barangay, municipality, province, postalCode]
    .filter(Boolean) // Filters out any falsy values (null, undefined, empty strings)
    .join(", ");
  console.log(userName);
});

const privateRadio = document.getElementById("private");
const publicRadio = document.getElementById("public");
const privateSection = document.getElementById("privateSection");

const togglePrivateSection = () => {
  privateSection.classList.toggle("hidden", !privateRadio.checked);
};
privateRadio.addEventListener("change", togglePrivateSection);
publicRadio.addEventListener("change", togglePrivateSection);

document.getElementById("projectForm").addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent form submission

  // Get the current date
  const currentDate = new Date();

  // Get parts of the date
  const day = currentDate.getDate();
  const month = currentDate.toLocaleString("en-US", { month: "long" });
  const year = currentDate.getFullYear();

  // Format the date
  const formattedDate = `${day} day of ${month}, 20${year
    .toString()
    .slice(-2)}.`;
  // Retrieve form data
  const formData = new FormData(e.target);

  const projectLocation = formData.get("project-location");
  const landClassification = formData.get("land-classification");
  const propertyDocument = formData.get("property-document"); // File input
  const titleNo = formData.get("title-no");
  const taxDeclaration = formData.get("tax-declaration");
  const activityType = formData.get("activity-type");
  const vicinityMap = formData.get("vicinity-map"); // File input
  const seedlingsNumber = formData.get("seedlings-number");
  const seedlingsType = formData.get("seedlings-type");
  const requestorSignature = formData.get("requestor-signature"); // File input

  // Make private fields null if land is public
  const isPublicLand = landClassification === "Public";
  const privateFields = {
    propertyDocument: isPublicLand ? null : propertyDocument,
    titleNo: isPublicLand ? null : titleNo,
    taxDeclaration: isPublicLand ? null : taxDeclaration,
  };

  // Consolidated form data
  const formValues = {
    projectLocation,
    landClassification,
    ...privateFields,
    activityType,
    vicinityMap,
    seedlingsNumber,
    seedlingsType,
    requestorSignature,
  };
  const requestorName = user;
  const requestorsNumber = userNum;
  const requestorAddress = address;
  if (!requestorName) {
    alert("Please enter the requestor's name.");
    return;
  }

  // Create Word document
  const doc = new docx.Document({
    sections: [
      {
        properties: {},
        children: [
          // Recipient's Profile
          new docx.Paragraph({
            text: "RECIPIENT’S PROFILE",
            heading: docx.HeadingLevel.HEADING_1,
            alignment: docx.AlignmentType.CENTER,
          }),
          new docx.Paragraph({
            text: `NAME OF REQUESTING PERSON: ${requestorName} \t\t\t TEL.No/CPNo. ${requestorsNumber}`,
          }),
          new docx.Paragraph({
            text: `ADDRESS: ${address}`,
          }),

          // Project Profile
          new docx.Paragraph({
            text: "PROJECT PROFILE",
            heading: docx.HeadingLevel.HEADING_1,
            alignment: docx.AlignmentType.CENTER,
          }),
          new docx.Paragraph({
            text: `LOCATION PROJECT/PLANTING SITE : ${projectLocation} `,
          }),

          new docx.Paragraph({
            text: `LAND CLASSIFICATION OF THE PROPERTY:  ${landClassification} `,
          }),
          new docx.Paragraph({
            text: `IF PRIVATE (Pls. attached Xerox copy )`,
          }),
          new docx.Paragraph({
            text: `TITLE NO:        ____________`,
          }),
          new docx.Paragraph({
            text: `TAX DECLARATION: ____________`,
          }),
          new docx.Paragraph({
            text: `PURPOSE / TYPE OF ACTIVITY: \n\t${activityType} `,
          }),
          new docx.Paragraph({
            text: `LOCATION / VICINITY MAP OF PLANTING SITE:  ${vicinityMap} `,
          }),
          new docx.Paragraph({
            text: `NO. OF SEEDLINGS REQUESTED:  ${seedlingsNumber}\t\t\t TYPE OF SEEDLINGS:  ${seedlingsType} `,
          }),

          // Promissory Note
          new docx.Paragraph({
            text: "PROMISSORY NOTE",
            heading: docx.HeadingLevel.HEADING_1,
            alignment: docx.AlignmentType.CENTER,
          }),
          new docx.Paragraph({
            text: `I am aware that PG-PENRO staff will monitor the growth of the planted seedlings. 
            I will maintain and protect said seedlings to ensure a 100% survival rate. Otherwise, 
            I will pay for the seedlings that do not survive in the amount of THIRTY PESOS (P30.00 each).`,
          }),
          new docx.Paragraph({
            text: `I am signifying through this Promissory Note my interest and willingness to execute and abide by the above intentions.`,
          }),
          new docx.Paragraph({
            text: `Signed this ${formattedDate} `,
          }),
          new docx.Paragraph({
            alignment: docx.AlignmentType.CENTER,
            text: `${requestorName}`,
          }),
          new docx.Paragraph({
            alignment: docx.AlignmentType.CENTER,
            text: "(Name and Signature of the Requesting Person)",
          }),

          // Recommending Approval and Approved By
          new docx.Paragraph({
            text: `Recommending Approval:`,
          }),
          new docx.Paragraph({
            text: `APPROVED BY:`,
          }),
          new docx.Paragraph({
            text: `LEOPOLDO P. BADIOLA\nProv’l Environmental and Natural Resources Officer`,
          }),
          new docx.Paragraph({
            text: `HON. RICARTE R. PADILLA\nGovernor`,
          }),
        ],
        font: "Arial", // Set font for entire paragraph
      },
    ],
  });

  // Generate file name in the format: documents/{user}__treeRequest.docx
  const fileName = `${requestorName}__treeRequest.docx`;

  // Convert the document to Blob
  docx.Packer.toBlob(doc).then((blob) => {
    const formData = new FormData();
    formData.append("file", blob, fileName); // Append the file with the correct name
    formData.append("requestorName", requestorName);

    // Debugging fetch request
    fetch("upload.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text()) // Get response as text
      .then((text) => {
        // Directly display the uploaded message
        if (text.includes("uploaded")) {
          // Check if the text includes 'uploaded'
          alert(text);
        } else {
          console.error("Server response:", text);
          alert("Error: " + text);
        }
      })
      .catch((error) => {
        console.error("Upload failed:", error);
        alert("An error occurred during file upload.");
      });
  });
});
