<?php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$user_id = $_GET['user_id'] ?? $_POST['user_id'] ?? null;

if (!$user_id) {
    sendResponse(['error' => 'User ID required'], 400);
}

if ($method === 'GET') {
    $stmt = $conn->prepare('SELECT * FROM notes WHERE user_id = ? ORDER BY is_pinned DESC, updated_at DESC');
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $notes = $result->fetch_all(MYSQLI_ASSOC);

    sendResponse($notes);

} elseif ($method === 'POST') {
    $data = getRequestData();
    $title = $data['title'];
    $content = $data['content'];
    $color = $data['color'] ?? '#fff59d';

    $stmt = $conn->prepare('INSERT INTO notes (user_id, title, content, color) VALUES (?, ?, ?, ?)');
    $stmt->bind_param('isss', $user_id, $title, $content, $color);

    if ($stmt->execute()) {
        sendResponse(['success' => true, 'id' => $conn->insert_id]);
    }
    sendResponse(['error' => 'Failed to create note'], 400);

} elseif ($method === 'PUT') {
    $data = getRequestData();
    $id = $data['id'];
    $title = $data['title'] ?? null;
    $content = $data['content'] ?? null;
    $color = $data['color'] ?? null;
    $is_pinned = $data['is_pinned'] ?? null;

    $updates = [];
    $types = '';
    $values = [];

    if ($title !== null) {
        $updates[] = 'title = ?';
        $types .= 's';
        $values[] = $title;
    }
    if ($content !== null) {
        $updates[] = 'content = ?';
        $types .= 's';
        $values[] = $content;
    }
    if ($color !== null) {
        $updates[] = 'color = ?';
        $types .= 's';
        $values[] = $color;
    }
    if ($is_pinned !== null) {
        $updates[] = 'is_pinned = ?';
        $types .= 'i';
        $values[] = $is_pinned;
    }

    $values[] = $id;
    $values[] = $user_id;
    $types .= 'ii';

    $query = 'UPDATE notes SET ' . implode(', ', $updates) . ' WHERE id = ? AND user_id = ?';
    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$values);

    if ($stmt->execute()) {
        sendResponse(['success' => true]);
    }
    sendResponse(['error' => 'Failed to update note'], 400);

} elseif ($method === 'DELETE') {
    $data = getRequestData();
    $id = $data['id'];

    $stmt = $conn->prepare('DELETE FROM notes WHERE id = ? AND user_id = ?');
    $stmt->bind_param('ii', $id, $user_id);

    if ($stmt->execute()) {
        sendResponse(['success' => true]);
    }
    sendResponse(['error' => 'Failed to delete note'], 400);
}

sendResponse(['error' => 'Invalid request'], 400);
?>
