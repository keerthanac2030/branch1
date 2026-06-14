<?php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$user_id = $_GET['user_id'] ?? $_POST['user_id'] ?? null;

if (!$user_id) {
    sendResponse(['error' => 'User ID required'], 400);
}

if ($method === 'GET') {
    $category_id = $_GET['category_id'] ?? null;
    $completed = $_GET['completed'] ?? null;

    $query = 'SELECT * FROM todos WHERE user_id = ?';
    $types = 'i';
    $params = [$user_id];

    if ($category_id) {
        $query .= ' AND category_id = ?';
        $types .= 'i';
        $params[] = $category_id;
    }

    if ($completed !== null) {
        $query .= ' AND completed = ?';
        $types .= 'i';
        $params[] = $completed;
    }

    $query .= ' ORDER BY created_at DESC';

    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();
    $result = $stmt->get_result();
    $todos = $result->fetch_all(MYSQLI_ASSOC);

    sendResponse($todos);

} elseif ($method === 'POST') {
    $data = getRequestData();
    $title = $data['title'];
    $description = $data['description'] ?? '';
    $category_id = $data['category_id'] ?? null;
    $priority = $data['priority'] ?? 'medium';
    $due_date = $data['due_date'] ?? null;

    $stmt = $conn->prepare('INSERT INTO todos (user_id, category_id, title, description, priority, due_date) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->bind_param('iissss', $user_id, $category_id, $title, $description, $priority, $due_date);

    if ($stmt->execute()) {
        sendResponse(['success' => true, 'id' => $conn->insert_id]);
    }
    sendResponse(['error' => 'Failed to create todo'], 400);

} elseif ($method === 'PUT') {
    $data = getRequestData();
    $id = $data['id'];
    $title = $data['title'] ?? null;
    $description = $data['description'] ?? null;
    $completed = $data['completed'] ?? null;
    $priority = $data['priority'] ?? null;
    $due_date = $data['due_date'] ?? null;

    $updates = [];
    $types = '';
    $values = [];

    if ($title !== null) {
        $updates[] = 'title = ?';
        $types .= 's';
        $values[] = $title;
    }
    if ($description !== null) {
        $updates[] = 'description = ?';
        $types .= 's';
        $values[] = $description;
    }
    if ($completed !== null) {
        $updates[] = 'completed = ?';
        $types .= 'i';
        $values[] = $completed;
    }
    if ($priority !== null) {
        $updates[] = 'priority = ?';
        $types .= 's';
        $values[] = $priority;
    }
    if ($due_date !== null) {
        $updates[] = 'due_date = ?';
        $types .= 's';
        $values[] = $due_date;
    }

    $values[] = $id;
    $values[] = $user_id;
    $types .= 'ii';

    $query = 'UPDATE todos SET ' . implode(', ', $updates) . ' WHERE id = ? AND user_id = ?';
    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$values);

    if ($stmt->execute()) {
        sendResponse(['success' => true]);
    }
    sendResponse(['error' => 'Failed to update todo'], 400);

} elseif ($method === 'DELETE') {
    $data = getRequestData();
    $id = $data['id'];

    $stmt = $conn->prepare('DELETE FROM todos WHERE id = ? AND user_id = ?');
    $stmt->bind_param('ii', $id, $user_id);

    if ($stmt->execute()) {
        sendResponse(['success' => true]);
    }
    sendResponse(['error' => 'Failed to delete todo'], 400);
}

sendResponse(['error' => 'Invalid request'], 400);
?>
