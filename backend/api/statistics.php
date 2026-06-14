<?php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$user_id = $_GET['user_id'] ?? $_POST['user_id'] ?? null;

if (!$user_id) {
    sendResponse(['error' => 'User ID required'], 400);
}

if ($method === 'GET') {
    // Get todos stats
    $stmt = $conn->prepare('SELECT COUNT(*) as total, SUM(completed) as completed FROM todos WHERE user_id = ?');
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $todos_result = $stmt->get_result()->fetch_assoc();

    // Get categories count
    $stmt = $conn->prepare('SELECT COUNT(*) as count FROM categories WHERE user_id = ?');
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $categories_result = $stmt->get_result()->fetch_assoc();

    // Get notes count
    $stmt = $conn->prepare('SELECT COUNT(*) as count FROM notes WHERE user_id = ?');
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $notes_result = $stmt->get_result()->fetch_assoc();

    // Get todos by priority
    $stmt = $conn->prepare('SELECT priority, COUNT(*) as count FROM todos WHERE user_id = ? GROUP BY priority');
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $priority_result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    // Get todos by category
    $stmt = $conn->prepare('SELECT c.name, COUNT(t.id) as count FROM categories c LEFT JOIN todos t ON c.id = t.category_id WHERE c.user_id = ? GROUP BY c.id');
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $category_stats = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

    $stats = [
        'total_todos' => (int)$todos_result['total'],
        'completed_todos' => (int)$todos_result['completed'],
        'pending_todos' => (int)$todos_result['total'] - (int)$todos_result['completed'],
        'completion_rate' => $todos_result['total'] > 0 ? round(((int)$todos_result['completed'] / (int)$todos_result['total']) * 100) : 0,
        'total_categories' => (int)$categories_result['count'],
        'total_notes' => (int)$notes_result['count'],
        'priority_breakdown' => $priority_result,
        'category_breakdown' => $category_stats
    ];

    sendResponse($stats);
}

sendResponse(['error' => 'Invalid request'], 400);
?>
