<?php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$user_id = $_GET['user_id'] ?? $_POST['user_id'] ?? null;

if (!$user_id) {
    sendResponse(['error' => 'User ID required'], 400);
}

if ($method === 'GET') {
    $stmt = $conn->prepare('SELECT * FROM settings WHERE user_id = ?');
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $settings = $result->fetch_assoc();

    sendResponse($settings ?: ['error' => 'Settings not found'], $settings ? 200 : 404);

} elseif ($method === 'PUT') {
    $data = getRequestData();
    $theme = $data['theme'] ?? null;
    $language = $data['language'] ?? null;
    $notifications_enabled = $data['notifications_enabled'] ?? null;
    $timezone = $data['timezone'] ?? null;
    $items_per_page = $data['items_per_page'] ?? null;

    $updates = [];
    $types = '';
    $values = [];

    if ($theme !== null) {
        $updates[] = 'theme = ?';
        $types .= 's';
        $values[] = $theme;
    }
    if ($language !== null) {
        $updates[] = 'language = ?';
        $types .= 's';
        $values[] = $language;
    }
    if ($notifications_enabled !== null) {
        $updates[] = 'notifications_enabled = ?';
        $types .= 'i';
        $values[] = $notifications_enabled;
    }
    if ($timezone !== null) {
        $updates[] = 'timezone = ?';
        $types .= 's';
        $values[] = $timezone;
    }
    if ($items_per_page !== null) {
        $updates[] = 'items_per_page = ?';
        $types .= 'i';
        $values[] = $items_per_page;
    }

    if (empty($updates)) {
        sendResponse(['error' => 'No fields to update'], 400);
    }

    $values[] = $user_id;
    $types .= 'i';

    $query = 'UPDATE settings SET ' . implode(', ', $updates) . ' WHERE user_id = ?';
    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$values);

    if ($stmt->execute()) {
        sendResponse(['success' => true]);
    }
    sendResponse(['error' => 'Failed to update settings'], 400);
}

sendResponse(['error' => 'Invalid request'], 400);
?>
