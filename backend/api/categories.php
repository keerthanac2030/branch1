<?php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$user_id = $_GET['user_id'] ?? $_POST['user_id'] ?? null;

if (!$user_id) {
    sendResponse(['error' => 'User ID required'], 400);
}

if ($method === 'GET') {
    $stmt = $conn->prepare('SELECT * FROM categories WHERE user_id = ? ORDER BY name');
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $categories = $result->fetch_all(MYSQLI_ASSOC);

    sendResponse($categories);

} elseif ($method === 'POST') {
    $data = getRequestData();
    $name = $data['name'];
    $color = $data['color'] ?? '#667eea';
    $icon = $data['icon'] ?? '📁';

    $stmt = $conn->prepare('INSERT INTO categories (user_id, name, color, icon) VALUES (?, ?, ?, ?)');
    $stmt->bind_param('isss', $user_id, $name, $color, $icon);

    if ($stmt->execute()) {
        sendResponse(['success' => true, 'id' => $conn->insert_id]);
    }
    sendResponse(['error' => 'Failed to create category'], 400);

} elseif ($method === 'PUT') {
    $data = getRequestData();
    $id = $data['id'];
    $name = $data['name'] ?? null;
    $color = $data['color'] ?? null;

    $updates = [];
    $types = '';
    $values = [];

    if ($name !== null) {
        $updates[] = 'name = ?';
        $types .= 's';
        $values[] = $name;
    }
    if ($color !== null) {
        $updates[] = 'color = ?';
        $types .= 's';
        $values[] = $color;
    }

    if (empty($updates)) {
        sendResponse(['error' => 'No fields to update'], 400);
    }

    $values[] = $id;
    $values[] = $user_id;
    $types .= 'ii';

    $query = 'UPDATE categories SET ' . implode(', ', $updates) . ' WHERE id = ? AND user_id = ?';
    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$values);

    if ($stmt->execute()) {
        sendResponse(['success' => true]);
    }
    sendResponse(['error' => 'Failed to update category'], 400);

} elseif ($method === 'DELETE') {
    $data = getRequestData();
    $id = $data['id'];

    $stmt = $conn->prepare('DELETE FROM categories WHERE id = ? AND user_id = ?');
    $stmt->bind_param('ii', $id, $user_id);

    if ($stmt->execute()) {
        sendResponse(['success' => true]);
    }
    sendResponse(['error' => 'Failed to delete category'], 400);
}

sendResponse(['error' => 'Invalid request'], 400);
?>
