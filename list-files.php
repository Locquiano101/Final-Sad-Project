<?php
header('Content-Type: application/json');

// Directory where files are stored
$storageDir = __DIR__ . DIRECTORY_SEPARATOR . `uploads/Brian_Joshua_V___Gania/documents/`;


if (!is_dir($storageDir)) {
    echo json_encode(['status' => 'error', 'message' => 'Storage directory not found']);
    exit;
}

$files = array_diff(scandir($storageDir), ['.', '..']);
echo json_encode(['status' => 'success', 'files' => array_values($files)]);
