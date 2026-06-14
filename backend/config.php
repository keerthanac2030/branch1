<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database Configuration
$db_host = getenv('DB_HOST') ?: 'localhost';
$db_user = getenv('DB_USER') ?: 'root';
$db_password = getenv('DB_PASSWORD') ?: '';
$db_name = getenv('DB_NAME') ?: 'todoapp';

// Create connection
$conn = new mysqli($db_host, $db_user, $db_password, $db_name);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
}

$conn->set_charset('utf8mb4');

// Helper function to get request data
function getRequestData() {
    $input = file_get_contents('php://input');
    return json_decode($input, true) ?? [];
}

// Helper function to send response
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit();
}

// Helper function to sanitize input
function sanitize($data) {
    if (is_array($data)) {
        return array_map('sanitize', $data);
    }
    return htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
}
?>
