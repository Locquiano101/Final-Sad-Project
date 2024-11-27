<?php
header("Access-Control-Allow-Origin: *"); // Allow requests from all origins
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Allow POST and OPTIONS methods
header("Access-Control-Allow-Headers: Content-Type"); // Allow Content-Type header
header("Access-Control-Max-Age: 86400"); // Cache preflight requests for 24 hours

$allowedOrigins = ['https://srv1631-files.hstgr.io/721e9ce6a13b7e64/files/public_html/client-dashboard/upload.php'];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Max-Age: 86400");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
// Check if POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['file']) && isset($_POST['requestorName'])) {
        $requestorName = preg_replace("/[^a-zA-Z0-9_]/", "_", $_POST['requestorName']); // Sanitize input
        $uploadDir = __DIR__ . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . 'documents';

        // Create directory if it doesn't exist
        if (!is_dir($uploadDir)) {
            if (!mkdir($uploadDir, 0777, true)) {
                echo json_encode(["status" => "error", "message" => "Failed to create directory: $uploadDir"]);
                exit;
            }
        }

        $fileName = $_FILES['file']['name'];
        $fileName = preg_replace("/[^a-zA-Z0-9_\-\.]/", "_", $fileName); // Sanitize file name
        $targetFile = $uploadDir . DIRECTORY_SEPARATOR . $fileName;

        // Increment filename if already exists
        $increment = 1;
        $fileInfo = pathinfo($fileName);
        while (file_exists($targetFile)) {
            $fileName = $fileInfo['filename'] . "($increment)." . $fileInfo['extension'];
            $targetFile = $uploadDir . DIRECTORY_SEPARATOR . $fileName;
            $increment++;
        }

        // Move the uploaded file
        if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFile)) {
            echo json_encode(["status" => "success", "message" => "File uploaded successfully!", "file" => $fileName]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error moving uploaded file."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid input: No file or requestor name provided."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method. Use POST."]);
}
