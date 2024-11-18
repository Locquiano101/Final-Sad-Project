<?php
// Database connection details
$host = "srv1631.hstgr.io"; // Replace with your actual host if not localhost
$user = "u376871621_Codey_Craftsy"; // Your database username
$pass = "g:V&&/]1B"; // Your database password
$name = "u376871621_Penro_db"; // Your database name

// Create a connection
$conn = new mysqli($host, $user, $pass, $name);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Close the connection
$conn->close();
