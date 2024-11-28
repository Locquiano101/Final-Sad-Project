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
const firebaseDB = firebase.firestore();

document
  .getElementById("inventoryOverviewReport")
  .addEventListener("click", async () => {
    try {
      const querySnapshot = await firebaseDB
        .collection("trees")
        .orderBy("request", "desc")
        .get();

      const topSeeds = querySnapshot.docs.map((doc) => doc.data());

      const doc = new docx.Document({
        sections: [
          {
            properties: {},
            children: [
              new docx.Paragraph({
                children: [
                  new docx.TextRun({
                    text: "Top Requested Seeds",
                    bold: true,
                    size: 32,
                  }),
                ],
                alignment: docx.AlignmentType.CENTER,
                spacing: { after: 300 },
              }),
              new docx.Table({
                rows: [
                  // Table Header
                  new docx.TableRow({
                    children: [
                      new docx.TableCell({
                        children: [
                          new docx.Paragraph({
                            children: [
                              new docx.TextRun({
                                text: "Rank",
                                bold: true,
                                size: 24,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new docx.TableCell({
                        children: [
                          new docx.Paragraph({
                            children: [
                              new docx.TextRun({
                                text: "Seed Name",
                                bold: true,
                                size: 24,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new docx.TableCell({
                        children: [
                          new docx.Paragraph({
                            children: [
                              new docx.TextRun({
                                text: "Requested Times",
                                bold: true,
                                size: 24,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new docx.TableCell({
                        children: [
                          new docx.Paragraph({
                            children: [
                              new docx.TextRun({
                                text: "Type of Tree",
                                bold: true,
                                size: 24,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new docx.TableCell({
                        children: [
                          new docx.Paragraph({
                            children: [
                              new docx.TextRun({
                                text: "Quantity",
                                bold: true,
                                size: 24,
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  // Table Rows for Seeds
                  ...topSeeds.map(
                    (seed, index) =>
                      new docx.TableRow({
                        children: [
                          new docx.TableCell({
                            children: [
                              new docx.Paragraph({
                                children: [
                                  new docx.TextRun({
                                    text: `${index + 1}`,
                                    size: 24,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          new docx.TableCell({
                            children: [
                              new docx.Paragraph({
                                children: [
                                  new docx.TextRun({
                                    text: seed.name,
                                    size: 24,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          new docx.TableCell({
                            children: [
                              new docx.Paragraph({
                                children: [
                                  new docx.TextRun({
                                    text: `${seed.request}`,
                                    size: 24,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          new docx.TableCell({
                            children: [
                              new docx.Paragraph({
                                children: [
                                  new docx.TextRun({
                                    text: seed.typeOfTree,
                                    size: 24,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          new docx.TableCell({
                            children: [
                              new docx.Paragraph({
                                children: [
                                  new docx.TextRun({
                                    text: seed.quantity,
                                    size: 24,
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      })
                  ),
                ],
              }),
            ],
          },
        ],
      });
      const blob = await docx.Packer.toBlob(doc);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Top_Seeds_Report.docx";
      link.click();
    } catch (error) {
      console.error("Error generating report:", error);
    }
  });
document
  .getElementById("generateStatusReport")
  .addEventListener("click", async () => {
    try {
      // Fetch all users
      const usersSnapshot = await firebaseDB.collection("users").get();
      const requests = [];

      // Loop through each user and fetch their documents
      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const documentsSnapshot = await firebaseDB
          .collection(`users/${userId}/Documents`)
          .get();

        documentsSnapshot.forEach((doc) => {
          const data = doc.data();
          requests.push({
            activityType: data.activityType || "No Activity Type",
            address: data.address || "Unknown Address",
            fileName: data.fileName || "No File Name",
            formattedDate: data.formattedDate || "No Date",
            landClassification: data.landClassification || "No Classification",
            notes: data.notes || "No Notes",
            projectLocation: data.projectLocation || "No Location",
            seedlingsNumber: data.seedlingsNumber || "0",
            seedlingsType: data.seedlingsType || "Unknown Type",
            status: data.status || "No Status",
            user: data.user || "Unknown User",
            userNum: data.userNum || "No Contact",
          });
        });
      }

      // Create a document
      const doc = new docx.Document({
        sections: [
          {
            properties: {},
            children: [
              new docx.Paragraph({
                children: [
                  new docx.TextRun({
                    text: "Requests Overview",
                    bold: true,
                    size: 32,
                  }),
                ],
                alignment: docx.AlignmentType.CENTER,
                spacing: { after: 300 },
              }),
              ...requests.map(
                (request, index) =>
                  new docx.Paragraph({
                    children: [
                      new docx.TextRun({
                        text: `Request ${index + 1}:\n`,
                        bold: true,
                      }),
                      new docx.TextRun({
                        text: `User: ${request.user}\nContact: ${request.userNum}\nActivity Type: ${request.activityType}\nAddress: ${request.address}\nFile Name: ${request.fileName}\nDate: ${request.formattedDate}\nLand Classification: ${request.landClassification}\nNotes: ${request.notes}\nProject Location: ${request.projectLocation}\nSeedlings Type: ${request.seedlingsType}\nSeedlings Number: ${request.seedlingsNumber}\nStatus: ${request.status}`,
                      }),
                    ],
                    spacing: { after: 200 },
                  })
              ),
            ],
          },
        ],
      });

      // Generate the .docx file
      const blob = await docx.Packer.toBlob(doc);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "Requests_Status_Report.docx";
      link.click();
    } catch (error) {
      console.error("Error generating status report:", error);
    }
  });
