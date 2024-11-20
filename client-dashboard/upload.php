<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);


// Check if POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['file']) && isset($_POST['requestorName'])) {
        $requestorName = preg_replace("/[^a-zA-Z0-9_]/", "_", $_POST['requestorName']); // Sanitize input
        $uploadDir = __DIR__ . '\\uploads\\' . $requestorName . '\\documents';

        // Create directory if it doesn't exist
        if (!is_dir($uploadDir)) {
            if (!mkdir($uploadDir, 0777, true)) {
                echo json_encode(["status" => "error", "message" => "Failed to create directory: $uploadDir"]);
                exit;
            }
        }

        $fileName = $_FILES['file']['name'];
        $targetFile = $uploadDir . $fileName;

        // Increment filename if already exists
        $increment = 1;
        $fileInfo = pathinfo($fileName);
        while (file_exists($targetFile)) {
            $fileName = $fileInfo['filename'] . "($increment)." . $fileInfo['extension'];
            $targetFile = $uploadDir . $fileName;
            $increment++;
        }

        // Move the uploaded file
        if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFile)) {
            echo json_encode(["status" => "success", "message" => "File uploaded successfully!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error moving uploaded file."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid input: No file or requestor name provided."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method. Use POST."]);
}
