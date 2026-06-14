<?php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = getRequestData();
    $action = $data['action'] ?? null;

    if ($action === 'register') {
        $email = $data['email'];
        $password = password_hash($data['password'], PASSWORD_BCRYPT);
        $first_name = $data['first_name'] ?? 'User';
        $last_name = $data['last_name'] ?? '';

        $stmt = $conn->prepare('INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)');
        $stmt->bind_param('ssss', $email, $password, $first_name, $last_name);

        if ($stmt->execute()) {
            $user_id = $conn->insert_id;

            // Create default categories
            $default_categories = [
                ['Work', '#667eea', '💼'],
                ['Personal', '#ff6b6b', '🧑'],
                ['Shopping', '#51cf66', '🛒'],
                ['Health', '#ffd43b', '❤️']
            ];

            foreach ($default_categories as $cat) {
                $cat_stmt = $conn->prepare('INSERT INTO categories (user_id, name, color, icon) VALUES (?, ?, ?, ?)');
                $cat_stmt->bind_param('isss', $user_id, $cat[0], $cat[1], $cat[2]);
                $cat_stmt->execute();
            }

            // Create settings
            $settings_stmt = $conn->prepare('INSERT INTO settings (user_id) VALUES (?)');
            $settings_stmt->bind_param('i', $user_id);
            $settings_stmt->execute();

            // Create statistics
            $stats_stmt = $conn->prepare('INSERT INTO statistics (user_id) VALUES (?)');
            $stats_stmt->bind_param('i', $user_id);
            $stats_stmt->execute();

            sendResponse(['success' => true, 'message' => 'User registered successfully', 'user_id' => $user_id]);
        } else {
            sendResponse(['success' => false, 'error' => 'Email already exists'], 400);
        }
    }

    if ($action === 'login') {
        $email = $data['email'];
        $password = $data['password'];

        $stmt = $conn->prepare('SELECT id, password, first_name, last_name FROM users WHERE email = ?');
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            if (password_verify($password, $user['password'])) {
                sendResponse(['success' => true, 'user_id' => $user['id'], 'name' => $user['first_name'] . ' ' . $user['last_name']]);
            }
        }
        sendResponse(['success' => false, 'error' => 'Invalid credentials'], 401);
    }
} elseif ($method === 'GET') {
    $user_id = $_GET['user_id'] ?? null;

    if ($user_id) {
        $stmt = $conn->prepare('SELECT id, email, first_name, last_name FROM users WHERE id = ?');
        $stmt->bind_param('i', $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        sendResponse($user ?: ['error' => 'User not found'], $user ? 200 : 404);
    }
}

sendResponse(['error' => 'Invalid request'], 400);
?>
