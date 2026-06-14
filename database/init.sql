-- Create Database
CREATE DATABASE IF NOT EXISTS todoapp;
USE todoapp;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#667eea',
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Todos Table
CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Notes Table
CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    color VARCHAR(7) DEFAULT '#fff59d',
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User Settings Table
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    theme ENUM('light', 'dark') DEFAULT 'light',
    language VARCHAR(10) DEFAULT 'en',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    timezone VARCHAR(50) DEFAULT 'UTC',
    items_per_page INT DEFAULT 10,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Statistics/Analytics Table
CREATE TABLE IF NOT EXISTS statistics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_todos INT DEFAULT 0,
    completed_todos INT DEFAULT 0,
    total_notes INT DEFAULT 0,
    total_categories INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sample User (email: user@example.com, password: password123)
INSERT INTO users (email, password, first_name, last_name) VALUES
('user@example.com', '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DxJiNe', 'John', 'Doe');

-- Sample Categories
INSERT INTO categories (user_id, name, color, icon) VALUES
(1, 'Work', '#667eea', '💼'),
(1, 'Personal', '#ff6b6b', '🧑'),
(1, 'Shopping', '#51cf66', '🛒'),
(1, 'Health', '#ffd43b', '❤️');

-- Sample Todos
INSERT INTO todos (user_id, category_id, title, description, priority, completed) VALUES
(1, 1, 'Complete Project Report', 'Finish the Q1 project report', 'high', FALSE),
(1, 1, 'Email to Manager', 'Send weekly update to manager', 'medium', TRUE),
(1, 2, 'Gym Session', 'Morning workout - 1 hour', 'high', FALSE),
(1, 3, 'Buy Groceries', 'Milk, Bread, Eggs', 'medium', FALSE);

-- Sample Notes
INSERT INTO notes (user_id, title, content, color, is_pinned) VALUES
(1, 'Quick Reminder', 'Don\'t forget the team meeting at 3 PM', '#fff59d', TRUE),
(1, 'Ideas for Project', 'New features to implement...', '#c8e6c9', FALSE);

-- Sample Settings
INSERT INTO settings (user_id, theme, language, notifications_enabled, timezone) VALUES
(1, 'light', 'en', TRUE, 'America/New_York');

-- Sample Statistics
INSERT INTO statistics (user_id, total_todos, completed_todos, total_notes, total_categories) VALUES
(1, 4, 1, 2, 4);
